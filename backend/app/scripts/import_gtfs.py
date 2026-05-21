import argparse
import logging
import os
import sys
import zipfile
from pathlib import Path

import pandas as pd
from sqlalchemy import text, Table, insert

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))  # backend/

from app.db.base import Base
from app.db.session import SessionLocal, engine

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

CRITICAL_FILES = ["routes.txt", "trips.txt", "stop_times.txt", "stops.txt", "shapes.txt", "calendar.txt"]
OPTIONAL_FILES = ["agency.txt", "calendar_dates.txt"]

IMPORT_ORDER = [
    "agency",
    "routes",
    "trips",
    "stops",
    "stop_times",
    "shapes",
    "calendar",
    "calendar_dates",
]

COLUMN_MAP = {
    "agency": ["agency_id", "agency_name", "agency_url", "agency_timezone", "agency_lang", "agency_phone"],
    "routes": ["route_id", "agency_id", "route_short_name", "route_long_name", "route_type", "route_color", "route_text_color"],
    "trips": ["trip_id", "route_id", "service_id", "shape_id", "trip_headsign", "direction_id"],
    "stop_times": ["trip_id", "arrival_time", "departure_time", "stop_id", "stop_sequence"],
    "stops": ["stop_id", "stop_name", "stop_lat", "stop_lon"],
    "shapes": ["shape_id", "shape_pt_lat", "shape_pt_lon", "shape_pt_sequence"],
    "calendar": ["service_id", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday", "start_date", "end_date"],
    "calendar_dates": ["service_id", "date", "exception_type"],
}

TABLE_MAP = {
    "agency": "agency",
    "routes": "routes",
    "trips": "trips",
    "stop_times": "stop_times",
    "stops": "stops",
    "shapes": "shapes",
    "calendar": "calendar",
    "calendar_dates": "calendar_dates",
}

CHUNK_SIZE = 10000


def read_file(source, filename):
    if os.path.isdir(source):
        path = os.path.join(source, filename)
        if os.path.isfile(path):
            return pd.read_csv(path, dtype=str)

    if zipfile.is_zipfile(source):
        with zipfile.ZipFile(source) as z:
            if filename in z.namelist():
                with z.open(filename) as f:
                    return pd.read_csv(f, dtype=str)

    return None


def clean_df(df, columns):
    available = [c for c in columns if c in df.columns]
    df = df[available].copy()
    df = df.where(df.notna(), None)
    return df


def import_table(source, table_name, columns, db):
    filename = f"{table_name}.txt"
    table_name_db = TABLE_MAP[table_name]

    df = read_file(source, filename)
    if df is None:
        logger.warning(f"  File {filename} not found, skipping")
        return 0

    df = clean_df(df, columns)
    row_count = len(df)

    if not row_count:
        logger.info(f"  {filename}: 0 rows loaded (empty)")
        return 0

    db.execute(text(f"TRUNCATE TABLE {table_name_db} RESTART IDENTITY CASCADE"))

    table_obj = Table(table_name_db, Base.metadata, autoload_with=db.get_bind())
    stmt = insert(table_obj)

    for start in range(0, row_count, CHUNK_SIZE):
        chunk = df.iloc[start : start + CHUNK_SIZE].to_dict(orient="records")
        db.execute(stmt, chunk)

    db.commit()

    logger.info(f"  {filename}: {row_count} rows loaded")
    return row_count


def import_gtfs(source, clear=False, db=None) -> dict:
    logger.info(f"Importing GTFS from: {source}")

    close_db = False
    if db is None:
        db = SessionLocal()
        close_db = True

    stats = {
        "required_files_found": [],
        "optional_files_found": [],
        "rows_per_table": {},
    }

    try:
        if clear:
            logger.info("Clearing all tables...")
            tables = ["calendar_dates", "calendar", "shapes", "stop_times", "trips", "routes", "agency", "stops"]
            for t in tables:
                db.execute(text(f"TRUNCATE TABLE {t} RESTART IDENTITY CASCADE"))
            db.commit()
            logger.info("All tables cleared")

        for name in IMPORT_ORDER:
            filename = f"{name}.txt"
            columns = COLUMN_MAP[name]
            is_critical = filename in CRITICAL_FILES
            is_optional = filename in OPTIONAL_FILES

            if is_critical:
                count = import_table(source, name, columns, db)
                stats["required_files_found"].append(filename)
                stats["rows_per_table"][name] = count
            elif is_optional:
                try:
                    count = import_table(source, name, columns, db)
                    if count > 0:
                        stats["optional_files_found"].append(filename)
                    stats["rows_per_table"][name] = count
                except Exception as e:
                    logger.warning(f"  Optional {filename}: error {e}, skipping")

        logger.info("Import completed successfully")
        return stats

    finally:
        if close_db:
            db.close()


def main():
    parser = argparse.ArgumentParser(description="Import GTFS data into PostgreSQL")
    parser.add_argument("--path", required=True, help="Path to GTFS zip file or directory")
    parser.add_argument("--clear", action="store_true", help="Clear all tables before import")
    args = parser.parse_args()

    source = args.path
    if not os.path.exists(source):
        logger.error(f"Path does not exist: {source}")
        return

    Base.metadata.create_all(bind=engine)
    result = import_gtfs(source, clear=args.clear)
    logger.info(f"Result: {result['required_files_found']}")


if __name__ == "__main__":
    main()

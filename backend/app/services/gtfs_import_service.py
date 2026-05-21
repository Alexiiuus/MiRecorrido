import logging
import zipfile
from pathlib import Path

from fastapi import UploadFile

from app.db.base import Base
from app.db.session import SessionLocal, engine
from app.scripts.import_gtfs import CRITICAL_FILES, import_gtfs

logger = logging.getLogger(__name__)

UPLOAD_DIR = Path("/app/data/uploads")


def ensure_upload_dir():
    UPLOAD_DIR.mkdir(parents=True, exist_ok=True)


def validate_zip(file: UploadFile) -> str:
    if not file.filename or not file.filename.lower().endswith(".zip"):
        raise ValueError("El archivo debe tener extensión .zip")

    content = file.file.read()
    file.file.seek(0)

    if not zipfile.is_zipfile(file.file):
        raise ValueError("El archivo no es un ZIP válido o está corrupto")

    file.file.seek(0)

    with zipfile.ZipFile(file.file) as z:
        names = z.namelist()
        missing = [f for f in CRITICAL_FILES if f not in names]
        if missing:
            raise ValueError(
                f"Faltan archivos obligatorios dentro del ZIP: {', '.join(missing)}"
            )

    file.file.seek(0)
    return content


def save_upload(file: UploadFile) -> Path:
    ensure_upload_dir()
    dest = UPLOAD_DIR / file.filename
    with open(dest, "wb") as f:
        f.write(file.file.read())
    logger.info(f"File saved to {dest}")
    return dest


def run_import(path: str, clear: bool) -> dict:
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        result = import_gtfs(path, clear=clear, db=db)
        return result
    finally:
        db.close()

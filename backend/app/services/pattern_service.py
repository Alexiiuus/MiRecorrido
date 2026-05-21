import re
from collections import defaultdict

from sqlalchemy.orm import Session

from app.repositories.shape_repository import ShapeRepository
from app.repositories.stop_repository import StopRepository
from app.repositories.trip_repository import TripRepository
from app.schemas.pattern import PatternResponse
from app.schemas.shape import ShapePointResponse, ShapeResponse
from app.schemas.stop import StopResponse
from app.services.calendar_service import get_active_service_ids


def make_pattern_id(route_id: str, direction_id: int | None, shape_id: str | None, trip_id: str) -> str:
    parts = [f"route_{route_id}", f"dir_{direction_id or 'X'}", f"shape_{shape_id or 'X'}", f"trip_{trip_id}"]
    return "_".join(parts)


def parse_pattern_id(pattern_id: str) -> dict | None:
    m = re.match(
        r"route_(.+)_dir_(.+)_shape_(.+)_trip_(.+)",
        pattern_id,
    )
    if not m:
        return None
    route_id = m.group(1)
    direction_id = None if m.group(2) == "X" else int(m.group(2))
    shape_id = None if m.group(3) == "X" else m.group(3)
    trip_id = m.group(4)
    return {
        "route_id": route_id,
        "direction_id": direction_id,
        "shape_id": shape_id,
        "trip_id": trip_id,
    }


class PatternService:
    def __init__(self, db: Session):
        self.db = db
        self.trip_repo = TripRepository(db)
        self.shape_repo = ShapeRepository(db)
        self.stop_repo = StopRepository(db)

    def get_patterns(
        self,
        route_id: str,
        date: str | None = None,
        direction_id: int | None = None,
    ) -> list[PatternResponse]:
        trips = self.trip_repo.get_by_route_id(route_id)

        if date:
            active_ids = set(get_active_service_ids(self.db, date))
            trips = [t for t in trips if t.service_id in active_ids]

        if direction_id is not None:
            trips = [t for t in trips if t.direction_id == direction_id]

        groups = defaultdict(list)
        for t in trips:
            key = (t.route_id, t.direction_id, t.shape_id, t.trip_headsign)
            groups[key].append(t)

        patterns = []
        for (r_id, d_id, s_id, headsign), group in groups.items():
            sample = group[0]
            patterns.append(
                PatternResponse(
                    pattern_id=make_pattern_id(r_id, d_id, s_id, sample.trip_id),
                    route_id=r_id,
                    direction_id=d_id,
                    headsign=headsign,
                    shape_id=s_id,
                    sample_trip_id=sample.trip_id,
                )
            )

        patterns.sort(key=lambda p: (p.direction_id or 0, p.headsign or ""))
        return patterns

    def get_shape(self, pattern_id: str) -> ShapeResponse | None:
        parsed = parse_pattern_id(pattern_id)
        if not parsed or not parsed["shape_id"]:
            return None

        shape_id = parsed["shape_id"]
        points = self.shape_repo.get_by_shape_id(shape_id)
        if not points:
            return None

        return ShapeResponse(
            shape_id=shape_id,
            points=[
                ShapePointResponse(lat=p.shape_pt_lat, lon=p.shape_pt_lon, sequence=p.shape_pt_sequence)
                for p in points
            ],
        )

    def get_stops(self, pattern_id: str) -> list[StopResponse] | None:
        parsed = parse_pattern_id(pattern_id)
        if not parsed or not parsed["trip_id"]:
            return None

        trip_id = parsed["trip_id"]
        stop_rows = self.stop_repo.get_by_stop_times(trip_id)
        if not stop_rows:
            return None

        return [
            StopResponse(
                stop_id=r["stop_id"],
                name=r["name"],
                lat=r["lat"],
                lon=r["lon"],
                sequence=r["sequence"],
                arrival_time=r["arrival_time"],
                departure_time=r["departure_time"],
            )
            for r in stop_rows
        ]

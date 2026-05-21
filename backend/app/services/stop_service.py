from sqlalchemy.orm import Session

from app.repositories.route_repository import RouteRepository
from app.repositories.stop_repository import StopRepository
from app.schemas.stop import StopTimeResponse
from app.services.calendar_service import get_active_service_ids


class StopService:
    def __init__(self, db: Session):
        self.db = db
        self.stop_repo = StopRepository(db)
        self.route_repo = RouteRepository(db)

    def get_times(
        self,
        stop_id: str,
        date: str | None = None,
        from_time: str | None = None,
        limit: int = 20,
    ) -> list[StopTimeResponse]:
        active_trip_ids = None
        if date:
            active_service_ids = get_active_service_ids(self.db, date)
            if not active_service_ids:
                return []
            from app.models.trip import Trip
            active_trip_ids = [
                row[0]
                for row in self.db.query(Trip.trip_id)
                .filter(Trip.service_id.in_(active_service_ids))
                .all()
            ]

        rows = self.stop_repo.get_times_by_stop(
            stop_id=stop_id,
            from_time=from_time,
            limit=limit,
            active_trip_ids=active_trip_ids,
        )

        route_ids = {r["route_id"] for r in rows}
        route_map = {}
        for rid in route_ids:
            r = self.route_repo.get_by_id(rid)
            if r:
                route_map[rid] = r.route_short_name

        return [
            StopTimeResponse(
                route_id=r["route_id"],
                route_short_name=route_map.get(r["route_id"], ""),
                trip_id=r["trip_id"],
                headsign=r["headsign"],
                arrival_time=r["arrival_time"],
            )
            for r in rows
        ]

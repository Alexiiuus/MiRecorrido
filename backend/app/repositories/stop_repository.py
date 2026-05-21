from sqlalchemy import text
from sqlalchemy.orm import Session

from app.models.stop import Stop
from app.models.stop_time import StopTime
from app.models.trip import Trip


class StopRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_stop_times(self, trip_id: str) -> list[dict]:
        results = (
            self.db.query(
                Stop.stop_id,
                Stop.stop_name,
                Stop.stop_lat,
                Stop.stop_lon,
                StopTime.stop_sequence,
                StopTime.arrival_time,
                StopTime.departure_time,
            )
            .join(StopTime, Stop.stop_id == StopTime.stop_id)
            .filter(StopTime.trip_id == trip_id)
            .order_by(StopTime.stop_sequence)
            .all()
        )
        return [
            {
                "stop_id": r.stop_id,
                "name": r.stop_name,
                "lat": r.stop_lat,
                "lon": r.stop_lon,
                "sequence": r.stop_sequence,
                "arrival_time": r.arrival_time,
                "departure_time": r.departure_time,
            }
            for r in results
        ]

    def get_times_by_stop(
        self,
        stop_id: str,
        from_time: str | None = None,
        limit: int = 20,
        active_trip_ids: list[str] | None = None,
    ) -> list[dict]:
        query = (
            self.db.query(
                StopTime.arrival_time,
                StopTime.trip_id,
                Trip.route_id,
                Trip.trip_headsign,
            )
            .join(Trip, Trip.trip_id == StopTime.trip_id)
            .filter(StopTime.stop_id == stop_id)
        )

        if active_trip_ids is not None:
            query = query.filter(StopTime.trip_id.in_(active_trip_ids))

        if from_time:
            query = query.filter(text("arrival_time >= :from_time")).params(from_time=from_time)

        query = query.order_by(StopTime.arrival_time).limit(limit)

        return [
            {
                "arrival_time": r.arrival_time,
                "trip_id": r.trip_id,
                "route_id": r.route_id,
                "headsign": r.trip_headsign,
            }
            for r in query.all()
        ]

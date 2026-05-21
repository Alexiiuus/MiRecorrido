from sqlalchemy.orm import Session

from app.models.trip import Trip


class TripRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_route_id(self, route_id: str) -> list[Trip]:
        return self.db.query(Trip).filter(Trip.route_id == route_id).all()

    def get_by_id(self, trip_id: str) -> Trip | None:
        return self.db.query(Trip).filter(Trip.trip_id == trip_id).first()

from sqlalchemy.orm import Session

from app.models.route import Route


class RouteRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self) -> list[Route]:
        return self.db.query(Route).order_by(Route.route_short_name).all()

    def get_by_id(self, route_id: str) -> Route | None:
        return self.db.query(Route).filter(Route.route_id == route_id).first()

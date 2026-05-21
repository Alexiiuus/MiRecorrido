from sqlalchemy.orm import Session

from app.repositories.route_repository import RouteRepository
from app.schemas.route import RouteDetailResponse, RouteListResponse


class RouteService:
    def __init__(self, db: Session):
        self.repo = RouteRepository(db)

    def get_all_routes(self) -> list[RouteListResponse]:
        routes = self.repo.get_all()
        return [
            RouteListResponse(
                route_id=r.route_id,
                short_name=r.route_short_name,
                long_name=r.route_long_name,
                agency_id=r.agency_id,
                color=r.route_color,
                text_color=r.route_text_color,
            )
            for r in routes
        ]

    def get_route_detail(self, route_id: str) -> RouteDetailResponse | None:
        r = self.repo.get_by_id(route_id)
        if not r:
            return None
        return RouteDetailResponse(
            route_id=r.route_id,
            short_name=r.route_short_name,
            long_name=r.route_long_name,
            agency_id=r.agency_id,
            color=r.route_color,
            text_color=r.route_text_color,
        )

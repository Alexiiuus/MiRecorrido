from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.pattern import PatternResponse
from app.schemas.route import RouteDetailResponse, RouteListResponse
from app.services.pattern_service import PatternService
from app.services.route_service import RouteService

router = APIRouter()


@router.get("/routes", response_model=list[RouteListResponse])
def list_routes(db: Session = Depends(get_db)):
    service = RouteService(db)
    return service.get_all_routes()


@router.get("/routes/{route_id}", response_model=RouteDetailResponse)
def get_route(route_id: str, db: Session = Depends(get_db)):
    service = RouteService(db)
    route = service.get_route_detail(route_id)
    if not route:
        raise HTTPException(status_code=404, detail="Route not found")
    return route


@router.get("/routes/{route_id}/patterns", response_model=list[PatternResponse])
def get_patterns(
    route_id: str,
    date: str | None = None,
    direction_id: int | None = None,
    db: Session = Depends(get_db),
):
    service = PatternService(db)
    return service.get_patterns(route_id, date=date, direction_id=direction_id)

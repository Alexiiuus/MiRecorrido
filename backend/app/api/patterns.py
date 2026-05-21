from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.nearest_stop import NearestStopsResponse
from app.schemas.shape import ShapeResponse
from app.schemas.stop import StopResponse
from app.services.pattern_service import PatternService

router = APIRouter()


@router.get("/patterns/{pattern_id}/shape", response_model=ShapeResponse)
def get_pattern_shape(pattern_id: str, db: Session = Depends(get_db)):
    service = PatternService(db)
    shape = service.get_shape(pattern_id)
    if not shape:
        raise HTTPException(status_code=404, detail="Shape not found")
    return shape


@router.get("/patterns/{pattern_id}/stops", response_model=list[StopResponse])
def get_pattern_stops(pattern_id: str, db: Session = Depends(get_db)):
    service = PatternService(db)
    stops = service.get_stops(pattern_id)
    if stops is None:
        raise HTTPException(status_code=404, detail="Pattern or stops not found")
    return stops


@router.get("/patterns/{pattern_id}/nearest-stops", response_model=NearestStopsResponse)
def get_nearest_stops(
    pattern_id: str,
    lat: float = Query(..., ge=-90, le=90),
    lon: float = Query(..., ge=-180, le=180),
    limit: int = Query(2, ge=1, le=5),
    db: Session = Depends(get_db),
):
    service = PatternService(db)
    result = service.get_nearest_stops(pattern_id, lat=lat, lon=lon, limit=limit)
    if result is None:
        raise HTTPException(status_code=404, detail="Pattern not found")
    return result

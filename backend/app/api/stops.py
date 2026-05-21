from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.stop import StopTimeResponse
from app.services.stop_service import StopService

router = APIRouter()


@router.get("/stops/{stop_id}/times", response_model=list[StopTimeResponse])
def get_stop_times(
    stop_id: str,
    date: str | None = None,
    from_time: str | None = None,
    limit: int = Query(default=20, ge=1, le=200),
    db: Session = Depends(get_db),
):
    service = StopService(db)
    return service.get_times(stop_id, date=date, from_time=from_time, limit=limit)

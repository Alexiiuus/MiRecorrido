from fastapi import APIRouter, HTTPException, Query

from app.schemas.routing import WalkingRouteResponse
from app.services.routing_service import get_walking_route

router = APIRouter(tags=["routing"])


@router.get(
    "/routing/walking-route",
    response_model=WalkingRouteResponse,
)
def walking_route(
    from_lat: float = Query(..., ge=-90, le=90),
    from_lon: float = Query(..., ge=-180, le=180),
    to_lat: float = Query(..., ge=-90, le=90),
    to_lon: float = Query(..., ge=-180, le=180),
    profile: str = Query("walking", pattern="^(walking|driving|cycling)$"),
):
    try:
        return get_walking_route(
            from_lat=from_lat,
            from_lon=from_lon,
            to_lat=to_lat,
            to_lon=to_lon,
            profile=profile,
        )
    except RuntimeError as exc:
        raise HTTPException(
            status_code=404,
            detail="No se encontró una ruta disponible hacia la parada.",
        ) from exc
    except Exception as exc:
        raise HTTPException(
            status_code=502,
            detail="No se pudo obtener la ruta hacia la parada.",
        ) from exc

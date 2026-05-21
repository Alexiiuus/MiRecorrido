from pydantic import BaseModel


class CoordinateResponse(BaseModel):
    lat: float
    lon: float


class WalkingRouteResponse(BaseModel):
    origin: CoordinateResponse
    destination: CoordinateResponse
    distance_meters: float | None = None
    duration_seconds: float | None = None
    geometry: list[CoordinateResponse]
    provider: str

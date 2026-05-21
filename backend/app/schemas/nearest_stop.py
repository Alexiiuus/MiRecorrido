from pydantic import BaseModel


class UserLocationResponse(BaseModel):
    lat: float
    lon: float


class NearestStopResponse(BaseModel):
    stop_id: str
    name: str
    street_name: str | None = None
    lat: float
    lon: float
    sequence: int | None = None
    distance_meters: float


class NearestStopsResponse(BaseModel):
    pattern_id: str
    user_location: UserLocationResponse
    nearest_stops: list[NearestStopResponse]

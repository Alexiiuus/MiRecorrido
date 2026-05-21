from pydantic import BaseModel


class StopResponse(BaseModel):
    stop_id: str
    name: str
    lat: float
    lon: float
    sequence: int
    arrival_time: str | None = None
    departure_time: str | None = None


class StopTimeResponse(BaseModel):
    route_id: str
    route_short_name: str
    trip_id: str
    headsign: str | None = None
    arrival_time: str

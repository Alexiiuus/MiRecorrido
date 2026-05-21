from pydantic import BaseModel


class StopTimeResponse(BaseModel):
    stop_id: str
    name: str
    lat: float
    lon: float
    sequence: int
    arrival_time: str | None = None
    departure_time: str | None = None

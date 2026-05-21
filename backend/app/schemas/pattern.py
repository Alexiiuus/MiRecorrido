from pydantic import BaseModel


class PatternResponse(BaseModel):
    pattern_id: str
    route_id: str
    direction_id: int | None = None
    headsign: str | None = None
    shape_id: str | None = None
    sample_trip_id: str

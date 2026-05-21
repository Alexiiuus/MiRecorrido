from pydantic import BaseModel


class ShapePointResponse(BaseModel):
    lat: float
    lon: float
    sequence: int


class ShapeResponse(BaseModel):
    shape_id: str
    points: list[ShapePointResponse]

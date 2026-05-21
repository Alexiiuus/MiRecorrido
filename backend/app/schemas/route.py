from pydantic import BaseModel


class RouteBase(BaseModel):
    route_id: str
    short_name: str | None = None
    long_name: str | None = None
    agency_id: str | None = None
    color: str | None = None
    text_color: str | None = None


class RouteListResponse(BaseModel):
    route_id: str
    short_name: str | None = None
    long_name: str | None = None
    agency_id: str | None = None
    color: str | None = None
    text_color: str | None = None


class RouteDetailResponse(BaseModel):
    route_id: str
    short_name: str | None = None
    long_name: str | None = None
    agency_id: str | None = None
    color: str | None = None
    text_color: str | None = None

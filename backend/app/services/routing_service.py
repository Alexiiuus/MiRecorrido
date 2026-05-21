import httpx

from app.schemas.routing import CoordinateResponse, WalkingRouteResponse

OSRM_BASE_URL = "https://router.project-osrm.org"


def _osrm_profile(profile: str) -> str:
    mapping = {
        "walking": "foot",
        "driving": "driving",
        "cycling": "cycling",
    }
    return mapping.get(profile, "foot")


def get_walking_route(
    from_lat: float,
    from_lon: float,
    to_lat: float,
    to_lon: float,
    profile: str = "walking",
) -> WalkingRouteResponse:
    osrm_profile = _osrm_profile(profile)
    url = (
        f"{OSRM_BASE_URL}/route/v1/{osrm_profile}"
        f"/{from_lon},{from_lat};{to_lon},{to_lat}"
        f"?overview=full&geometries=geojson"
    )

    with httpx.Client(timeout=15) as client:
        resp = client.get(url)
        resp.raise_for_status()
        data = resp.json()

    if data.get("code") != "Ok" or not data.get("routes"):
        raise RuntimeError("OS RM did not return a route")

    route = data["routes"][0]
    coords_geojson = route["geometry"]["coordinates"]

    geometry = [
        CoordinateResponse(lat=float(pt[1]), lon=float(pt[0]))
        for pt in coords_geojson
    ]

    distance_meters = round(route.get("distance", 0), 1) or None
    duration_seconds = round(route.get("duration", 0), 1) or None

    return WalkingRouteResponse(
        origin=CoordinateResponse(lat=from_lat, lon=from_lon),
        destination=CoordinateResponse(lat=to_lat, lon=to_lon),
        distance_meters=distance_meters,
        duration_seconds=duration_seconds,
        geometry=geometry,
        provider="osrm",
    )

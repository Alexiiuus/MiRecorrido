from fastapi import FastAPI

from app.api.gtfs import router as gtfs_router
from app.api.health import router as health_router
from app.api.patterns import router as patterns_router
from app.api.routes import router as routes_router
from app.api.routing import router as routing_router
from app.api.stops import router as stops_router

app = FastAPI(title="MiRecorrido API", version="0.1.0")

app.include_router(health_router)
app.include_router(routes_router)
app.include_router(patterns_router)
app.include_router(stops_router)
app.include_router(routing_router)
app.include_router(gtfs_router, prefix="/gtfs", tags=["GTFS"])

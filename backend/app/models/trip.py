from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Trip(Base):
    __tablename__ = "trips"

    trip_id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    route_id: Mapped[str] = mapped_column(String, ForeignKey("routes.route_id"), index=True)
    service_id: Mapped[str] = mapped_column(String, index=True)
    shape_id: Mapped[str | None] = mapped_column(String, index=True, nullable=True)
    trip_headsign: Mapped[str | None] = mapped_column(String, nullable=True)
    direction_id: Mapped[int | None] = mapped_column(Integer, nullable=True)

    route = relationship("Route", back_populates="trips")
    stop_times = relationship("StopTime", back_populates="trip")

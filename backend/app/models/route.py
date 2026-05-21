from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class Route(Base):
    __tablename__ = "routes"

    route_id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    agency_id: Mapped[str | None] = mapped_column(String, ForeignKey("agency.agency_id"), nullable=True)
    route_short_name: Mapped[str | None] = mapped_column(String, nullable=True)
    route_long_name: Mapped[str | None] = mapped_column(String, nullable=True)
    route_type: Mapped[int | None] = mapped_column(Integer, nullable=True)
    route_color: Mapped[str | None] = mapped_column(String, nullable=True)
    route_text_color: Mapped[str | None] = mapped_column(String, nullable=True)

    trips = relationship("Trip", back_populates="route")

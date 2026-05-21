from sqlalchemy import ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base


class StopTime(Base):
    __tablename__ = "stop_times"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    trip_id: Mapped[str] = mapped_column(String, ForeignKey("trips.trip_id"), index=True)
    arrival_time: Mapped[str] = mapped_column(String, nullable=False)
    departure_time: Mapped[str] = mapped_column(String, nullable=False)
    stop_id: Mapped[str] = mapped_column(String, ForeignKey("stops.stop_id"), index=True)
    stop_sequence: Mapped[int] = mapped_column(Integer, nullable=False)

    trip = relationship("Trip", back_populates="stop_times")

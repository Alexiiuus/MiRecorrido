from sqlalchemy import Float, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Stop(Base):
    __tablename__ = "stops"

    stop_id: Mapped[str] = mapped_column(String, primary_key=True, index=True)
    stop_name: Mapped[str] = mapped_column(String, nullable=False)
    stop_lat: Mapped[float] = mapped_column(Float, nullable=False)
    stop_lon: Mapped[float] = mapped_column(Float, nullable=False)

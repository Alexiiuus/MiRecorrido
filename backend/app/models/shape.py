from sqlalchemy import Float, Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Shape(Base):
    __tablename__ = "shapes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    shape_id: Mapped[str] = mapped_column(String, index=True)
    shape_pt_lat: Mapped[float] = mapped_column(Float, nullable=False)
    shape_pt_lon: Mapped[float] = mapped_column(Float, nullable=False)
    shape_pt_sequence: Mapped[int] = mapped_column(Integer, nullable=False)

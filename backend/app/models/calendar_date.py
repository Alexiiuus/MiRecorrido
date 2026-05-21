from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class CalendarDate(Base):
    __tablename__ = "calendar_dates"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    service_id: Mapped[str] = mapped_column(String, index=True)
    date: Mapped[str] = mapped_column(String, nullable=False)
    exception_type: Mapped[int] = mapped_column(Integer, nullable=False)

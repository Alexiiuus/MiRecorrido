from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Agency(Base):
    __tablename__ = "agency"

    agency_id: Mapped[str] = mapped_column(String, primary_key=True)
    agency_name: Mapped[str] = mapped_column(String, nullable=False)
    agency_url: Mapped[str] = mapped_column(String, nullable=False)
    agency_timezone: Mapped[str] = mapped_column(String, nullable=False)
    agency_lang: Mapped[str | None] = mapped_column(String, nullable=True)
    agency_phone: Mapped[str | None] = mapped_column(String, nullable=True)

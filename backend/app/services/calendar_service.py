from datetime import datetime

from sqlalchemy.orm import Session

from app.models.calendar import Calendar
from app.models.calendar_date import CalendarDate


def get_active_service_ids(db: Session, date_str: str) -> list[str]:
    date = datetime.strptime(date_str, "%Y-%m-%d")
    weekday = date.weekday()
    weekday_map = {0: "monday", 1: "tuesday", 2: "wednesday", 3: "thursday", 4: "friday", 5: "saturday", 6: "sunday"}
    weekday_col = weekday_map[weekday]

    calendars = (
        db.query(Calendar)
        .filter(
            Calendar.start_date <= date_str,
            Calendar.end_date >= date_str,
        )
        .all()
    )

    active = set()
    for cal in calendars:
        if getattr(cal, weekday_col) == 1:
            active.add(cal.service_id)

    exceptions = db.query(CalendarDate).filter(CalendarDate.date == date_str).all()
    for exc in exceptions:
        if exc.exception_type == 1:
            active.add(exc.service_id)
        elif exc.exception_type == 2:
            active.discard(exc.service_id)

    return list(active)

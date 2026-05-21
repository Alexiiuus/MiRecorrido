from sqlalchemy.orm import Session

from app.models.shape import Shape


class ShapeRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_by_shape_id(self, shape_id: str) -> list[Shape]:
        return (
            self.db.query(Shape)
            .filter(Shape.shape_id == shape_id)
            .order_by(Shape.shape_pt_sequence)
            .all()
        )

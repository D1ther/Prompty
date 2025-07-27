from sqlalchemy import (
    Column,
    ForeignKey,
    Table
)

from app.db.db_config import Base

completed_lessons = Table(
    "completed_lessons",
    Base.metadata,
    Column("user_id", ForeignKey("users.id"), primary_key=True),
    Column("lesson_id", ForeignKey("lessons.id"), primary_key=True)
)
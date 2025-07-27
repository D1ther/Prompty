from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship
)

from sqlalchemy import ForeignKey

from typing import List

from app.db.db_config import (
    Base
)

class Directly(Base):
    __tablename__ = "directlies"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(unique=True, nullable=False)
    description: Mapped[str] = mapped_column(nullable=True)

    lessons: Mapped[List["Lesson"]] = relationship(back_populates="directly")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "lessons": [lesson.to_dict() for lesson in self.lessons],
            "lessons_count": len(self.lessons)
        }
    
    def __repr__(self):
        return f"<Directly(id={self.id}, title={self.title}), description={self.description})>"
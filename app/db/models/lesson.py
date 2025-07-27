from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship
)

from sqlalchemy import ForeignKey

from typing import List

from app.db.db_config import Base

class Lesson(Base):
    __tablename__ = "lessons"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(nullable=False)
    description: Mapped[str] = mapped_column(nullable=False)

    completed_by: Mapped[List["User"]] = relationship(secondary="completed_lessons", back_populates="completed_lessons")

    directly_id: Mapped[int] = mapped_column(ForeignKey("directlies.id"))
    directly: Mapped["Directly"] = relationship(back_populates="lessons")

    prompts: Mapped[List["Prompt"]] = relationship(back_populates="lesson")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "directly_id": self.directly_id,
            "directly": self.directly.to_dict() if self.directly else None,
        }
    
    def __repr__(self):
        return f"<Lesson(id={self.id}, title='{self.title}', description='{self.description}', directly_id={self.directly_id}, directly={self.directly}, prompts={self.prompts}, completed_by={self.completed_by})>"
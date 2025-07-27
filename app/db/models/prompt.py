from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship
)

from sqlalchemy import ForeignKey

from app.db.db_config import Base

class Prompt(Base):
    __tablename__ = "prompts"

    id: Mapped[int] = mapped_column(primary_key=True)
    text: Mapped[str] = mapped_column(nullable=False)

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"))
    user: Mapped["User"] = relationship(back_populates="prompts")

    lesson_id: Mapped[int] = mapped_column(ForeignKey("lessons.id"))
    lesson: Mapped["Lesson"] = relationship(back_populates="prompts")

    def to_dict(self):
        return {
            "id": self.id,
            "text": self.text,
            "lesson_id": self.lesson_id
        }
    
    def __repr__(self):
        return f"<Promp(id={self.id}, text='{self.text}', lesson_id={self.lesson_id})>"
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship
)

from sqlalchemy import String

from typing import List

from app.db.db_config import Base

import bcrypt


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    username: Mapped[str] = mapped_column(String(50), nullable=False)
    email: Mapped[str] = mapped_column(nullable=False, unique=True)
    password: Mapped[str] = mapped_column(nullable=False)

    prompts: Mapped[List["Prompt"]] = relationship(back_populates="user")
    
    completed_lessons: Mapped[List["Lesson"]] = relationship(back_populates="completed_by", secondary="completed_lessons")

    level: Mapped["Level"] = relationship(back_populates="user", uselist=False)

    def hash_password(self) -> None:
        self.password = bcrypt.hashpw(self.password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

    def check_password(self, password: str) -> bool:
        return bcrypt.checkpw(password.encode("utf-8"), self.password.encode("utf-8"))
    
    def to_dict(self) -> dict:
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "completed_lessons": [lesson.to_dict() for lesson in self.completed_lessons],
            "level": self.level.to_dict() if self.level else None
        }
    
    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}', email='{self.email}', completed_lessons={len(self.completed_lessons)}, level={self.level})>"
    

    
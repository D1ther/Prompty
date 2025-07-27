from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from sqlalchemy import (
    ForeignKey
)

from typing import List

from app.db.db_config import (
    Base
)


class Level(Base):
    __tablename__ = "levels"

    id: Mapped[int] = mapped_column(primary_key=True)
    title: Mapped[str] = mapped_column(nullable=False)

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=True)
    user: Mapped[List["User"]] = relationship(back_populates="level")

    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "user_id": self.user_id
        }
    
    def __repr__(self):
        return f"<Level(id={self.id}, title='{self.title}', user_id={self.user_id})>"


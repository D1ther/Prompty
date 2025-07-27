from app.db.db_config import (
    Session
)

from app.db.models import Lesson

def get_all_lessons():
    with Session.begin() as session:
        lessons = session.query(Lesson).all()
        return [
            {
                "id": lesson.id,
                "title": lesson.title,
                "description": lesson.description,
                "directly_id": lesson.directly_id
            }
            for lesson in lessons
        ]
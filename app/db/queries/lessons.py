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
    
def get_lesson_by_id(lesson_id: int):
    with Session.begin() as session:
        lesson = session.query(Lesson).filter_by(id=lesson_id).one_or_none()

        if not lesson:
            return None
        
        return {
            "id": lesson.id,
            "title": lesson.title,
            "description": lesson.description,
            "directly_id": lesson.directly_id,
            "directly": lesson.directly
            }
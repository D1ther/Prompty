from app.db.db_config import (
    Session
)

from app.db.models import Lesson, User

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
            "directly": {
                "id": lesson.directly.id,
                "title": lesson.directly.title,
                "description": lesson.directly.description
            }
            }
    
def complete_lesson(user_email: str, lesson_id: int):
    with Session() as session:
        user = session.query(User).filter_by(email=user_email).one_or_none()

        if not user:
            return {"error": "User not found", "status": 404}
        
        lesson = session.query(Lesson).filter_by(id=lesson_id).one_or_none()

        if not lesson:
            return {"error": "Lesson not found", "status": 404}
        
        if lesson in user.completed_lessons:
            return {"error": "Lesson already completed", "status": 409}
        
        user.completed_lessons.append(lesson)
        session.commit()

        return {"message": "Lesson completed successfully", "status": 200}
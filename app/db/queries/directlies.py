from app.db.db_config import (
    Session
)

from app.db.models import Directly

def get_directly_by_id(program_id: int):
    with Session.begin() as session:
        directly = session.query(Directly).filter_by(id=program_id).one_or_none()

        if not directly:
            return None
        
        return {
            "id": directly.id,
            "title": directly.title,
            "description": directly.description,
            "lessons_count": len(directly.lessons),
            "lessons":[
                {
                    "id": lesson.id,
                    "title": lesson.title,
                    "description": lesson.description,
                    "directly_id": lesson.directly_id
                }
                for lesson in directly.lessons
            ]
        }
from app.db.db_config import Session
from app.db.models import Prompt, User

def add_prompt(user_email: int, lesson_id: int, text: str):
    with Session() as session:
        user = session.query(User).filter_by(email=user_email).one_or_none()

        if not user:
            return {"error": "User not found", "status": 404}
        
        new_prompt = Prompt(
            user_id=user.id,
            lesson_id=lesson_id,
            text=text
        )

        session.add(new_prompt)
        session.commit()
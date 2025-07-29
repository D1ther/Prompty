from app.db.db_config import Session

from app.db.models import User, Level

from sqlalchemy import func

def create_user(username: str, email: str, password: str):
    with Session.begin() as session:
        user = session.query(User).filter_by(email=email).one_or_none()

        if user:
            return {"error": "User already exists", "status": 409}
        
        new_user = User(
            username=username,
            email=email,
            password=password
        )

        new_user.hash_password()

        session.add(new_user)
        session.flush()

        return new_user.to_dict()
    
def get_user_by_email(email: str) -> dict | None:
    with Session.begin() as session:
        user = session.query(User).filter_by(email=email).one_or_none()
        
        if not user:
            return None
        
        return user.to_dict()
    

def verefy_user(email: str, password: str) -> dict | None:
    with Session.begin() as session:
        user = session.query(User).filter_by(email=email).one_or_none()
        
        if not user:
            return None
        
        if not user.check_password(password):
            return {"error": "Invalid credentials", "status": 401}

        return user.to_dict()
    
def get_all_prompts(user_email: str):
    with Session.begin() as session:
        user = session.query(User).filter_by(email=user_email).one_or_none()

        if not user:
            return {"error": "User not found", "status": 404}
        
        return [prompt.to_dict() for prompt in user.prompts]

def get_completed_lessons(user_email: str):
    with Session.begin() as session:
        user = session.query(User).filter_by(email=user_email).one_or_none()

        if not user:
            return {"error": "User not found", "status": 404}
        
        return [
            {
                "id": lesson.id,
                "title": lesson.title,
                "description": lesson.description,
                "directly_id": lesson.directly_id
            }
            for lesson in user.completed_lessons
        ]
    
def set_user_level(user_email: str, level_id: int):
    with Session.begin() as session:
        user = session.query(User).filter_by(email=user_email).one_or_none()

        if not user:
            return {"error": "User not found", "status": 404}
        
        level = session.query(Level).filter_by(id=level_id).one_or_none()

        if not level:
            return {"error": "Level not found", "status": 404}
        
        if user.level == level:
            return {"error": "User already at this level", "status": 400}
        
        user.level = level
        session.add(user)

        session.flush()

        return user.to_dict()
        
def get_all_users_ranking():
    with Session.begin() as session:
        users = session.query(User, func.count(User.completed_lessons)).join(User.completed_lessons).group_by(User.id).order_by(func.count(User.completed_lessons).desc()).all()

        return [
            {
                **user.to_dict(), "completed_lessons_count": completed_lessons_count
            }
            for user, completed_lessons_count in users
        ]

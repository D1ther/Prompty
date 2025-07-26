from app.db.db_config import Session

from app.db.models import User

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
        
        return user.to_dict
    

def verefy_user(email: str, password: str) -> dict | None:
    with Session.begin() as session:
        user = session.query(User).filter_by(email=email).one_or_none()
        
        if not user:
            return None
        
        if not user.check_password(password):
            return {"error": "Invalid credentials", "status": 401}

        return user.to_dict()

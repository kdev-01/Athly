from sqlalchemy.orm import Session
from src.models.user import User
from src.models.role import Role

class UserCRUD:
    @staticmethod
    def get_user_by_email(db: Session, email: str) -> User:
        return db.query(User).filter(User.email == email).join(Role).first()
    
    """def get_email_if_exists(db: Session, email: str) -> str:
    return db.query(User.email).filter(User.email == email).scalar()"""
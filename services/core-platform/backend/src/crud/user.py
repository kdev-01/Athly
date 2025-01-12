from sqlalchemy.orm import Session
from src.models.user import User

class UserCRUD:
    @staticmethod
    def get_user_by_email(db: Session, email: str) -> User:
        return db.query(User).filter(User.email == email).first()
    
    @staticmethod
    def email_exists(db: Session, email: str) -> str:
        return db.query(User.email).filter(User.email == email).scalar()
    
    @staticmethod
    def change_password(db:Session, email: str, password: str, is_temporary: bool):
        user = UserCRUD.get_user_by_email(db, email)
        user.password = password
        user.temporary_password = is_temporary
        db.commit()
    
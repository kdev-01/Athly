from sqlalchemy.orm import Session
from src.models import User
from src.schemas.user import UserCreate

def get_users(db: Session):
    return db.query(User).all()

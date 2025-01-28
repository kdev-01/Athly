from sqlalchemy.orm import Session
from src.models.sport import Sport

def get_sports(db: Session):
    return db.query(Sport).all()

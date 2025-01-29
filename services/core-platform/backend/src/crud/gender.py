from sqlalchemy.orm import Session
from src.models.gender import Gender

class GenderCRUD:
    @staticmethod
    def get_gender_id(db: Session, gender: str) -> int:
        result = (
            db.query(Gender.gender_id)
            .filter(Gender.type == gender)
            .scalar()
        )
        return result
    
    def get_gender_name(db: Session, id: int) -> str:
        result = (
            db.query(Gender.type)
            .filter(Gender.gender_id == id)
            .scalar()
        )
        return result
    
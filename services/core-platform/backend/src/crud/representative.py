from sqlalchemy.orm import Session
from typing import Dict
from src.models.representative import Representative
from src.models.user import User

class RepresentativeCRUD:
    @staticmethod
    def representative_exists(db: Session, email: str) -> int:
        result = (
            db.query(Representative.representative_id)
            .join(User, User.user_id == Representative.user_id)
            .filter(User.email == email)
            .scalar()
        )
        return result
    
    @staticmethod
    def insert_representative(db: Session, representative: Dict):
        new_representative = Representative(**representative)
        db.add(new_representative)
        db.commit()
        db.refresh(new_representative)
        
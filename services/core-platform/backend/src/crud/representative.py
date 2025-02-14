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
    def get_representative(db: Session, email: str):
        result = (
            db.query(Representative.institution_id)
            .join(User, User.user_id == Representative.user_id)
            .filter(User.email == email)
            .scalar()
        )
        return result
    
    @staticmethod
    def get_representative_by_id(db: Session, user_id: int):
        result = (
            db.query(Representative)
            .filter(Representative.user_id == user_id)
            .first()
        )
        return result
    
    @staticmethod
    def exists_replacement (db: Session, institution_id: int, user_id: int):
        result = (
            db.query(Representative)
            .filter(Representative.institution_id == institution_id,
                    Representative.user_id != user_id,
                    Representative.is_deleted == False)
            .first()
        )
        return result

    @staticmethod
    def insert_representative(db: Session, representative: Dict):
        new_representative = Representative(**representative)
        db.add(new_representative)
        db.commit()
        db.refresh(new_representative)
    
    @staticmethod
    def update_representative(db: Session, representative: Representative):
        db.add(representative)
        db.commit()
        db.refresh(representative)

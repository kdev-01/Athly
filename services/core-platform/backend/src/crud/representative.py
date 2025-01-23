from sqlalchemy.orm import Session
from typing import Dict
from src.models.representative import Representative

class RepresentativeCRUD:
    @staticmethod
    def insert_representative(db: Session, representative: Dict):
        new_representative = Representative(**representative)
        db.add(new_representative)
        db.commit()
        db.refresh(new_representative)
        
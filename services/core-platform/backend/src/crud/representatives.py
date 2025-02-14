from typing import List, Optional

from sqlalchemy.orm import Session

from src.models.representative import Representative as RepresentativeModel

def get_representatives(db: Session, institution_id: Optional[int] = None, skip: int = 0, limit: int = 100):
    query = db.query(RepresentativeModel)
    if institution_id:
        query = query.filter(RepresentativeModel.institution_id == institution_id)
    return query.offset(skip).limit(limit).all()
from sqlalchemy.orm import Session
from src.models.educational_institution import EducationalInstitution
from src.schemas.institutions import InstitutionCreate, InstitutionUpdate

def get_all_institutions(db: Session):
    return db.query(EducationalInstitution).all()

def get_institution_by_id(db: Session, institution_id: int):
    return db.query(EducationalInstitution).filter(EducationalInstitution.institution_id == institution_id).first()

def create_institution(db: Session, institution: InstitutionCreate):
    new_institution = EducationalInstitution(**institution.dict())
    db.add(new_institution)
    db.commit()
    db.refresh(new_institution)
    return new_institution

def update_institution(db: Session, institution_id: int, institution: InstitutionUpdate):
    db_institution = db.query(EducationalInstitution).filter(EducationalInstitution.institution_id == institution_id).first()
    if not db_institution:
        return None

    for key, value in institution.dict(exclude_unset=True).items():
        setattr(db_institution, key, value)
    
    db.commit()
    db.refresh(db_institution)
    return db_institution

def delete_institution(db: Session, institution_id: int):
    db_institution = db.query(EducationalInstitution).filter(EducationalInstitution.institution_id == institution_id).first()
    if not db_institution:
        return None

    db.delete(db_institution)
    db.commit()
    return db_institution

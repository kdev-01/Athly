from sqlalchemy.orm import Session
from src.models.educational_institution import EducationalInstitution

class InstitutionCRUD:
    @staticmethod
    def institution_exists(db: Session, name: str) -> str:
        return db.query(EducationalInstitution.institution_id).filter(EducationalInstitution.name == name).scalar()
    
    @staticmethod
    def get_all_institution(db: Session) -> list[dict]:
        result = (
            db.query(
                EducationalInstitution.institution_id.label('id'),
                EducationalInstitution.name.label('value')
            ).all()
        )

        return [dict(row._mapping) for row in result]

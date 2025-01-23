from fastapi import HTTPException
from sqlalchemy.orm import Session
from typing import List
from src.crud.educational_institution import InstitutionCRUD

class InstitutionService:
    @staticmethod
    def get_institutions(
        db: Session
    ) -> List:
        institutions = InstitutionCRUD.get_all_institution(db)

        if not institutions:
            raise HTTPException(status_code=404, detail="Hubo un error en la carga de instituciones, por favor inténtelo más tarde.")

        return InstitutionCRUD.get_all_institution(db)
    
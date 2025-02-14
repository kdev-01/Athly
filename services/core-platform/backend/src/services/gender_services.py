from fastapi import HTTPException
from sqlalchemy.orm import Session
from typing import List
from src.crud.gender import GenderCRUD

class GenderService:
    @staticmethod
    def get_genders(
        db: Session
    ) -> List:
        genders = GenderCRUD.get_all_genders(db)

        if not genders:
            raise HTTPException(status_code=404, detail="Hubo un error en la carga de generos, por favor inténtelo más tarde.")

        return genders
    
from fastapi import HTTPException
from sqlalchemy.orm import Session
from typing import List
from src.crud.role import RoleCRUD

class RoleService:
    @staticmethod
    def get_roles(
        db: Session
    ) -> List:
        roles = RoleCRUD.get_all_roles(db)

        if not roles:
            raise HTTPException(status_code=404, detail="Hubo un error en la carga de roles, por favor inténtelo más tarde.")

        return RoleCRUD.get_all_roles(db)
    
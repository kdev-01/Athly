from sqlalchemy.orm import Session
from src.models.role import Role

class RoleCRUD:
    @staticmethod
    def role_exists(db: Session, role_name: str) -> int:
        return db.query(Role.role_id).filter(Role.name == role_name).scalar()

    @staticmethod
    def get_all_roles(db: Session) -> list[dict]:
        result = (
            db.query(
                Role.role_id.label('id'),
                Role.name.label('value')
            )
            .all()
        )

        return [dict(row._mapping) for row in result]
    
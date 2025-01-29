from sqlalchemy.orm import Session
from typing import Dict, Any
from src.models.user import User
from src.models.role import Role
from src.models.representative import Representative
from src.models.educational_institution import EducationalInstitution
from src.models.judge import Judge

class UserCRUD:
    @staticmethod
    def get_userole_credentials(db: Session, email: str):
        result = (
            db.query(User.email,
                     User.password,
                     User.temporary_password,
                     User.first_name,
                     User.last_name,
                     Role.name)
            .join(Role,User.role_id == Role.role_id)
            .filter(User.email == email)
            .first()
        )
        return result
    
    @staticmethod
    def get_user_by_email(db: Session, email: str) -> User:
        return db.query(User).filter(User.email == email).first()
    
    @staticmethod
    def email_exists(db: Session, email: str) -> str:
        return db.query(User.email).filter(User.email == email).scalar()
    
    @staticmethod
    def change_password(db:Session, email: str, password: str, is_temporary: bool):
        user = UserCRUD.get_user_by_email(db, email)
        user.password = password
        user.temporary_password = is_temporary
        db.commit()
    
    @staticmethod
    def get_all_users(db: Session) -> list[User]:
        result = (
            db.query(
                User.user_id.label('id'),
                User.photo_url.label('photo_url'),
                User.first_name.label('first_name'),
                User.last_name.label('last_name'),
                User.email.label('email'),
                User.phone.label('phone'),
                Role.name.label('role'),
                EducationalInstitution.name.label('name_institution'),
                Judge.status.label('status_judge'))
            .outerjoin(Role, User.role_id == Role.role_id)
            .outerjoin(Representative, User.user_id == Representative.user_id)
            .outerjoin(EducationalInstitution, EducationalInstitution.institution_id == Representative.institution_id)
            .outerjoin(Judge, Judge.user_id == User.user_id)
            .all()
        )

        return [dict(row._mapping) for row in result]
    
    @staticmethod
    def insert_user(db: Session, user_data: Dict[str, Any]):
        new_user = User(**user_data)
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user
    
    @staticmethod
    def update_data_user(db: Session, user: User):
        db.add(user)
        db.commit()
        db.refresh(user)

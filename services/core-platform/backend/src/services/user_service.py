from pathlib import Path
from fastapi import HTTPException
from sqlalchemy.orm import Session
from typing import Dict, List
from src.services.auth_service import AuthService
from src.services.email_service import EmailService
from src.crud.user import UserCRUD
from src.crud.role import RoleCRUD
from src.crud.educational_institution import InstitutionCRUD
from src.crud.representative import RepresentativeCRUD
from src.crud.judge import JudgeCrud

class UserService:
    @staticmethod
    def get_user_profile(
        db: Session,
        user: dict
    ):
        user_data = UserCRUD.get_user_by_email(db, user.get("email"))
        return user_data

    @staticmethod
    def get_users(db: Session) -> List:
        return UserCRUD.get_all_users(db)
    
    @staticmethod
    async def load_users(
        data: Dict,
        db: Session
    ):
        results = {"success": [], "failed": []}
        for user in data:
            try:
                email = user["email"]
                role_name = user["role_name"]
                role_id = RoleCRUD.role_exists(db, user["role_name"])
                if not role_id:
                    results["failed"].append(
                        {"error": f"El correo {email} no pudo ser registrado, debido que",
                         "message": f"El rol {role_name} no existe."}
                    )
                    continue

                if UserCRUD.email_exists(db, email):
                    results["failed"].append(
                        {"error": f"El correo {email}",
                         "message": "Ya está registrado."}
                    )
                    continue

                if user["role_name"] == "Institución educativa":
                    institution_name = user["institution_name"]
                    institution_id = InstitutionCRUD.institution_exists(db, institution_name)
                    if not institution_id:
                        results["failed"].append(
                            {"error": f"El correo {email} no pudo ser registrado, debido que",
                            "message": f"La unidad educativa {institution_name} no existe."}
                        )
                        continue
                
                password = AuthService.generate_password()
                email_service = EmailService()
                await email_service.send_access_details(email, password)

                user_data = {
                    "first_name": "S/N",
                    "last_name": "S/A",
                    "email": email,
                    "password": password,
                    "temporary_password": True,
                    "phone": "0000000000",
                    "role_id": role_id
                }
                new_user = UserCRUD.insert_user(db, user_data)
                results["success"].append(
                    {
                        "email": user["email"],
                        "id": new_user.user_id,
                    }
                )

                if user["role_name"] == "Institución educativa":
                    representative_data = {
                        "user_id": new_user.user_id,
                        "institution_id": institution_id
                    }
                    RepresentativeCRUD.insert_representative(db, representative_data)

                if user["role_name"] == "Juez":
                    judges_data = {
                        "status": False,
                        "user_id": new_user.user_id
                    }
                    JudgeCrud.insert_judge(db, judges_data)
                    
            except KeyError as e:
                results["failed"].append(
                    {"email": user.get("email"), "error": f"Falta clave requerida: {str(e)}"}
                )
            except Exception as e:
                results["failed"].append(
                    {"email": user.get("email"), "error": str(e)}
                )

        return results
    
    @staticmethod
    def register_data(
        profile_image: bytes,
        filename: str,
        first_name: str,
        last_name: str,
        email: str,
        phone: str,
        db: Session
    ):
        user = UserCRUD.get_user_by_email(db, email)
        if not user:
            raise HTTPException(status_code=403, detail="No se encuentra registrado en el sistema.")
        
        if user.first_name != "S/N" or user.last_name != "S/A":
            raise HTTPException(status_code=400, detail="Usted ya ha realizado esta acción")

        if profile_image is not None:
            extension = Path(filename).suffix
            filename = f"us{user.user_id}{extension}"
            base_path = Path(__file__).resolve().parents[2]
            file_path = base_path / "images" / "profile" / filename
            
            try:
                with open(file_path, "wb") as f:
                    f.write(profile_image)
                user.photo_url = f"http://127.0.0.1:8000/images/profile/{filename}"
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Error al guardar la imagen: {str(e)}")

        user.first_name = first_name
        user.last_name = last_name
        user.phone = phone

        UserCRUD.update_data_user(db, user)
    
    @staticmethod
    def get_actions(
        user: dict,
        db: Session
    ):
        profile = UserCRUD.get_user_by_email(db, user.get("email"))
        role = user.get("role")
        user_profile = {
            "photo": profile.photo_url,
            "name": profile.first_name + " " + profile.last_name,
            "role": role
        }

        if role == "Administrador":
            return {
                "profile": user_profile,
                "actions": [
                    { "href": "events", "label": "Eventos", "icon": "AddUsersIcon" },
                    { "href": "users", "label": "Administrar usuarios", "icon": "ManageUsersIcon" },
                    { "href": "add/users", "label": "Conceder accesos", "icon": "AddUsersIcon" },
                    { "href": "enrollments/students", "label": "Gestionar inscripciones", "icon": "ManageEnrollmentsIcon" },
                    { "href": "institucions", "label": "Instituciones Educativas", "icon": "AddUsersIcon" },
                    { "href": "venues", "label": "Escenarios Deportivos", "icon": "AddUsersIcon" }
                ]
            }
        
        if role == "Institución educativa":
            return {
                "profile": user_profile,
                "actions": [
                    { "href": "add/students", "label": "Inscribir estudiantes", "icon": "AddUsersIcon" }
                ]
            }
        
        if role == "Juez":
            return {
                "profile": user_profile,
                "actions": [
                    { "href": "/", "label": "Home", "icon": "" }
                ]
            }
        
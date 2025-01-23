from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from src.api.deps import get_db
from src.services.auth_service import AuthService
from src.services.institution_services import InstitutionService
from src.utils.responses import standard_response
from src.utils.decorators import requires_role

router = APIRouter()

@router.get('/get')
@requires_role("Administrador")
def get_institutions(
        db: Session = Depends(get_db),
        user_credentials: dict = Depends(AuthService.decode_token)
    ):

    institutions = InstitutionService.get_institutions(db)

    response = JSONResponse(
        content=standard_response(
            success=True,
            message="",
            data=institutions
        )
    )

    return response

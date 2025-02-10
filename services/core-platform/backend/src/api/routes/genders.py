from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from src.api.deps import get_db
from src.services.gender_services import GenderService
from src.utils.responses import standard_response

router = APIRouter()

@router.get('/get')
def get_genders(
        db: Session = Depends(get_db),
    ):

    genders = GenderService.get_genders(db)

    response = JSONResponse(
        content=standard_response(
            success=True,
            message="",
            data=genders
        )
    )

    return response

from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from src.api.deps import get_db 
from src.schemas.representatives import Representative as RepresentativeSchema
from src.models import Representative as RepresentativeModel
from src.crud.representatives import get_representatives

router = APIRouter(
    prefix="/representatives",
)

@router.get("/", response_model=List[RepresentativeSchema])
def read_representatives(
    db: Session = Depends(get_db),
    institution_id: Optional[int] = Query(None, description="ID de la institución educativa para filtrar")
):
    representatives = get_representatives(db, institution_id=institution_id)
    return representatives
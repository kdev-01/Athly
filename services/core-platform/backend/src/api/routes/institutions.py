from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.api.deps import get_db
from src.crud.institutions import (
    get_all_institutions,
    get_institution_by_id,
    create_institution,
    update_institution,
    delete_institution
)
from src.schemas.institutions import Institution, InstitutionCreate, InstitutionUpdate

router = APIRouter()

@router.get("/", response_model=list[Institution])
def read_all_institutions(db: Session = Depends(get_db)):
    return get_all_institutions(db)

@router.get("/{institution_id}", response_model=Institution)
def read_institution(institution_id: int, db: Session = Depends(get_db)):
    institution = get_institution_by_id(db, institution_id)
    if not institution:
        raise HTTPException(status_code=404, detail="Institution not found")
    return institution

@router.post("/", response_model=Institution)
def create_new_institution(institution: InstitutionCreate, db: Session = Depends(get_db)):
    return create_institution(db, institution)

@router.put("/{institution_id}", response_model=Institution)
def update_institution_details(institution_id: int, institution: InstitutionUpdate, db: Session = Depends(get_db)):
    updated_institution = update_institution(db, institution_id, institution)
    if not updated_institution:
        raise HTTPException(status_code=404, detail="Institution not found")
    return updated_institution

@router.delete("/{institution_id}", response_model=Institution)
def delete_institution_record(institution_id: int, db: Session = Depends(get_db)):
    deleted_institution = delete_institution(db, institution_id)
    if not deleted_institution:
        raise HTTPException(status_code=404, detail="Institution not found")
    return deleted_institution

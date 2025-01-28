from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.api.deps import get_db
from src.schemas.workshop import WorkshopCreate, WorkshopOut, WorkshopUpdate
from src.crud.workshop import create_workshop, get_workshops, get_workshop_by_id, delete_workshop, update_workshop

router = APIRouter()

@router.post("/", response_model=WorkshopOut, status_code=201)
def create_new_workshop(workshop: WorkshopCreate, db: Session = Depends(get_db)):
    return create_workshop(db, workshop)

@router.get("/", response_model=list[WorkshopOut])
def read_workshops(db: Session = Depends(get_db)):
    return get_workshops(db)

# Actualizar un workshop
@router.put("/{workshop_id}/", response_model=WorkshopOut)
def update_workshop_route(workshop_id: int, workshop: WorkshopUpdate, db: Session = Depends(get_db)):
    existing_workshop = get_workshop_by_id(db, workshop_id)
    if not existing_workshop:
        raise HTTPException(status_code=404, detail="Workshop no encontrado")
    return update_workshop(db, workshop_id, workshop)

# Eliminar un workshop
@router.delete("/{workshop_id}/")
def delete_workshop_route(workshop_id: int, db: Session = Depends(get_db)):
    existing_workshop = get_workshop_by_id(db, workshop_id)
    if not existing_workshop:
        raise HTTPException(status_code=404, detail="Workshop no encontrado")
    delete_workshop(db, workshop_id)
    return {"message": "Workshop eliminado correctamente"}

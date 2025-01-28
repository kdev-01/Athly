from sqlalchemy.orm import Session
from src.models.workshop import Workshop
from src.schemas.workshop import WorkshopCreate, WorkshopUpdate

def create_workshop(db: Session, workshop: WorkshopCreate):
    new_workshop = Workshop(
        name=workshop.name,
        location=workshop.location,
        date_time=workshop.date_time,
        description=workshop.description,
        event_id=workshop.event_id,
    )
    db.add(new_workshop)
    db.commit()
    db.refresh(new_workshop)
    return new_workshop

def get_workshops(db: Session):
    return db.query(Workshop).all()

# Obtener un workshop por ID
def get_workshop_by_id(db: Session, workshop_id: int) -> Workshop:
    return db.query(Workshop).filter(Workshop.workshop_id == workshop_id).first()

# Actualizar un workshop
def update_workshop(db: Session, workshop_id: int, workshop: WorkshopUpdate) -> Workshop:
    db_workshop = db.query(Workshop).filter(Workshop.workshop_id == workshop_id).first()
    for key, value in workshop.dict(exclude_unset=True).items():
        setattr(db_workshop, key, value)
    db.commit()
    db.refresh(db_workshop)
    return db_workshop

# Eliminar un workshop
def delete_workshop(db: Session, workshop_id: int):
    db_workshop = db.query(Workshop).filter(Workshop.workshop_id == workshop_id).first()
    db.delete(db_workshop)
    db.commit()

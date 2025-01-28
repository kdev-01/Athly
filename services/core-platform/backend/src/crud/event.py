from sqlalchemy.orm import Session, joinedload
from src.models.event import Event
from src.schemas.event import EventCreate
from src.schemas.event import EventUpdate

def create_event(db: Session, event: EventCreate):
    
    new_event = Event(
        name=event.name,
        start_date=event.start_date,
        end_date=event.end_date,
        registration_start_date=event.registration_start_date,
        registration_end_date=event.registration_end_date,
        sport_id=event.sport_id,
        category_id=event.category_id,
    )
    db.add(new_event)
    db.commit()
    db.refresh(new_event)
    return new_event


# Obtener todos los eventos
def get_events(db: Session):
    events = db.query(Event).options(
        joinedload(Event.sport),    # Cargar la relación con deporte
        joinedload(Event.category) # Cargar la relación con categoría
    ).all()

    # Transformar relaciones a dict para Pydantic
    result = []
    for event in events:
        result.append({
            "event_id": event.event_id,
            "name": event.name,
            "start_date": event.start_date,
            "end_date": event.end_date,
            "registration_start_date": event.registration_start_date,
            "registration_end_date": event.registration_end_date,
            "sport": {"id": event.sport.sport_id, "name": event.sport.name} if event.sport else None,
            "category": {"id": event.category.category_id, "name": event.category.name} if event.category else None,
        })

    return result


def get_event_by_id(db: Session, event_id: int):
    return db.query(Event).filter(Event.event_id == event_id).first()


# Eliminar eventos
def delete_event(db: Session, event_id: int):
    event = db.query(Event).filter(Event.event_id == event_id).first()
    if not event:
        return None
    db.delete(event)
    db.commit()
    return event

# Actualizar eventos
def update_event(db: Session, event_id: int, event_data: EventUpdate):
    event = db.query(Event).filter(Event.event_id == event_id).first()
    if not event:
        return None
    for key, value in event_data.dict(exclude_unset=True).items():
        setattr(event, key, value)
    db.commit()
    db.refresh(event)
    return event

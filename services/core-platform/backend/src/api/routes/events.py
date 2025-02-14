from typing import List
from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from src.schemas.event import EventCreate, EventOut, EventUpdate
from src.crud.event import get_events, create_event, update_event, delete_event
from src.api.deps import get_db
from src.utils.decorators import requires_role
from src.services.event_service import EventServices
from src.services.auth_service import AuthService
from src.utils.responses import standard_response

router = APIRouter()

@router.get("/", response_model=List[EventOut])
def read_events(db: Session = Depends(get_db)):
    return get_events(db)

@router.post("/", response_model=EventOut)
def add_event(event: EventCreate, db: Session = Depends(get_db)):
    try:
        new_event = create_event(db, event)
        return new_event
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.put("/{event_id}", response_model=EventOut)
def edit_event(event_id: int, event_data: EventUpdate, db: Session = Depends(get_db)):
    updated_event = update_event(db, event_id, event_data)
    if not updated_event:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
    return updated_event

@router.delete("/{event_id}", response_model=EventOut)
def remove_event(event_id: int, db: Session = Depends(get_db)):
    deleted_event = delete_event(db, event_id)
    if not deleted_event:
        raise HTTPException(status_code=404, detail="Evento no encontrado")
    return deleted_event

@router.get('/available')
@requires_role("Institución educativa")
def get_available_events(
        db: Session = Depends(get_db),
        user_credentials: dict = Depends(AuthService.decode_token)
    ):

    events = EventServices.get_events(user_credentials, db)
    response = JSONResponse(
        content=standard_response(
            success=True,
            message="",
            data=events
        )
    )

    return response

@router.get('/upcoming')
@requires_role("Administrador")
def get_upcoming_events(
        db: Session = Depends(get_db),
        user_credentials: dict = Depends(AuthService.decode_token)
    ):

    events = EventServices.get_future_events(db)
    response = JSONResponse(
        content=standard_response(
            success=True,
            message="",
            data=events
        )
    )

    return response

@router.get('/students')
@requires_role("Institución educativa")
def get_upcoming_events(
        db: Session = Depends(get_db),
        user_credentials: dict = Depends(AuthService.decode_token)
    ):
    events_students = EventServices.get_students(user_credentials, db)
    response = JSONResponse(
        content=standard_response(
            success=True,
            message="",
            data=events_students
        )
    )

    return response

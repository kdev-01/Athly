from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.api.deps import get_db
from src.crud.event_participants import (
    get_all_event_participants,
    get_event_participant_by_ids,
    create_event_participant,
    update_event_participant,
    delete_event_participant,
    get_event_participants_by_event
)
from src.schemas.event_participants import EventParticipant, EventParticipantCreate, EventParticipantUpdate

router = APIRouter()

@router.get("/", response_model=list[EventParticipant])
def read_all_event_participants(db: Session = Depends(get_db)):
    return get_all_event_participants(db)

@router.get("/{id_event}/{id_educational_institution}", response_model=EventParticipant)
def read_event_participant(
    id_event: int, 
    id_educational_institution: int, 
    db: Session = Depends(get_db)
):
    participant = get_event_participant_by_ids(db, id_event, id_educational_institution)
    if not participant:
        raise HTTPException(status_code=404, detail="Event participant not found")
    return participant

@router.get("/{id_event}", response_model=list[EventParticipant])
def read_event_participants(
    id_event: int,
    db: Session = Depends(get_db)
):
    participants = get_event_participants_by_event(db, id_event)
    if not participants:
        raise HTTPException(status_code=404, detail="No participants found for this event")
    return participants

@router.post("/", response_model=EventParticipant)
def create_event_participant_record(
    participant: EventParticipantCreate,
    db: Session = Depends(get_db)
):
    # Verificar si ya existe el participante en el evento
    existing_participant = get_event_participant_by_ids(
        db, participant.id_event, participant.id_educational_institution
    )
    
    if existing_participant:
        raise HTTPException(status_code=400, detail="Participant already exists in the event")

    created_participant = create_event_participant(db, participant)
    return created_participant

@router.put("/{id_event}/{id_educational_institution}", response_model=EventParticipant)
def update_event_participant_details(
    id_event: int, 
    id_educational_institution: int, 
    participant: EventParticipantUpdate, 
    db: Session = Depends(get_db)
):
    updated_participant = update_event_participant(db, id_event, id_educational_institution, participant)
    if not updated_participant:
        raise HTTPException(status_code=404, detail="Event participant not found")
    return updated_participant

@router.delete("/{id_event}/{id_educational_institution}", response_model=EventParticipant)
def delete_event_participant_record(
    id_event: int, 
    id_educational_institution: int, 
    db: Session = Depends(get_db)
):
    deleted_participant = delete_event_participant(db, id_event, id_educational_institution)
    if not deleted_participant:
        raise HTTPException(status_code=404, detail="Event participant not found")
    return deleted_participant

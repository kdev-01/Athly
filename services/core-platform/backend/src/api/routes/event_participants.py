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


@router.post("/add-multiple", response_model=list[EventParticipantCreate])
def create_multiple_event_participants(
    data: dict,
    db: Session = Depends(get_db)
):
    id_event = data.get("id_event")
    institutions = data.get("institutions")

    if not id_event or not institutions:
        raise HTTPException(status_code=400, detail="id_event or institutions missing")

    created_participants = []
    for institution_id in institutions:
        participant = EventParticipantCreate(
            id_event=id_event,
            id_educational_institution=institution_id
        )
        created_participant = create_event_participant(db, participant)
        created_participants.append(created_participant)

    return created_participants

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

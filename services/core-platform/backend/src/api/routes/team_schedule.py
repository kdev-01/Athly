from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from src.api.deps import get_db
from src.schemas.team_schedule import TeamScheduleCreate, TeamScheduleUpdate, TeamScheduleResponse
from src.crud.team_schedule import get_team_schedules, get_team_schedule_by_id, create_team_schedule, update_team_schedule, delete_team_schedule

router = APIRouter(prefix="/team_schedules", tags=["Team Schedules"])

@router.get("/", response_model=list[TeamScheduleResponse])
def read_team_schedules(db: Session = Depends(get_db)):
    return get_team_schedules(db)

@router.get("/{schedule_id}", response_model=TeamScheduleResponse)
def read_team_schedule(schedule_id: int, db: Session = Depends(get_db)):
    db_schedule = get_team_schedule_by_id(db, schedule_id)
    if not db_schedule:
        raise HTTPException(status_code=404, detail="Team Schedule not found")
    return db_schedule

@router.post("/", response_model=TeamScheduleResponse)
def create_team_schedule_endpoint(schedule: TeamScheduleCreate, db: Session = Depends(get_db)):
    return create_team_schedule(db, schedule)

@router.put("/{schedule_id}", response_model=TeamScheduleResponse)
def update_team_schedule_endpoint(schedule_id: int, schedule: TeamScheduleUpdate, db: Session = Depends(get_db)):
    updated_schedule = update_team_schedule(db, schedule_id, schedule)
    if not updated_schedule:
        raise HTTPException(status_code=404, detail="Team Schedule not found")
    return updated_schedule

@router.delete("/{schedule_id}", response_model=TeamScheduleResponse)
def delete_team_schedule_endpoint(schedule_id: int, db: Session = Depends(get_db)):
    deleted_schedule = delete_team_schedule(db, schedule_id)
    if not deleted_schedule:
        raise HTTPException(status_code=404, detail="Team Schedule not found")
    return deleted_schedule

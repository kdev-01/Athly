from sqlalchemy.orm import Session
from src.models.team_schedule import TeamSchedule
from src.schemas.team_schedule import TeamScheduleCreate, TeamScheduleUpdate

def get_team_schedules(db: Session):
    return db.query(TeamSchedule).all()

def get_team_schedule_by_id(db: Session, schedule_id: int):
    return db.query(TeamSchedule).filter(TeamSchedule.team_schedule_id == schedule_id).first()

def create_team_schedule(db: Session, schedule: TeamScheduleCreate):
    db_schedule = TeamSchedule(**schedule.model_dump())
    db.add(db_schedule)
    db.commit()
    db.refresh(db_schedule)
    return db_schedule

def update_team_schedule(db: Session, schedule_id: int, schedule_data: TeamScheduleUpdate):
    db_schedule = db.query(TeamSchedule).filter(TeamSchedule.team_schedule_id == schedule_id).first()
    if not db_schedule:
        return None
    for key, value in schedule_data.model_dump(exclude_unset=True).items():
        setattr(db_schedule, key, value)
    db.commit()
    db.refresh(db_schedule)
    return db_schedule

def delete_team_schedule(db: Session, schedule_id: int):
    db_schedule = db.query(TeamSchedule).filter(TeamSchedule.team_schedule_id == schedule_id).first()
    if db_schedule:
        db.delete(db_schedule)
        db.commit()
    return db_schedule

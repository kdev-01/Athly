from sqlalchemy.orm import Session
from typing import Dict
from src.models.judge import Judge
from src.models.individual_schedule import IndividualSchedule
from src.models.team_schedule import TeamSchedule
from src.models.judge import Judge
from src.schemas.judge import JudgeCreate, JudgeUpdate

class JudgeCrud:
    @staticmethod
    def get_judge_by_id(db: Session, user_id: int):
        return db.query(Judge).filter(Judge.user_id == user_id).first()

    @staticmethod
    def insert_judge(db: Session, judge: Dict):
        new_judge = Judge(**judge)
        db.add(new_judge)
        db.commit()
        db.refresh(new_judge)

    @staticmethod
    def verify_has_individual_events(db: Session, judge_id: int):
        return db.query(IndividualSchedule).filter(IndividualSchedule.judge_id == judge_id).first()
    
    @staticmethod
    def verify_has_team_events(db: Session, judge_id: int):
        return db.query(TeamSchedule).filter(TeamSchedule.judge_id == judge_id).first()
    
    @staticmethod
    def update_data_judge(db: Session, judge: Judge):
        db.add(judge)
        db.commit()
        db.refresh(judge)
    

def get_judge(db: Session, judge_id: int):
    return db.query(Judge).filter(Judge.judge_id == judge_id).first()

def get_all_judges(db: Session):
    query = db.query(Judge)  # Sin filtros, devuelve todo
    result = query.all()
    return result



def create_judge(db: Session, judge_data: JudgeCreate):
    new_judge = Judge(**judge_data.dict())
    db.add(new_judge)
    db.commit()
    db.refresh(new_judge)
    return new_judge

def update_judge(db: Session, judge_id: int, judge_data: JudgeUpdate):
    judge = db.query(Judge).filter(Judge.judge_id == judge_id).first()
    if not judge:
        return None
    for key, value in judge_data.dict(exclude_unset=True).items():
        setattr(judge, key, value)
    db.commit()
    db.refresh(judge)
    return judge

def delete_judge(db: Session, judge_id: int):
    judge = db.query(Judge).filter(Judge.judge_id == judge_id).first()
    if not judge:
        return None
    judge.is_deleted = True  # Eliminación lógica
    db.commit()
    return judge

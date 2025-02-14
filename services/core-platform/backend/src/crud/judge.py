from sqlalchemy.orm import Session
from typing import Dict
from src.models.judge import Judge
from src.models.individual_schedule import IndividualSchedule
from src.models.team_schedule import TeamSchedule

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
    
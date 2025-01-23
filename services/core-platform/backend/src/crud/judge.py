from sqlalchemy.orm import Session
from typing import Dict
from src.models.judge import Judge

class JudgeCrud:
    @staticmethod
    def insert_judge(db: Session, judge: Dict):
        new_judge = Judge(**judge)
        db.add(new_judge)
        db.commit()
        db.refresh(new_judge)

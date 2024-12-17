from typing import Generator
from src.database.session import SessionLocal

def get_db() -> Generator:
    db = SessionLocal()
    
    try:
        yield db
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

from fastapi import FastAPI
from src.core.config import settings
from src.database import base

app = FastAPI(title=settings.PROJECT_NAME, version=settings.PROJECT_VERSION)

@app.get('/')
def home_page():
    return {'message': 'Pagina principal'}

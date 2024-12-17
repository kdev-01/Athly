from fastapi import FastAPI
from src.core.config import settings
from src.api.routes import users

app = FastAPI(title=settings.PROJECT_NAME, version=settings.PROJECT_VERSION)

"""@app.get('/')
def home_page():
    return {'message': 'Pagina principal'}"""

app.include_router(users.router, prefix='/users', tags=['Users'])

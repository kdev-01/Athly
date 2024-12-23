from fastapi import FastAPI
# from fastapi.security import OAuth2PasswordBearer
# from fastapi.middleware.cors import CORSMiddleware
from src.core.config import settings
from src.api.routes import users

app = FastAPI(
    title = settings.PROJECT_NAME,
    version = settings.PROJECT_VERSION
)

# oauth2_schema =  OAuth2PasswordBearer(tokenUrl="token")

"""app.add_middleware (
    CORSMiddleware,
    allow_origins = ['http://localhost:5173/'],
    allow_credentials = True,
    allow_methods = ['*'],
    allow_headers = ['*']
)"""

@app.get('/', tags=['Home'])
def home():
    return {"Hello": "World :)"}

app.include_router(users.router, prefix='/users', tags=['Users'])

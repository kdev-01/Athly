from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from src.core.config import settings
from src.utils.responses import standard_response
from src.api.routes import users
from src.api.routes import roles
from src.api.routes import educational_institutions
from src.api.routes.events import router as events_router
from src.api.routes.sports import router as sports_router
from src.api.routes.categories import router as categories_router
from src.api.routes.sports_venues import router as sports_venues

app = FastAPI(
    title = settings.PROJECT_NAME,
    version = settings.PROJECT_VERSION
)

app.mount("/images", StaticFiles(directory="images"), name="images")

@app.exception_handler(HTTPException)
async def custom_http_exception_handler(request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content=standard_response(success=False, message=exc.detail)
    )

app.add_middleware (
    CORSMiddleware,
    allow_origins = ['http://localhost:5173'],
    allow_credentials = True,
    allow_methods = ['*'],
    allow_headers = ['*']
)

@app.get('/', tags=['Home'])
def home():
    return {"Hello": "World :)"}

app.include_router(users.router, prefix='/user', tags=['Users'])
app.include_router(roles.router, prefix='/rol', tags=['Roles'])
app.include_router(educational_institutions.router, prefix='/edu', tags=['Institutions'])
app.include_router(events_router, prefix="/api/events", tags=["events"])
app.include_router(sports_router, prefix="/api/sports", tags=["sports"])
app.include_router(categories_router, prefix="/api/categories", tags=["categories"])
app.include_router(sports_venues, prefix="/api/sports_venues", tags=["Sports Venues"])

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from src.core.config import settings
from src.utils.responses import standard_response
from src.api.routes import users
from src.api.routes import roles
from src.api.routes import educational_institutions
from src.api.routes import students
from src.api.routes.events import router as events_router
from src.api.routes.sports import router as sports_router
from src.api.routes.categories import router as categories_router
from src.api.routes.sports_venues import router as sports_venues
from src.api.routes.workshops import router as workshops_router
from src.api.routes.event_participants import router as event_participants_router
from src.api.routes.institutions import router as institutions_router
from src.api.routes.venue_event import router as venue_event_router
from src.api.routes.judge import router as judge_router
from src.api.routes.team_schedule import router as team_schedule_router
from src.api.routes import genders
from src.api.routes.student import router as students_router
from src.api.routes.representatives import router as representatives_router

app = FastAPI(
    title = settings.PROJECT_NAME,
    version = settings.PROJECT_VERSION
)

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

app.mount("/images", StaticFiles(directory="images"), name="images")

@app.get('/', tags=['Home'])
def home():
    return {"Hello": "World :)"}

app.include_router(users.router, prefix='/user', tags=['Users'])
app.include_router(roles.router, prefix='/rol', tags=['Roles'])
app.include_router(educational_institutions.router, prefix='/edu', tags=['Institutions'])
app.include_router(students.router, prefix='/student', tags=['Students'])
app.include_router(events_router, prefix="/api/events", tags=["events"])
app.include_router(sports_router, prefix="/api/sports", tags=["sports"])
app.include_router(categories_router, prefix="/api/categories", tags=["categories"])
app.include_router(sports_venues, prefix="/api/sports_venues", tags=["Sports Venues"])
app.include_router(workshops_router, prefix="/api/workshops", tags=["Workshops"])
app.include_router(event_participants_router, prefix="/api/event_participants", tags=["Event Participants"])
app.include_router(institutions_router, prefix="/api/institutions", tags=["Institutions"])
app.include_router(venue_event_router, prefix="/api/venue_event", tags=["Venues Event"])
app.include_router(judge_router, prefix="/api/judges", tags=["Jugde"])
app.include_router(team_schedule_router, prefix="/api/team_schedule", tags=["Team schedule"])
app.include_router(genders.router, prefix='/gender', tags=['Genders'])
app.include_router(students_router, prefix="/api/students", tags=["Students"])
app.include_router(representatives_router, prefix="/api/students", tags=["Students"])
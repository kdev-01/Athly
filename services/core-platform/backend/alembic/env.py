from logging.config import fileConfig
from sqlalchemy import engine_from_config
from sqlalchemy import pool
from alembic import context
from dotenv import load_dotenv
import os
from src.database.base_class import Base
from src.models.role import Role
from src.models.user import User
from src.models.security_code import SecurityCode
from src.models.workshop import Workshop
from src.models.workshop_attendance import WorkshopAttendance
from src.models.educational_institution import EducationalInstitution
from src.models.representative import Representative
from src.models.sport import Sport
from src.models.sports_venue import SportsVenue
from src.models.category import Category
from src.models.discipline import Discipline
from src.models.event import Event
from src.models.gender import Gender
from src.models.academic_year import AcademicYear
from src.models.student import Student
from src.models.judge import Judge
from src.models.team_schedule import TeamSchedule
from src.models.individual_schedule import IndividualSchedule
from src.models.basketball_result import BasketballResult
from src.models.football_result import FootballResult
from src.models.chess_result import ChessResult
from src.models.athletics_result import AthleticsResult

load_dotenv()
config = context.config
config.set_main_option(
    'sqlalchemy.url',
    f"postgresql://{os.getenv('POSTGRES_USER')}:{os.getenv('POSTGRES_PASSWORD')}@localhost:{os.getenv('DATABASE_PORT')}/{os.getenv('POSTGRES_DB')}"
)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata

def run_migrations_offline() -> None:
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()

def run_migrations_online() -> None:
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()

if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()

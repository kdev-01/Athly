from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = 'Athly'
    PROJECT_VERSION: str = '1.0.0'
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str
    POSTGRES_DB: str
    DATABASE_PORT: int

    def DATABASE_URL(self):
        return f"postgresql://{self.POSTGRES_USER}:{self.POSTGRES_PASSWORD}@localhost:{self.DATABASE_PORT}/{self.POSTGRES_DB}"
    class Config:
        env_file = '.env'
    
settings = Settings()

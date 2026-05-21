from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql+psycopg2://postgres:postgres@db:5432/mirecorrido"

    class Config:
        env_file = ".env"
        extra = "ignore"


settings = Settings()

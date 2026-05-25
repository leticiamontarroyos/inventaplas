from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres@127.0.0.1:5432/inventaplas"
    SECRET_KEY: str = "chave-secreta-mude-em-producao-2024"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 480

settings = Settings()
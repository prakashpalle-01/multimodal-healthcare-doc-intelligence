from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "multimodal-healthcare-doc-intelligence"
    environment: str = "local"
    log_level: str = "INFO"

    database_url: str = "postgresql+psycopg://healthcare:healthcare@localhost:5432/healthcare_docs"
    redis_url: str = "redis://localhost:6379/0"
    qdrant_url: str = "http://localhost:6333"
    kafka_bootstrap_servers: str = "localhost:29092"

    ocr_engine: str = "paddleocr"
    rag_framework: str = "langchain"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")


@lru_cache
def get_settings() -> Settings:
    return Settings()

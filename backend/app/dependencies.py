from collections.abc import Generator

from backend.app.config import Settings, get_settings


def settings() -> Settings:
    return get_settings()


def get_request_id() -> Generator[str, None, None]:
    yield "local-request"

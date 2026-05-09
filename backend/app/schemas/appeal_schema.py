from uuid import UUID

from pydantic import BaseModel


class AppealDraftRequest(BaseModel):
    denial_id: UUID
    claim_id: UUID


class AppealDraftResponse(BaseModel):
    appeal_id: UUID
    draft_text: str
    citations: list[str] = []

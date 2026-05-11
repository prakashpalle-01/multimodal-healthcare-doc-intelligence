from uuid import UUID

from pydantic import BaseModel


class AppealDraftRequest(BaseModel):
    denial_id: UUID
    claim_id: UUID


class AppealDraftResponse(BaseModel):
    appeal_id: UUID
    denial_id: UUID | None = None
    claim_id: UUID | None = None
    draft_text: str
    citations: list[str] = []


class DenialExplanationResponse(BaseModel):
    document_id: UUID
    reason_code: str
    summary: str
    evidence: list[str]
    next_action: str

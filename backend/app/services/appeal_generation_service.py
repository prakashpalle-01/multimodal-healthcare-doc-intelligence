from uuid import UUID, uuid4

from backend.app.schemas.appeal_schema import AppealDraftResponse
from backend.app.services.denial_reason_service import DenialReasonService


class AppealGenerationService:
    def generate_for_document(self, document_id: UUID) -> AppealDraftResponse:
        explanation = DenialReasonService().explain(document_id)
        evidence = "\n".join(f"- {item}" for item in explanation.evidence)
        draft = f"""To the Medical Review Department,

We request reconsideration of the denied healthcare document associated with ID {document_id}.

Denial rationale identified by review:
{explanation.summary}

Supporting evidence and remediation items:
{evidence}

Requested action:
Please reprocess the claim after reviewing the attached clinical and administrative documentation.

Sincerely,
Revenue Cycle Review Team"""

        return AppealDraftResponse(
            appeal_id=uuid4(),
            denial_id=document_id,
            claim_id=document_id,
            draft_text=draft,
            citations=["Rule-based validation summary", "Extracted document fields"],
        )

from uuid import UUID

from backend.app.schemas.appeal_schema import DenialExplanationResponse
from backend.app.services.validation_service import ValidationService


class DenialReasonService:
    def explain(self, document_id: UUID) -> DenialExplanationResponse:
        validation = ValidationService().validate_document(document_id)
        high_priority_issues = [
            issue for issue in validation.issues if issue.severity in {"error", "warning"}
        ]
        evidence = [
            issue.message for issue in high_priority_issues
        ] or ["No blocking payer-rule issues were found in the extracted fields."]

        reason_code = "PA-REVIEW" if high_priority_issues else "CLEAR"
        summary = (
            "The document needs review because required data or payer-rule evidence is missing."
            if high_priority_issues
            else "The document passed the current rule-based denial screening."
        )
        next_action = (
            "Resolve validation issues, attach supporting documentation, and generate an appeal draft."
            if high_priority_issues
            else "Proceed with claim submission or archive the review outcome."
        )

        return DenialExplanationResponse(
            document_id=document_id,
            reason_code=reason_code,
            summary=summary,
            evidence=evidence,
            next_action=next_action,
        )

import re
from uuid import UUID

from backend.app.config import get_settings
from backend.app.db.repositories.audit_repository import ExtractionResultRepository
from backend.app.db.session import session_scope
from backend.app.schemas.extraction_schema import ExtractedField, ExtractionRequest, ExtractionResponse, OCRResponse
from backend.app.services.document_service import DocumentService
from backend.app.services.ocr_service import OCRService

FIELD_PATTERNS = {
    "patient_name": r"(?:patient|member)\s*[:#-]\s*(?P<value>[A-Za-z ,.'-]+)",
    "medication": r"(?:medication|drug|rx)\s*[:#-]\s*(?P<value>[A-Za-z0-9 .,'/-]+)",
    "payer": r"(?:payer|insurance)\s*[:#-]\s*(?P<value>[A-Za-z0-9 .,'&-]+)",
    "claim_id": r"(?:claim)\s*(?:id|#)?\s*[:#-]\s*(?P<value>[A-Za-z0-9-]+)",
    "denial_reason": r"(?:denial reason|reason)\s*[:#-]\s*(?P<value>[^\n]+)",
}


class ExtractionService:
    def run_ocr(self, document_id: UUID) -> OCRResponse:
        document_service = DocumentService()
        document = document_service.get_document(document_id)
        text = OCRService(engine=get_settings().ocr_engine).extract_text(document.storage_path)
        document_service.update_ocr_text(document_id, text)
        return OCRResponse(document_id=document_id, text=text, engine=get_settings().ocr_engine)

    def extract_from_document(self, document_id: UUID) -> ExtractionResponse:
        document = DocumentService().get_document(document_id)
        text = document.ocr_text
        if text is None:
            text = self.run_ocr(document_id).text
        response = self.extract(
            ExtractionRequest(
                document_id=document_id,
                document_type=document.document_type,
                text=text,
            )
        )
        with session_scope() as db:
            ExtractionResultRepository(db).replace_for_document(document_id, response.fields)
        return response

    def extract(self, request: ExtractionRequest) -> ExtractionResponse:
        text = request.text or ""
        fields = self._extract_fields(text)

        if text and not fields:
            fields.append(
                ExtractedField(
                    name="raw_text_preview",
                    value=text[:250],
                    confidence=0.5,
                    source="text_input",
                )
            )

        return ExtractionResponse(
            document_id=request.document_id,
            document_type=request.document_type,
            fields=fields,
            text=text,
        )

    def _extract_fields(self, text: str) -> list[ExtractedField]:
        fields: list[ExtractedField] = []
        for name, pattern in FIELD_PATTERNS.items():
            match = re.search(pattern, text, re.IGNORECASE)
            if match:
                fields.append(
                    ExtractedField(
                        name=name,
                        value=match.group("value").strip(),
                        confidence=0.82,
                        source="regex_extractor",
                    )
                )
        return fields

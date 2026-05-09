from backend.app.schemas.extraction_schema import ExtractedField, ExtractionRequest, ExtractionResponse


class ExtractionService:
    def extract(self, request: ExtractionRequest) -> ExtractionResponse:
        text = request.text or ""
        fields: list[ExtractedField] = []

        if text:
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
        )

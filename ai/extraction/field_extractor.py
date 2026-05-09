class FieldExtractor:
    def extract(self, text: str) -> dict[str, str]:
        return {"raw_text_preview": text[:250]} if text else {}

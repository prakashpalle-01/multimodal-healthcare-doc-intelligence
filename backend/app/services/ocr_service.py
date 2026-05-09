class OCRService:
    def extract_text(self, file_path: str) -> str:
        raise NotImplementedError("OCR engine adapters are implemented under ai/ocr.")

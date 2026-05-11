from pathlib import Path


class OCRService:
    def __init__(self, engine: str = "tesseract") -> None:
        self.engine = engine

    def extract_text(self, file_path: str) -> str:
        path = Path(file_path)
        if path.suffix.lower() in {".txt", ".csv", ".json", ".md"}:
            return path.read_text(encoding="utf-8", errors="ignore")
        if path.suffix.lower() in {".png", ".jpg", ".jpeg", ".tiff", ".bmp"}:
            from ai.ocr.ocr_pipeline import OCRPipeline

            return OCRPipeline(engine=self.engine).extract_text(str(path))
        return ""

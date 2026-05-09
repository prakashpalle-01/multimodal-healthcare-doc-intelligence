from ai.ocr.tesseract_ocr import TesseractOCR


class OCRPipeline:
    def __init__(self, engine: str = "tesseract") -> None:
        self.engine = engine
        self._adapter = TesseractOCR()

    def extract_text(self, image_path: str) -> str:
        return self._adapter.extract_text(image_path)

import pytesseract
from PIL import Image


class TesseractOCR:
    def extract_text(self, image_path: str) -> str:
        with Image.open(image_path) as image:
            return pytesseract.image_to_string(image)

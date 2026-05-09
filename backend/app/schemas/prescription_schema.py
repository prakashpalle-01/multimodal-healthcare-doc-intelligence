from pydantic import BaseModel


class Prescription(BaseModel):
    patient_name: str | None = None
    medication_name: str | None = None
    dosage: str | None = None
    prescriber: str | None = None
    pharmacy: str | None = None

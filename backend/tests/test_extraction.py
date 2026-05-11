from fastapi.testclient import TestClient

from backend.app.main import app


client = TestClient(app)


def test_text_extraction_request() -> None:
    response = client.post(
        "/api/v1/extraction",
        json={
            "document_id": "00000000-0000-0000-0000-000000000001",
            "document_type": "claim",
            "text": "Patient: Jane Smith\nPayer: Aetna\nClaim ID: CLM-1001",
        },
    )

    assert response.status_code == 200
    payload = response.json()
    field_names = {field["name"] for field in payload["fields"]}
    assert {"patient_name", "payer", "claim_id"}.issubset(field_names)


def test_ocr_and_extract_from_uploaded_text_document() -> None:
    upload_response = client.post(
        "/api/v1/documents",
        files={
            "file": (
                "claim-1001.txt",
                b"Patient: Jane Smith\nPayer: Aetna\nClaim ID: CLM-1001\nDenial reason: Missing prior authorization",
                "text/plain",
            )
        },
    )
    document_id = upload_response.json()["document_id"]

    ocr_response = client.post(f"/api/v1/extraction/{document_id}/ocr")
    assert ocr_response.status_code == 200
    assert "Missing prior authorization" in ocr_response.json()["text"]

    extraction_response = client.post(f"/api/v1/extraction/{document_id}")
    assert extraction_response.status_code == 200
    fields = {field["name"]: field["value"] for field in extraction_response.json()["fields"]}
    assert fields["patient_name"] == "Jane Smith"
    assert fields["payer"] == "Aetna"
    assert fields["claim_id"] == "CLM-1001"

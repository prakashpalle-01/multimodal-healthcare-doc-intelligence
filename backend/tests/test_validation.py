from fastapi.testclient import TestClient

from backend.app.main import app


client = TestClient(app)


def test_validate_fields_flags_missing_payer() -> None:
    response = client.post(
        "/api/v1/validation",
        json={
            "document_id": "00000000-0000-0000-0000-000000000011",
            "fields": [
                {
                    "name": "patient_name",
                    "value": "Jane Smith",
                    "confidence": 0.95,
                    "source": "test",
                }
            ],
        },
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["valid"] is False
    assert payload["score"] < 100
    assert any(issue["field"] == "payer" for issue in payload["issues"])


def test_document_validation_denial_and_appeal_flow() -> None:
    upload_response = client.post(
        "/api/v1/documents",
        files={
            "file": (
                "claim-denial.txt",
                b"Patient: Jane Smith\nPayer: Aetna\nClaim ID: CLM-2002\nMedication: Semaglutide",
                "text/plain",
            )
        },
    )
    document_id = upload_response.json()["document_id"]

    validation_response = client.post(f"/api/v1/validation/{document_id}")
    assert validation_response.status_code == 200
    assert validation_response.json()["document_id"] == document_id

    denial_response = client.post(f"/api/v1/denials/{document_id}")
    assert denial_response.status_code == 200
    assert denial_response.json()["document_id"] == document_id
    assert denial_response.json()["reason_code"] in {"PA-REVIEW", "CLEAR"}

    appeal_response = client.post(f"/api/v1/appeals/{document_id}")
    assert appeal_response.status_code == 200
    assert document_id in appeal_response.json()["draft_text"]

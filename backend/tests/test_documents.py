from fastapi.testclient import TestClient

from backend.app.main import app


client = TestClient(app)


def test_upload_and_list_document() -> None:
    response = client.post(
        "/api/v1/documents",
        files={"file": ("rx-sample.txt", b"Patient: Jane Smith\nMedication: Metformin", "text/plain")},
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["filename"] == "rx-sample.txt"
    assert payload["document_type"] == "prescription"
    assert payload["status"] == "staged"

    list_response = client.get("/api/v1/documents")
    assert list_response.status_code == 200
    assert any(document["document_id"] == payload["document_id"] for document in list_response.json())


def test_missing_document_returns_404() -> None:
    response = client.get("/api/v1/documents/00000000-0000-0000-0000-000000000000")

    assert response.status_code == 404

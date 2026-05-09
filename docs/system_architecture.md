# System Architecture

## Components

- FastAPI backend exposes document upload, extraction, validation, denial analysis, and appeal endpoints.
- OCR and vision modules process raw files with PaddleOCR/Tesseract, OpenCV, LayoutLMv3, and Donut.
- PostgreSQL stores documents, claims, validation outcomes, payer metadata, and audit events.
- Redis stores transient job state and queue coordination metadata.
- Kafka carries document upload, OCR, extraction, validation, and appeal-generation events.
- Airflow orchestrates scheduled ingestion, backfills, model evaluation, and appeal batch workflows.
- Qdrant stores embeddings for payer rules, policies, denial letters, and appeal examples.
- React + TypeScript provides the operations dashboard for uploads, review, validation, denials, and appeals.
- Prometheus and Grafana provide API, pipeline, and model performance monitoring.

## Phase Map

1. Build FastAPI upload and extraction endpoints with OCR adapters.
2. Add claim validation, payer rules, PostgreSQL models, repositories, and migrations.
3. Add RAG retrieval, denial explanation, and appeal drafting services.
4. Build the frontend dashboard and review workflows.
5. Add Kafka/Airflow pipelines, monitoring dashboards, Docker hardening, and Kubernetes deployment.

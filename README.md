# Multimodal Healthcare Document Intelligence

AI platform for ingesting healthcare documents, running OCR and layout-aware extraction, validating claims against payer rules, explaining denials, and drafting appeal content with RAG.

## Delivery Roadmap

| Phase | Scope | Core stack |
| --- | --- | --- |
| 1 | Backend API, OCR, extraction pipeline | FastAPI, PaddleOCR/Tesseract, OpenCV |
| 2 | Validation, payer rules, persistence | PostgreSQL, SQLAlchemy, Redis |
| 3 | RAG, denial explanation, appeal generation | Qdrant, LangChain/LlamaIndex, LayoutLMv3/Donut |
| 4 | Frontend dashboard | React, TypeScript, Vite |
| 5 | Pipelines, monitoring, deployment | Kafka, Airflow, Prometheus, Grafana, Docker, Kubernetes |

## Architecture

- Backend: FastAPI service under `backend/app`
- Frontend: React + TypeScript dashboard under `frontend`
- Database: PostgreSQL for documents, claims, validation results, and audit logs
- Vector DB: Qdrant for policy, payer rule, and appeal-context retrieval
- Cache/Queue: Redis for job state and lightweight async coordination
- Streaming: Kafka for document and claim event pipelines
- Workflow: Airflow DAGs for batch and scheduled processing
- OCR: PaddleOCR and Tesseract adapters
- Vision: OpenCV preprocessing with room for LayoutLMv3/Donut model inference
- RAG: LangChain or LlamaIndex orchestration with Qdrant-backed retrieval
- Monitoring: Prometheus metrics and Grafana dashboards
- Deployment: Docker Compose for local development; Kubernetes manifests for cluster deployment

## Local Development

```bash
cp .env.example .env
make install
make dev
```

The API starts at `http://localhost:8000` and exposes health checks at `/api/v1/health`.

## Repository Layout

```text
backend/      FastAPI application, services, schemas, tests
ai/           OCR, vision, extraction, RAG, reasoning, evaluation modules
frontend/     React + TypeScript dashboard
pipelines/    Airflow, Kafka, and batch processing jobs
infra/        Docker, Kubernetes, and Terraform deployment assets
monitoring/   Prometheus, Grafana, and logging configuration
docs/         Product, architecture, data flow, API, model, and deployment docs
```

# Deployment Guide

## Local

```bash
cp .env.example .env
make compose-up
```

Services:

- API: `http://localhost:8000`
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`
- Qdrant: `http://localhost:6333`
- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:3000`

## Kubernetes

The `infra/kubernetes` directory contains deployment placeholders for backend, frontend, workers, PostgreSQL, Qdrant, and ingress. Harden secrets, storage classes, resource limits, and network policies before production use.

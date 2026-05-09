# API Contracts

## Health

`GET /api/v1/health`

Returns service status, service name, and environment.

## Documents

`POST /api/v1/documents`

Multipart upload field:

- `file`: prescription, claim, EOB, denial letter, or invoice document.

Response:

- `document_id`
- `filename`
- `content_type`
- `status`

## Extraction

`POST /api/v1/extraction`

Request:

- `document_id`
- `document_type`
- `text`

Response:

- `document_id`
- `document_type`
- `fields`
- `status`

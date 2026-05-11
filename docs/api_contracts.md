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

`POST /api/v1/extraction/{document_id}/ocr`

Runs OCR for a staged document. Text files are read directly for local development; image files use the configured OCR adapter.

`POST /api/v1/extraction/{document_id}`

Runs OCR if needed, extracts structured fields, and returns the document text plus fields.

## Validation

`POST /api/v1/validation`

Validates a supplied field list.

`POST /api/v1/validation/{document_id}`

Runs extraction for a document if needed and validates required fields, low-confidence fields, and starter payer-rule checks.

Response:

- `document_id`
- `valid`
- `issues`
- `score`

## Denials

`POST /api/v1/denials/{document_id}`

Explains likely denial or review reasons from validation results.

Response:

- `document_id`
- `reason_code`
- `summary`
- `evidence`
- `next_action`

## Appeals

`POST /api/v1/appeals/{document_id}`

Generates a starter appeal draft from denial reasoning and validation evidence.

Response:

- `appeal_id`
- `denial_id`
- `claim_id`
- `draft_text`
- `citations`

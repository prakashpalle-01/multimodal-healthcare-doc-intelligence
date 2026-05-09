# Model Strategy

## OCR

Start with Tesseract for a lightweight local baseline and PaddleOCR for stronger printed-document extraction. Store raw OCR text, page-level metadata, and confidence values.

## Vision

Use OpenCV for preprocessing, table boundaries, checkboxes, signatures, and image cleanup. Introduce LayoutLMv3 or Donut when labeled layout data is available.

## Extraction

Begin with deterministic field extraction for known document templates. Add entity extraction and document-specific models for claims, prescriptions, EOBs, denial letters, and invoices as annotation coverage grows.

## RAG

Use Qdrant for embeddings over payer policies, denial letters, appeal templates, and internal guidance. LangChain or LlamaIndex can orchestrate retrieval, prompt construction, and response tracing.

# Data Flow

1. A user uploads a healthcare document through the frontend or API.
2. The backend stages metadata and publishes a document upload event.
3. OCR workers extract text and vision signals from the document.
4. Extraction services normalize fields into document-specific schemas.
5. Validation services compare extracted data against claim, payer, and policy rules.
6. RAG services retrieve payer guidance and historical appeal context from Qdrant.
7. Denial reasoning produces plain-language explanations and appeal recommendations.
8. Appeal generation drafts editable appeal text with citations and audit metadata.
9. Results are stored in PostgreSQL and surfaced in the dashboard.

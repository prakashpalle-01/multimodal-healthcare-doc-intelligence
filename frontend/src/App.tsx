import { useMemo, useState } from "react";
import {
  FileInput,
  FileSearch,
  Gauge,
  GitPullRequestArrow,
  LayoutDashboard,
  PenLine,
  ShieldCheck
} from "lucide-react";

import AuditTimeline from "./components/AuditTimeline";
import {
  auditEvents,
  claimSummary,
  denialInsight,
  documents as initialDocuments,
  extractedFields,
  uploadDocument,
  validationIssues
} from "./api/documentsApi";
import { explainDenial, generateAppealDraft } from "./api/appealsApi";
import { extractDocumentFields } from "./api/extractionApi";
import { validateDocument } from "./api/validationApi";
import AppealDraft from "./pages/AppealDraft";
import ClaimValidation from "./pages/ClaimValidation";
import Dashboard from "./pages/Dashboard";
import DenialExplanation from "./pages/DenialExplanation";
import DocumentReview from "./pages/DocumentReview";
import DocumentUpload from "./pages/DocumentUpload";
import type { ClaimSummary } from "./types/claim";
import type { HealthcareDocument } from "./types/document";
import type { DenialInsight, ExtractedField, ValidationIssue } from "./types/extraction";

type View = "dashboard" | "upload" | "review" | "validation" | "denials" | "appeals";

const navItems: Array<{ id: View; label: string; icon: typeof LayoutDashboard }> = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "upload", label: "Upload", icon: FileInput },
  { id: "review", label: "Review", icon: FileSearch },
  { id: "validation", label: "Validation", icon: ShieldCheck },
  { id: "denials", label: "Denials", icon: GitPullRequestArrow },
  { id: "appeals", label: "Appeals", icon: PenLine }
];

export default function App() {
  const [activeView, setActiveView] = useState<View>("dashboard");
  const [documents, setDocuments] = useState<HealthcareDocument[]>(initialDocuments);
  const [selectedDocumentId, setSelectedDocumentId] = useState(initialDocuments[0].id);
  const [fieldsByDocumentId, setFieldsByDocumentId] = useState<Record<string, ExtractedField[]>>({});
  const [validationByDocumentId, setValidationByDocumentId] = useState<
    Record<string, { score: number; issues: ValidationIssue[] }>
  >({});
  const [denialByDocumentId, setDenialByDocumentId] = useState<Record<string, DenialInsight>>({});
  const [appealByDocumentId, setAppealByDocumentId] = useState<Record<string, string>>({});
  const [workflowMessage, setWorkflowMessage] = useState("Ready for document intake.");
  const [validationMessage, setValidationMessage] = useState("Select a backend document and run validation.");
  const [denialMessage, setDenialMessage] = useState("Select a backend document and explain denial.");
  const [appealMessage, setAppealMessage] = useState("Select a backend document and generate an appeal.");

  const selectedDocument = useMemo(
    () => documents.find((document) => document.id === selectedDocumentId) ?? documents[0],
    [documents, selectedDocumentId]
  );
  const selectedFields = fieldsByDocumentId[selectedDocument.id] ?? extractedFields;
  const selectedValidation = validationByDocumentId[selectedDocument.id] ?? {
    score: claimSummary.validationScore,
    issues: validationIssues
  };
  const selectedDenial = denialByDocumentId[selectedDocument.id] ?? denialInsight;
  const selectedClaim = useMemo(
    () => buildClaimSummary(selectedDocument, selectedFields, selectedValidation.score),
    [selectedDocument, selectedFields, selectedValidation.score]
  );

  function isBackendDocument(documentId: string) {
    return !documentId.startsWith("doc-");
  }

  async function handleSelectFile(file: File) {
    setWorkflowMessage(`Uploading ${file.name}...`);
    const document = await uploadDocument(file);
    setDocuments((currentDocuments) => [document, ...currentDocuments]);
    setSelectedDocumentId(document.id);
    setActiveView("review");

    if (document.id.startsWith("doc-")) {
      setWorkflowMessage("Upload is in local preview mode. Start the backend to run OCR extraction.");
      return;
    }

    setWorkflowMessage("Upload complete. Running OCR and extraction...");
    try {
      const fields = await extractDocumentFields(document.id);
      setFieldsByDocumentId((currentFields) => ({
        ...currentFields,
        [document.id]: fields
      }));
      setDocuments((currentDocuments) =>
        currentDocuments.map((currentDocument) =>
          currentDocument.id === document.id
            ? {
                ...currentDocument,
                status: fields.some((field) => field.needsReview) ? "needs_review" : "validated",
                confidence: fields.length
                  ? fields.reduce((total, field) => total + field.confidence, 0) / fields.length
                  : 0
              }
            : currentDocument
        )
      );
      setWorkflowMessage(`Extraction complete. Found ${fields.length} fields.`);
    } catch {
      setWorkflowMessage("Upload succeeded, but extraction failed. Check that the backend is running.");
    }
  }

  async function handleRunValidation() {
    if (!isBackendDocument(selectedDocument.id)) {
      setValidationMessage("This is sample UI data. Upload a document with the backend running to validate it.");
      return;
    }

    setValidationMessage("Running backend validation and payer-rule checks...");
    try {
      const result = await validateDocument(selectedDocument.id);
      setValidationByDocumentId((current) => ({
        ...current,
        [selectedDocument.id]: result
      }));
      setValidationMessage(`Validation complete. Score ${result.score} with ${result.issues.length} issues.`);
    } catch {
      setValidationMessage("Validation failed. Check that the backend is running on port 8000.");
    }
  }

  async function handleExplainDenial() {
    if (!isBackendDocument(selectedDocument.id)) {
      setDenialMessage("This is sample UI data. Upload a document with the backend running to explain denial.");
      return;
    }

    setDenialMessage("Generating backend denial explanation...");
    try {
      const result = await explainDenial(selectedDocument.id);
      setDenialByDocumentId((current) => ({
        ...current,
        [selectedDocument.id]: result
      }));
      setDenialMessage(`Denial explanation ready: ${result.reasonCode}.`);
    } catch {
      setDenialMessage("Denial explanation failed. Check that the backend is running on port 8000.");
    }
  }

  async function handleGenerateAppeal() {
    if (!isBackendDocument(selectedDocument.id)) {
      setAppealMessage("This is sample UI data. Upload a document with the backend running to generate an appeal.");
      return;
    }

    setAppealMessage("Generating backend appeal draft...");
    try {
      const draft = await generateAppealDraft(selectedDocument.id);
      setAppealByDocumentId((current) => ({
        ...current,
        [selectedDocument.id]: draft
      }));
      setAppealMessage("Appeal draft generated from backend validation and denial evidence.");
    } catch {
      setAppealMessage("Appeal generation failed. Check that the backend is running on port 8000.");
    }
  }

  const titleByView: Record<View, string> = {
    dashboard: "Document operations dashboard",
    upload: "Document intake",
    review: "OCR review workspace",
    validation: "Claim validation",
    denials: "Denial explanation",
    appeals: "Appeal draft"
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">
            <Gauge size={24} aria-hidden="true" />
          </div>
          <div>
            <strong>RxNoe</strong>
            <span>Doc Intelligence</span>
          </div>
        </div>

        <nav aria-label="Primary navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                className={activeView === item.id ? "nav-item active" : "nav-item"}
                key={item.id}
                onClick={() => setActiveView(item.id)}
              >
                <Icon size={18} aria-hidden="true" />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div>
            <p>Healthcare document intelligence</p>
            <h1>{titleByView[activeView]}</h1>
          </div>
          <div className="topbar-actions">
            <span className="live-indicator">Live queue</span>
            <button className="primary-button" onClick={() => setActiveView("upload")}>
              <FileInput size={18} aria-hidden="true" />
              Upload
            </button>
          </div>
        </header>

        {activeView === "dashboard" && (
          <Dashboard
            documents={documents}
            selectedId={selectedDocumentId}
            onSelectDocument={(id) => {
              setSelectedDocumentId(id);
              setActiveView("review");
            }}
          />
        )}
        {activeView === "upload" && (
          <DocumentUpload recentDocuments={documents} onSelectFile={handleSelectFile} />
        )}
        {activeView === "review" && (
          <div className="workspace-grid">
            <DocumentReview
              document={selectedDocument}
              fields={selectedFields}
              workflowMessage={workflowMessage}
            />
            <AuditTimeline events={auditEvents} />
          </div>
        )}
        {activeView === "validation" && (
          <ClaimValidation
            claim={selectedClaim}
            issues={selectedValidation.issues}
            score={selectedValidation.score}
            statusMessage={validationMessage}
            onRunValidation={handleRunValidation}
          />
        )}
        {activeView === "denials" && (
          <DenialExplanation
            insight={selectedDenial}
            statusMessage={denialMessage}
            onExplainDenial={handleExplainDenial}
          />
        )}
        {activeView === "appeals" && (
          <AppealDraft
            draft={appealByDocumentId[selectedDocument.id]}
            statusMessage={appealMessage}
            onGenerateAppeal={handleGenerateAppeal}
          />
        )}
      </main>
    </div>
  );
}

function buildClaimSummary(
  document: HealthcareDocument,
  fields: ExtractedField[],
  validationScore: number
): ClaimSummary {
  const fieldMap = new Map(fields.map((field) => [field.label.toLowerCase(), field.value]));
  return {
    claimId: fieldMap.get("claim id") ?? document.id.slice(0, 8),
    payer: fieldMap.get("payer") ?? document.payer,
    memberId: "Pending extraction",
    serviceDate: "Pending extraction",
    billedAmount: "Pending extraction",
    procedureCodes: [],
    diagnosisCodes: [],
    validationScore
  };
}

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
import AppealDraft from "./pages/AppealDraft";
import ClaimValidation from "./pages/ClaimValidation";
import Dashboard from "./pages/Dashboard";
import DenialExplanation from "./pages/DenialExplanation";
import DocumentReview from "./pages/DocumentReview";
import DocumentUpload from "./pages/DocumentUpload";
import type { HealthcareDocument } from "./types/document";

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

  const selectedDocument = useMemo(
    () => documents.find((document) => document.id === selectedDocumentId) ?? documents[0],
    [documents, selectedDocumentId]
  );

  function handleSelectFile(filename: string) {
    const document = uploadDocument(filename);
    setDocuments((currentDocuments) => [document, ...currentDocuments]);
    setSelectedDocumentId(document.id);
    setActiveView("review");
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
            <DocumentReview document={selectedDocument} fields={extractedFields} />
            <AuditTimeline events={auditEvents} />
          </div>
        )}
        {activeView === "validation" && (
          <ClaimValidation claim={claimSummary} issues={validationIssues} />
        )}
        {activeView === "denials" && <DenialExplanation insight={denialInsight} />}
        {activeView === "appeals" && <AppealDraft />}
      </main>
    </div>
  );
}

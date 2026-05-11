import { FileText, ScanLine, ZoomIn } from "lucide-react";

import type { HealthcareDocument } from "../types/document";

interface DocumentViewerProps {
  document: HealthcareDocument;
}

export default function DocumentViewer({ document }: DocumentViewerProps) {
  return (
    <section className="document-viewer" aria-label="Document preview">
      <div className="viewer-toolbar">
        <div>
          <p>{document.type}</p>
          <h2>{document.filename}</h2>
        </div>
        <button className="icon-button" title="Run OCR">
          <ScanLine size={18} aria-hidden="true" />
        </button>
        <button className="icon-button" title="Zoom document">
          <ZoomIn size={18} aria-hidden="true" />
        </button>
      </div>
      <div className="document-canvas">
        <div className="document-file-icon">
          <FileText size={42} aria-hidden="true" />
          <span>{document.type}</span>
        </div>
        <div className="document-lines">
          <span />
          <span />
          <span />
          <span className="short" />
          <span />
          <span className="table" />
          <span className="table" />
        </div>
      </div>
    </section>
  );
}

import FileUploader from "../components/FileUploader";
import type { HealthcareDocument } from "../types/document";

interface DocumentUploadProps {
  recentDocuments: HealthcareDocument[];
  onSelectFile: (file: File) => void;
}

export default function DocumentUpload({ recentDocuments, onSelectFile }: DocumentUploadProps) {
  return (
    <section className="page-stack">
      <FileUploader onSelectFile={onSelectFile} />
      <section className="panel">
        <div className="panel-heading">
          <div>
            <p>Recent intake</p>
            <h2>Upload activity</h2>
          </div>
        </div>
        <div className="activity-list">
          {recentDocuments.slice(0, 4).map((document) => (
            <article key={document.id}>
              <strong>{document.filename}</strong>
              <span>{document.type} · {document.status.replace("_", " ")}</span>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

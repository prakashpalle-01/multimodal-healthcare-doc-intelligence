import { FileUp, UploadCloud } from "lucide-react";

interface FileUploaderProps {
  onSelectFile: (file: File) => void;
}

export default function FileUploader({ onSelectFile }: FileUploaderProps) {
  return (
    <section className="upload-panel" aria-label="Document upload">
      <div className="upload-dropzone">
        <UploadCloud size={36} aria-hidden="true" />
        <div>
          <h2>Upload healthcare documents</h2>
          <p>Prescriptions, claims, EOBs, denial letters, and invoices are accepted.</p>
        </div>
        <label className="file-action">
          <FileUp size={18} aria-hidden="true" />
          Select files
          <input
            type="file"
            multiple
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) {
                onSelectFile(file);
              }
            }}
          />
        </label>
      </div>
    </section>
  );
}

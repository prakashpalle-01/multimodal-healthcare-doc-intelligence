import { Copy, Save } from "lucide-react";
import { useEffect, useState } from "react";

interface AppealEditorProps {
  draft: string;
}

export default function AppealEditor({ draft }: AppealEditorProps) {
  const [draftText, setDraftText] = useState(draft);

  useEffect(() => {
    setDraftText(draft);
  }, [draft]);

  return (
    <section className="panel editor-panel" aria-label="Appeal draft editor">
      <div className="editor-toolbar">
        <div>
          <p>Appeal draft</p>
          <h2>Medical necessity response</h2>
        </div>
        <div className="button-row">
          <button className="icon-button" title="Copy draft">
            <Copy size={18} aria-hidden="true" />
          </button>
          <button className="primary-button">
            <Save size={18} aria-hidden="true" />
            Save draft
          </button>
        </div>
      </div>
      <textarea
        value={draftText}
        onChange={(event) => setDraftText(event.target.value)}
        aria-label="Appeal draft text"
      />
    </section>
  );
}

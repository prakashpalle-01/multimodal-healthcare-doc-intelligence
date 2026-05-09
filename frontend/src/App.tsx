export default function App() {
  return (
    <main className="app-shell">
      <section className="workspace">
        <header>
          <p>Healthcare Document Intelligence</p>
          <h1>Document operations dashboard</h1>
        </header>
        <div className="status-grid">
          <article>
            <span>Phase 1</span>
            <strong>Backend, OCR, extraction</strong>
          </article>
          <article>
            <span>Phase 2</span>
            <strong>Validation and payer rules</strong>
          </article>
          <article>
            <span>Phase 3</span>
            <strong>RAG, denials, appeals</strong>
          </article>
        </div>
      </section>
    </main>
  );
}

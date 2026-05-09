import { Clock3 } from "lucide-react";

import type { AuditEvent } from "../types/document";

interface AuditTimelineProps {
  events: AuditEvent[];
}

export default function AuditTimeline({ events }: AuditTimelineProps) {
  return (
    <section className="panel" aria-label="Audit timeline">
      <div className="panel-heading">
        <div>
          <p>Audit</p>
          <h2>Timeline</h2>
        </div>
      </div>
      <ol className="timeline">
        {events.map((event) => (
          <li key={event.id}>
            <Clock3 size={16} aria-hidden="true" />
            <div>
              <strong>{event.label}</strong>
              <p>{event.detail}</p>
              <small>
                {event.actor} - {event.timestamp}
              </small>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

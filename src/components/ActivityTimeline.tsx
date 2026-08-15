import type { ActivityEvent } from '../domain/types'

export function ActivityTimeline({ events }: { events: readonly ActivityEvent[] }) {
  return <section aria-labelledby="activity-title">
    <h2 id="activity-title">Immutable activity timeline</h2>
    {events.length ? <ol className="case-chronology activity-timeline">
      {events.map((event, index) => <li key={event.id}>
        <span className="chronology-event__number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        <div className="chronology-event__body">
          <p className="chronology-event__status"><span>Status:</span><strong>{event.toStatus.replaceAll('_', ' ')}</strong></p>
          <p className="chronology-event__reason"><span>Reason:</span>{event.reason}</p>
          <dl className="chronology-event__metadata">
            <div><dt>Actor:</dt><dd>{event.actorPerspective}</dd></div>
            <div><dt>Recorded:</dt><dd><time dateTime={event.timestamp}>{new Date(event.timestamp).toLocaleString('en-IN')}</time></dd></div>
          </dl>
        </div>
      </li>)}
    </ol> : <p>No recorded transitions yet.</p>}
  </section>
}

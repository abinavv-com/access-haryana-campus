import type { ActivityEvent } from '../domain/types'

export function ActivityTimeline({ events }: { events: readonly ActivityEvent[] }) {
  return <section aria-labelledby="activity-title"><h2 id="activity-title">Immutable activity timeline</h2>{events.length ? <ol className="activity-timeline">{events.map(event => <li key={event.id}><strong>{event.toStatus.replaceAll('_', ' ')}</strong><span>{event.reason}</span><small>{event.actorPerspective} · {new Date(event.timestamp).toLocaleString('en-IN')}</small></li>)}</ol> : <p>No recorded transitions yet.</p>}</section>
}

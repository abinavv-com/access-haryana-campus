import { useState, type Dispatch } from 'react'
import { ActivityTimeline } from '../components/ActivityTimeline'
import { EvidenceImage } from '../components/EvidenceImage'
import type { DemoAction } from '../domain/demoReducer'
import { calculatePriority } from '../domain/calculations'
import type { DemoState } from '../domain/types'

export function BarrierScreen({ state, dispatch, barrierId, navigate }: { state: DemoState; dispatch: Dispatch<DemoAction>; barrierId: string; navigate: (path: string) => void }) {
  const barrier = state.barriers.find(item => item.id === barrierId)
  const [message, setMessage] = useState('')
  const [override, setOverride] = useState(false)
  const [overrideReason, setOverrideReason] = useState('Safety and dignity review')
  if (!barrier) return <section><h1>Barrier not found</h1></section>
  const barrierStatus = barrier.status
  const events = state.activity.filter(item => item.barrierId === barrier.id)
  const priority = calculatePriority({ severity: barrier.severity, essentialServiceImpact: true, alternativeRouteQuality: 'none', affectedJourneys: 1, urgency: 'immediate', fixability: 'quick' })
  function apply(command: DemoAction & { type: 'APPLY_TRANSITION' }) {
    dispatch(command)
    setMessage('')
  }
  function validate() { apply({ type: 'APPLY_TRANSITION', command: { type: 'validate', barrierId, eventId: `event-validate-${events.length}`, timestamp: '2026-08-13T10:15:00.000Z', actorPerspective: 'facilities', reason: 'Designated accessibility reviewer reviewed the screening evidence; measurement retained without claiming compliance.', reviewerRole: 'Designated accessibility reviewer' } }) }
  function prioritise() {
    if (barrierStatus !== 'validated') { setMessage(`The prioritise command is not allowed from ${barrierStatus}.`); return }
    if (override && !overrideReason.trim()) { setMessage('A reason is required to override calculated priority.'); return }
    apply({ type: 'APPLY_TRANSITION', command: { type: 'prioritise', barrierId, eventId: `event-priority-${events.length}`, timestamp: '2026-08-13T10:20:00.000Z', actorPerspective: 'facilities', reason: `Priority ${override ? 'overridden to critical' : `calculated as ${priority.band}`} (score ${priority.score}). ${override ? `Override reason: ${overrideReason}.` : ''} Fixability is used only for delivery sequencing.` } })
  }
  function hazard() { apply({ type: 'APPLY_TRANSITION', command: { type: 'escalate_hazard', barrierId, eventId: `event-hazard-${events.length}`, timestamp: '2026-08-13T10:10:00.000Z', actorPerspective: 'facilities', reason: 'Potential immediate hazard escalated.', interimControl: 'Temporary signed assistance route and obstruction warning; not a permanent fix.' } }) }
  return <div className="screen-stack"><section className="hero-panel"><p className="eyebrow">Barrier record · fictional demo</p><h1>{barrier.title}</h1><p>This is a screening finding, not a compliance determination or certification.</p><p><strong>Status:</strong> {barrier.status.replaceAll('_', ' ')}</p></section>{message ? <div role="alert" className="error-summary">{message}</div> : null}<section className="record-grid"><div><h2>Evidence and review</h2><p><strong>Campus zone:</strong> {barrier.campusZone}</p><p>{barrier.description}</p>{barrier.guidelineReference ? <p className="standard-note">{barrier.guidelineReference.source} · {barrier.guidelineReference.editionYear} · Section {barrier.guidelineReference.section} · Screening</p> : null}<EvidenceImage evidence={barrier.evidence[0]} /></div><aside><h2>Safety and route</h2><p><strong>Potential immediate hazard:</strong> escalated separately from lifecycle status.</p><p><strong>Alternative route:</strong> No safe, signed, available and comparably dignified alternative is recorded.</p><button onClick={hazard}>Record interim control</button></aside></section><section><h2>Priority rationale</h2><p>Score {priority.score} ({priority.band}): severity, essential service impact, alternative route, affected journey and urgency. Fixability ({priority.sequencing}) affects sequencing only and cannot lower safety or rights urgency.</p><label><input type="checkbox" checked={override} onChange={event => setOverride(event.target.checked)} /> Override calculated priority</label>{override ? <label className="field-stack">Override reason<input value={overrideReason} onChange={event => setOverrideReason(event.target.value)} /></label> : null}<div className="action-row"><button onClick={validate} disabled={barrier.status !== 'observed'}>Validate screening</button><button onClick={prioritise}>Prioritise barrier</button><button onClick={() => setMessage(`The prioritise command is not allowed from ${barrier.status}.`)}>Prioritise before validation</button>{barrier.status === 'prioritised' ? <button className="button-primary" onClick={() => navigate(`/work-orders/${barrier.id}`)}>Create repair work order</button> : null}</div></section><ActivityTimeline events={events} /></div>
}

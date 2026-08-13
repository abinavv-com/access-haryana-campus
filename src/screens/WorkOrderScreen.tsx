import { useState, type Dispatch } from 'react'
import { ActivityTimeline } from '../components/ActivityTimeline'
import { EvidenceImage } from '../components/EvidenceImage'
import type { DemoAction } from '../domain/demoReducer'
import { illustrativeDataLabel, type DemoState, type EvidenceItem } from '../domain/types'

const afterEvidence: EvidenceItem = { id: 'evidence-repair-after', dataLabel: illustrativeDataLabel, kind: 'illustrative_photo', path: '/media/gradual-ramp-pathway.jpg', altText: 'Illustrative after-repair example showing a clear gradual pathway; not the same real-world location as the before image.', capturedAt: '2026-08-14T11:00:00.000Z' }

export function WorkOrderScreen({ state, dispatch, barrierId }: { state: DemoState; dispatch: Dispatch<DemoAction>; barrierId: string }) {
  const barrier = state.barriers.find(item => item.id === barrierId)
  const workOrder = state.workOrders.find(item => item.barrierId === barrierId)
  const [owner, setOwner] = useState('Campus facilities officer')
  const [error, setError] = useState('')
  if (!barrier) return <section><h1>Barrier not found</h1></section>
  const events = state.activity.filter(item => item.barrierId === barrierId)
  function create() {
    if (!owner.trim()) { setError('Owner role is required.'); return }
    setError('')
    dispatch({ type: 'APPLY_TRANSITION', command: { type: 'assign', barrierId, eventId: 'event-assign-work-order', timestamp: '2026-08-13T10:30:00.000Z', actorPerspective: 'facilities', reason: 'Repair work assigned with owner, cost band and due date.', workOrder: { id: 'work-order-primary', barrierId, dataLabel: illustrativeDataLabel, ownerRole: owner, remedy: 'Remove stored materials, repair surface and restore clear landing width.', costBand: '₹10,000–₹25,000 (illustrative)', dueDate: '2026-08-20', repairEvidence: [] } } })
  }
  function submitEvidence() { dispatch({ type: 'APPLY_TRANSITION', command: { type: 'submit_evidence', barrierId, eventId: 'event-submit-repair-evidence', timestamp: '2026-08-14T11:05:00.000Z', actorPerspective: 'facilities', reason: 'Structured repair evidence submitted. This does not mean verified complete.', workOrderId: workOrder!.id, evidence: [afterEvidence] } }) }
  return <div className="screen-stack"><section className="hero-panel"><p className="eyebrow">Repair work order · illustrative demo data</p><h1>{barrier.title}</h1><p><strong>Status:</strong> {barrier.status.replaceAll('_', ' ')}</p>{barrier.status === 'awaiting_verification' ? <p><strong>Repair evidence submitted — awaiting verification.</strong> This does not mean verified complete; an independent bounded journey retest is required.</p> : null}</section>{error ? <div role="alert" className="error-summary">{error}</div> : null}{!workOrder ? <section><h2>Assignment</h2><label className="field-stack">Owner role<input value={owner} onChange={event => setOwner(event.target.value)} /></label><label className="field-stack">Repair remedy<textarea defaultValue="Remove obstruction and restore the clear landing." /></label><div className="work-fields"><p><strong>Cost band:</strong> ₹10,000–₹25,000 (illustrative)</p><p><strong>Due date:</strong> 20 August 2026</p></div><button className="button-primary" onClick={create}>Create work order</button></section> : <section><h2>Assigned work</h2><p><strong>Assigned:</strong> {workOrder.ownerRole}</p><p>{workOrder.remedy}</p><div className="comparison-grid"><div><h3>Before repair</h3><EvidenceImage evidence={barrier.evidence[0]} /></div><div><h3>After repair</h3><EvidenceImage evidence={workOrder.repairEvidence[0] ?? afterEvidence} /><p>Illustrative comparison only; post-repair measurement and independent retest remain required.</p></div></div>{barrier.status === 'assigned' ? <button className="button-primary" onClick={submitEvidence}>Submit repair evidence</button> : null}</section>}<ActivityTimeline events={events} /></div>
}

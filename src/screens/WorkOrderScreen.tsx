import { useState, type Dispatch } from 'react'
import { ActivityTimeline } from '../components/ActivityTimeline'
import { EvidenceImage } from '../components/EvidenceImage'
import { ErrorSummary } from '../components/ErrorSummary'
import type { DemoAction } from '../domain/demoReducer'
import { illustrativeDataLabel, type DemoState, type EvidenceItem } from '../domain/types'
import { validateWorkOrder } from '../domain/validation'

const afterEvidence: EvidenceItem = { id: 'evidence-repair-after', dataLabel: illustrativeDataLabel, kind: 'illustrative_photo', path: '/media/gradual-ramp-pathway.jpg', altText: 'Illustrative after-repair example showing a clear gradual pathway; not the same real-world location as the before image.', capturedAt: '2026-08-14T11:00:00.000Z' }

export function WorkOrderScreen({ state, dispatch, barrierId }: { state: DemoState; dispatch: Dispatch<DemoAction>; barrierId: string }) {
  const barrier = state.barriers.find(item => item.id === barrierId)
  const workOrder = state.workOrders.find(item => item.barrierId === barrierId)
  const [owner, setOwner] = useState('Campus facilities officer')
  const [remedy, setRemedy] = useState('Remove obstruction and restore the clear landing.')
  const [costBand, setCostBand] = useState('₹10,000–₹25,000 (illustrative)')
  const [dueDate, setDueDate] = useState('2026-08-20')
  const [errors, setErrors] = useState<string[]>([])
  if (!barrier) return <section><h1>Barrier not found</h1></section>
  const barrierStatus = barrier.status
  const events = state.activity.filter(item => item.barrierId === barrierId)
  function create() {
    const nextErrors = validateWorkOrder({ barrierStatus, ownerRole: owner, remedy, costBand, dueDate })
    setErrors(nextErrors)
    if (nextErrors.length) return
    dispatch({ type: 'APPLY_TRANSITION', command: { type: 'assign', barrierId, eventId: 'event-assign-work-order', timestamp: '2026-08-13T10:30:00.000Z', actorPerspective: 'facilities', reason: 'Repair work assigned with owner, remedy, cost band and due date.', workOrder: { id: 'work-order-primary', barrierId, dataLabel: illustrativeDataLabel, ownerRole: owner.trim(), remedy: remedy.trim(), costBand: costBand.trim(), dueDate, repairEvidence: [] } } })
  }
  function submitEvidence() { dispatch({ type: 'APPLY_TRANSITION', command: { type: 'submit_evidence', barrierId, eventId: 'event-submit-repair-evidence', timestamp: '2026-08-14T11:05:00.000Z', actorPerspective: 'facilities', reason: 'Structured repair evidence submitted. This does not mean verified complete.', workOrderId: workOrder!.id, evidence: [afterEvidence] } }) }
  return <div className="screen-stack"><section className="hero-panel"><p className="eyebrow">Repair work order · illustrative demo data</p><h1>{barrier.title}</h1><p><strong>Status:</strong> {barrier.status.replaceAll('_', ' ')}</p>{barrier.status === 'awaiting_verification' ? <p><strong>Repair evidence submitted — awaiting verification.</strong> This does not mean verified complete; an independent bounded journey retest is required.</p> : null}</section><ErrorSummary errors={errors}/>{!workOrder ? <section><h2>Assignment</h2><label className="field-stack">Owner role<input value={owner} onChange={event => setOwner(event.target.value)} /></label><label className="field-stack">Repair remedy<textarea value={remedy} onChange={event => setRemedy(event.target.value)} /></label><div className="work-fields"><label className="field-stack">Cost band<input value={costBand} onChange={event => setCostBand(event.target.value)} /></label><label className="field-stack">Due date<input type="date" value={dueDate} onChange={event => setDueDate(event.target.value)} /></label></div><button className="button-primary" onClick={create}>Create work order</button></section> : <section><h2>Assigned work</h2><p><strong>Assigned:</strong> {workOrder.ownerRole}</p><p>{workOrder.remedy}</p><p><strong>Cost band:</strong> {workOrder.costBand}</p><p><strong>Due date:</strong> {new Date(`${workOrder.dueDate}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p><div className="comparison-grid"><div><h3>Before repair</h3><EvidenceImage evidence={barrier.evidence[0]} /></div><div><h3>After repair</h3><EvidenceImage evidence={workOrder.repairEvidence[0] ?? afterEvidence} /><p>Illustrative comparison only; post-repair measurement and independent retest remain required.</p></div></div>{barrier.status === 'assigned' ? <button className="button-primary" onClick={submitEvidence}>Submit repair evidence</button> : null}</section>}<ActivityTimeline events={events} /></div>
}

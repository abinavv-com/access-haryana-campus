import { useState, type Dispatch, type FormEvent } from 'react'
import { ActivityTimeline } from '../components/ActivityTimeline'
import { EvidenceImage } from '../components/EvidenceImage'
import { ErrorSummary } from '../components/ErrorSummary'
import type { DemoAction } from '../domain/demoReducer'
import { illustrativeDataLabel, type DemoState, type EvidenceItem } from '../domain/types'
import { validateWorkOrder } from '../domain/validation'

const afterEvidence: EvidenceItem = {
  id: 'evidence-repair-after',
  dataLabel: illustrativeDataLabel,
  kind: 'illustrative_photo',
  path: '/media/gradual-ramp-pathway.jpg',
  altText: 'Illustrative after-repair example showing a clear gradual pathway; not the same real-world location as the before image.',
  capturedAt: '2026-08-14T11:00:00.000Z',
}

export function WorkOrderScreen({ state, dispatch, barrierId, navigate = () => {} }: { state: DemoState; dispatch: Dispatch<DemoAction>; barrierId: string; navigate?: (path: string) => void }) {
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
    dispatch({
      type: 'APPLY_TRANSITION',
      command: {
        type: 'assign',
        barrierId,
        eventId: 'event-assign-work-order',
        timestamp: '2026-08-13T10:30:00.000Z',
        actorPerspective: 'facilities',
        reason: 'Repair work assigned with owner, remedy, cost band and due date.',
        workOrder: {
          id: 'work-order-primary',
          barrierId,
          dataLabel: illustrativeDataLabel,
          ownerRole: owner.trim(),
          remedy: remedy.trim(),
          costBand: costBand.trim(),
          dueDate,
          repairEvidence: [],
        },
      },
    })
  }

  function submitEvidence() {
    dispatch({
      type: 'APPLY_TRANSITION',
      command: {
        type: 'submit_evidence',
        barrierId,
        eventId: 'event-submit-repair-evidence',
        timestamp: '2026-08-14T11:05:00.000Z',
        actorPerspective: 'facilities',
        reason: 'Structured repair evidence submitted. This does not mean verified complete.',
        workOrderId: workOrder!.id,
        evidence: [afterEvidence],
      },
    })
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!workOrder) create()
  }

  return <div className="screen-stack work-order-screen">
    <form className="repair-brief" onSubmit={handleSubmit} noValidate>
      <header className="repair-brief__header">
        <div className="repair-brief__folio">
          <p className="eyebrow">Repair brief · illustrative demo data</p>
          <p>{workOrder?.id ?? 'work-order-primary · draft'}</p>
        </div>
        <h1>Repair work order</h1>
        <p className="repair-brief__barrier">For barrier <strong>{barrier.id}</strong> · {barrier.title}</p>
        <p className="repair-brief__status"><span>Status</span><strong>{barrier.status.replaceAll('_', ' ')}</strong></p>
        <p className="repair-brief__qualification">This brief records a bounded repair assignment and its evidence trail. Completion remains subject to independent verification.</p>
      </header>

      <ErrorSummary errors={errors} />

      {!workOrder ? <div className="repair-brief__form-grid">
        <fieldset className="repair-brief__group">
          <legend>Responsibility and remedy</legend>
          <p className="repair-brief__instruction">Name the accountable delivery role and the specific physical remedy.</p>
          <label className="field-stack">Owner role<input value={owner} onChange={event => setOwner(event.target.value)} /></label>
          <label className="field-stack">Repair remedy<textarea value={remedy} onChange={event => setRemedy(event.target.value)} /></label>
        </fieldset>

        <fieldset className="repair-brief__group">
          <legend>Cost and due date</legend>
          <p className="repair-brief__instruction">Keep the illustrative cost band and delivery date attached to this assignment.</p>
          <label className="field-stack">Cost band<input value={costBand} onChange={event => setCostBand(event.target.value)} /></label>
          <label className="field-stack">Due date<input type="date" value={dueDate} onChange={event => setDueDate(event.target.value)} /></label>
        </fieldset>

        <div className="repair-brief__submit">
          <p>Assignment authorises repair work only. The repair owner cannot independently verify the outcome.</p>
          <button className="button-primary" type="submit">Create work order</button>
        </div>
      </div> : <section className="repair-brief__assignment" aria-labelledby="assigned-work-heading">
        <p className="record-marker" aria-hidden="true">01 / authorised assignment</p>
        <h2 id="assigned-work-heading">Assigned work</h2>
        <dl className="repair-brief__ledger">
          <div><dt>Responsible role</dt><dd>{workOrder.ownerRole}</dd></div>
          <div><dt>Repair remedy</dt><dd>{workOrder.remedy}</dd></div>
          <div><dt>Cost band</dt><dd>{workOrder.costBand}</dd></div>
          <div><dt>Due date</dt><dd><time dateTime={workOrder.dueDate}>{new Date(`${workOrder.dueDate}T00:00:00`).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</time></dd></div>
        </dl>

        <section className="repair-evidence" aria-labelledby="repair-evidence-heading">
          <p className="record-marker" aria-hidden="true">02 / repair evidence</p>
          <h2 id="repair-evidence-heading">Before and after evidence</h2>
          <p className="repair-evidence__qualification"><strong>Explicitly unmatched illustrative comparison.</strong> The after image is not the same real-world location as the before image. Post-repair measurement and independent retest remain required.</p>
          <div className="comparison-grid repair-evidence__plates">
            <article>
              <h3>Before repair</h3>
              <EvidenceImage evidence={barrier.evidence[0]} />
            </article>
            <article>
              <h3>After repair</h3>
              <EvidenceImage evidence={workOrder.repairEvidence[0] ?? afterEvidence} />
            </article>
          </div>
          {barrier.status === 'assigned' ? <button className="button-primary" type="button" onClick={submitEvidence}>Submit repair evidence</button> : null}
        </section>
      </section>}

      <aside className="handoff-notice" aria-labelledby="handoff-heading">
        <p className="eyebrow">Formal handoff</p>
        <h2 id="handoff-heading">{barrier.status === 'awaiting_verification' ? 'Awaiting independent verification' : workOrder ? 'Repair evidence handoff' : 'Assignment boundary'}</h2>
        {barrier.status === 'awaiting_verification' ? <>
          <p><strong>Repair evidence submitted — awaiting verification.</strong> This does not mean verified complete. A verifier independent from the repair owner must conduct a bounded journey retest.</p>
          <button className="button-primary" type="button" onClick={() => navigate(`/verification/${barrier.id}`)}>Continue to independent verification</button>
        </> : workOrder ? <p>The repair owner remains responsible for evidence submission. A different role must make the later verification decision.</p> : <p>Creating this brief records responsibility, remedy, cost and timing. It does not certify that a repair is complete or suitable for every person or journey.</p>}
      </aside>
    </form>
    <ActivityTimeline events={events} />
  </div>
}

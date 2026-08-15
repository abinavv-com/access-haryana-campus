import { useState, type Dispatch } from 'react'
import { ActivityTimeline } from '../components/ActivityTimeline'
import { EvidenceImage } from '../components/EvidenceImage'
import type { DemoAction } from '../domain/demoReducer'
import { calculatePriority, type PriorityBand } from '../domain/calculations'
import type { DemoState } from '../domain/types'

export function BarrierScreen({ state, dispatch, barrierId, navigate }: { state: DemoState; dispatch: Dispatch<DemoAction>; barrierId: string; navigate: (path: string) => void }) {
  const barrier = state.barriers.find(item => item.id === barrierId)
  const [message, setMessage] = useState('')
  const [override, setOverride] = useState(false)
  const [overrideBand, setOverrideBand] = useState<PriorityBand>('moderate')
  const [overrideReason, setOverrideReason] = useState('Safety and dignity review')
  if (!barrier) return <section><h1>Barrier not found</h1></section>
  const barrierStatus = barrier.status
  const events = state.activity.filter(item => item.barrierId === barrier.id)
  const priorityInput = { severity: barrier.severity, essentialServiceImpact: true, alternativeRouteQuality: 'none' as const, affectedJourneys: 1, urgency: 'immediate' as const, fixability: 'quick' as const }
  const calculatedPriority = calculatePriority(priorityInput)

  function apply(command: DemoAction & { type: 'APPLY_TRANSITION' }) {
    dispatch(command)
    setMessage('')
  }

  function validate() {
    apply({ type: 'APPLY_TRANSITION', command: { type: 'validate', barrierId, eventId: `event-validate-${events.length}`, timestamp: '2026-08-13T10:15:00.000Z', actorPerspective: 'facilities', reason: 'Designated accessibility reviewer reviewed the screening evidence; measurement retained without claiming compliance.', reviewerRole: 'Designated accessibility reviewer' } })
  }

  function prioritise() {
    if (barrierStatus !== 'validated') {
      setMessage(`The prioritise command is not allowed from ${barrierStatus}.`)
      return
    }
    let priority = calculatedPriority
    try {
      priority = calculatePriority({ ...priorityInput, overrideBand: override ? overrideBand : undefined, overrideReason: override ? overrideReason : undefined })
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Priority could not be calculated.')
      return
    }
    apply({ type: 'APPLY_TRANSITION', command: { type: 'prioritise', barrierId, eventId: `event-priority-${events.length}`, timestamp: '2026-08-13T10:20:00.000Z', actorPerspective: 'facilities', reason: override ? `Priority overridden from ${calculatedPriority.band} to ${priority.band} (calculated score ${priority.score}). Override reason: ${overrideReason}. Fixability is used only for delivery sequencing.` : `Priority calculated as ${priority.band} (score ${priority.score}). Fixability is used only for delivery sequencing.` } })
  }

  function hazard() {
    apply({ type: 'APPLY_TRANSITION', command: { type: 'escalate_hazard', barrierId, eventId: `event-hazard-${events.length}`, timestamp: '2026-08-13T10:10:00.000Z', actorPerspective: 'facilities', reason: 'Potential immediate hazard escalated.', interimControl: 'Temporary signed assistance route and obstruction warning; not a permanent fix.' } })
  }

  return <div className="screen-stack barrier-case-screen">
    <article className="case-file">
      <header className="case-file__header">
        <div className="case-file__folio">
          <p className="eyebrow">Barrier case file · fictional demo</p>
          <p>Record {barrier.id}</p>
        </div>
        <h1>{barrier.title}</h1>
        <p className="case-file__status"><span>Status</span><strong>{barrier.status.replaceAll('_', ' ')}</strong></p>
        <p className="case-file__qualification">This is a screening finding, not a compliance determination or certification.</p>
        {barrier.guidelineReference ? <p className="standard-note case-file__provenance"><strong>Guideline provenance:</strong> {barrier.guidelineReference.source} · {barrier.guidelineReference.editionYear} · Section {barrier.guidelineReference.section} · Screening</p> : null}
      </header>

      {message ? <div role="alert" className="error-summary case-file__alert">{message}</div> : null}

      <div className="case-file__body">
        <section className="case-file__evidence" aria-labelledby="barrier-evidence-heading">
          <p className="record-marker" aria-hidden="true">01 / evidence record</p>
          <h2 id="barrier-evidence-heading">Recorded evidence</h2>
          <dl className="case-file__facts">
            <div><dt>Campus zone</dt><dd>{barrier.campusZone}</dd></div>
            <div><dt>Severity</dt><dd>{barrier.severity}</dd></div>
            <div><dt>Observed</dt><dd><time dateTime={barrier.observedAt}>{new Date(barrier.observedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</time></dd></div>
          </dl>
          <p className="case-file__description">{barrier.description}</p>
          <EvidenceImage evidence={barrier.evidence[0]} />
        </section>

        <div className="case-file__decisions">
          <section className="decision-annotation" aria-labelledby="priority-heading">
            <p className="record-marker" aria-hidden="true">02 / decision annotation</p>
            <h2 id="priority-heading">Priority rationale</h2>
            <p className="decision-annotation__calculation">Score {calculatedPriority.score} ({calculatedPriority.band}): severity, essential service impact, alternative route, affected journey and urgency. Fixability ({calculatedPriority.sequencing}) affects sequencing only and cannot lower safety or rights urgency.</p>

            <div className="decision-annotation__gate">
              <h3>Designated review</h3>
              <p>Validation records reviewer provenance without turning this screening record into a compliance finding.</p>
              <div className="action-row">
                <button onClick={validate} disabled={barrier.status !== 'observed'}>Validate screening</button>
                {barrier.status === 'observed' ? <button onClick={() => setMessage(`The prioritise command is not allowed from ${barrier.status}.`)}>Prioritise before validation</button> : null}
              </div>
            </div>

            <div className="decision-annotation__gate">
              <h3>Prioritisation decision</h3>
              <label className="check-control"><input type="checkbox" checked={override} onChange={event => setOverride(event.target.checked)} /> Override calculated priority</label>
              {override ? <div className="priority-override-fields">
                <label className="field-stack">Override band<select value={overrideBand} onChange={event => setOverrideBand(event.target.value as PriorityBand)}><option value="low">Low</option><option value="moderate">Moderate</option><option value="high">High</option><option value="critical">Critical</option></select></label>
                <label className="field-stack">Override reason<input value={overrideReason} onChange={event => setOverrideReason(event.target.value)} /></label>
              </div> : null}
              <div className="action-row">
                <button onClick={prioritise} disabled={barrier.status !== 'validated'}>Prioritise barrier</button>
                {barrier.status === 'prioritised' ? <button className="button-primary" onClick={() => navigate(`/work-orders/${barrier.id}`)}>Create repair work order</button> : null}
              </div>
            </div>
          </section>

          <aside className="alternative-decision" aria-labelledby="alternative-route-heading">
            <p className="record-marker" aria-hidden="true">03 / route decision</p>
            <h2 id="alternative-route-heading">Alternative route decision</h2>
            <p><strong>No suitable alternative recorded.</strong> No safe, signed, available and comparably dignified alternative is recorded.</p>
          </aside>

          <aside className="hazard-control" aria-labelledby="hazard-control-heading">
            <p className="record-marker" aria-hidden="true">04 / interim control</p>
            <h2 id="hazard-control-heading">Potential hazard control</h2>
            <p>Hazard escalation is recorded separately from lifecycle status. An interim control is not a permanent repair.</p>
            <button onClick={hazard}>Record interim control</button>
          </aside>
        </div>
      </div>
    </article>
    <ActivityTimeline events={events} />
  </div>
}

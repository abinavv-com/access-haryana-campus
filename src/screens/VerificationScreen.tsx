import { useState, type Dispatch } from 'react'
import { ActivityTimeline } from '../components/ActivityTimeline'
import { ErrorSummary } from '../components/ErrorSummary'
import { EvidenceImage } from '../components/EvidenceImage'
import type { DemoAction } from '../domain/demoReducer'
import type { DemoState } from '../domain/types'
import { validateVerification } from '../domain/validation'

export function VerificationScreen({ state, dispatch, barrierId, navigate, now = () => new Date().toISOString() }: { state: DemoState; dispatch: Dispatch<DemoAction>; barrierId: string; navigate: (path: string) => void; now?: () => string }) {
  const barrier = state.barriers.find(item => item.id === barrierId)
  const journey = barrier && state.journeys.find(item => item.id === barrier.journeyId)
  const workOrder = state.workOrders.find(item => item.barrierId === barrierId)
  const [consented, setConsented] = useState(false)
  const [testerRole, setTesterRole] = useState('Independent student journey tester')
  const [conditions, setConditions] = useState('Dry daylight conditions; main gate to admissions; step-free mobility journey.')
  const [reason, setReason] = useState('')
  const [beforeMinutes, setBeforeMinutes] = useState(12)
  const [afterMinutes, setAfterMinutes] = useState(7)
  const [beforeSucceeded, setBeforeSucceeded] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  if (!barrier || !journey || !workOrder) return <section><h1>Verification unavailable</h1><p>Repair evidence and a matching work order are required.</p></section>

  function decide(decision: 'accepted' | 'rejected' | 'additional_inspection') {
    const beforeOutcome = { succeeded: beforeSucceeded, completionMinutes: beforeMinutes }, afterOutcome = { succeeded: decision === 'accepted', completionMinutes: afterMinutes }
    const nextErrors = validateVerification({ decision, consented, testerRole, journeyId: journey!.id, accessRequirement: journey!.accessRequirement, definedTestConditions: conditions, beforeOutcome, afterOutcome, reason }, { ownerRole: workOrder!.ownerRole, hasRepairEvidence: workOrder!.repairEvidence.length > 0 })
    setErrors(nextErrors)
    if (nextErrors.length) return
    const type = decision === 'accepted' ? 'accept' : decision === 'rejected' ? 'reject' : 'request_inspection'
    const eventReason = decision === 'accepted' ? `Accepted only for this defined journey and test conditions. ${reason}` : decision === 'rejected' ? reason : `Another independent inspection requested. ${reason}`
    dispatch({ type: 'APPLY_TRANSITION', command: { type, barrierId, eventId: `event-${type}-${state.verifications.length + 1}`, verificationId: `verification-${state.verifications.length + 1}`, timestamp: now(), actorPerspective: 'verifier', reason: eventReason, consented, testerRole, definedTestConditions: conditions, beforeOutcome, afterOutcome } })
  }

  const events = state.activity.filter(item => item.barrierId === barrierId)
  return <div className="screen-stack verification-screen">
    <section className="hero-panel verification-cover">
      <div className="verification-cover__lead">
        <p className="eyebrow">Independent retest · illustrative demo data</p>
        <h1>User verification</h1>
        <p className="verification-cover__standfirst">A person-led retest of one access journey, under stated conditions, after repair evidence has been recorded.</p>
      </div>
      <dl className="verification-cover__facts">
        <div><dt>Journey</dt><dd>{journey.name}</dd></div>
        <div><dt>Access requirement</dt><dd>{journey.accessRequirement}</dd></div>
        <div><dt>Current status</dt><dd>{barrier.status.replaceAll('_', ' ')}</dd></div>
      </dl>
    </section>

    <ErrorSummary errors={errors}/>

    <section className="consent-panel verification-charter" aria-labelledby="verification-charter-title">
      <header className="verification-charter__heading">
        <p className="worksheet-step">Charter 01</p>
        <h2 id="verification-charter-title">Voluntary consent and independence</h2>
        <p>The retest records a journey account. It does not assess or diagnose the person making it.</p>
      </header>
      <div className="verification-charter__principles">
        <div><strong>Choice remains with the participant</strong><p>Participation is voluntary. Refusal has no consequence for services, studies or support.</p></div>
        <div><strong>Only access experience is relevant</strong><p>We do not ask for a disability diagnosis or medical details. Describe only the access requirement and this journey experience.</p></div>
        <div><strong>Repair and verification stay separate</strong><p><strong>Repair owner:</strong> {workOrder.ownerRole}. The verifier must be independent from this role.</p></div>
      </div>
      <label className="check-control verification-charter__consent"><input type="checkbox" checked={consented} onChange={event => setConsented(event.target.checked)} /> I freely consent to this bounded journey retest.</label>
    </section>

    <section className="verification-dossier" aria-labelledby="defined-test-title">
      <header className="verification-dossier__heading">
        <p className="worksheet-step">Record 02</p>
        <h2 id="defined-test-title">Evidence and defined test</h2>
        <p>Compare the original condition with the repair record, then describe the independent journey retest precisely enough to repeat it.</p>
      </header>

      <div className="comparison-grid evidence-comparison">
        <div><p className="ledger-label">A · Before repair</p><EvidenceImage evidence={barrier.evidence[0]} /></div>
        <div><p className="ledger-label">B · Repair evidence</p><EvidenceImage evidence={workOrder.repairEvidence[0]} /></div>
      </div>

      <div className="defined-test-fields">
        <label className="field-stack">Verifier role<input value={testerRole} onChange={event => setTesterRole(event.target.value)} /></label>
        <label className="field-stack">Defined journey and test conditions<textarea value={conditions} onChange={event => setConditions(event.target.value)} /></label>
      </div>

      <div className="journey-measure" role="group" aria-labelledby="journey-comparison-title">
        <div className="journey-measure__heading"><p className="ledger-label">Measured journey</p><h3 id="journey-comparison-title">Before / independent retest</h3></div>
        <div className="journey-comparison">
          <label className="field-stack">Recorded journey time before repair (minutes)<input type="number" min={1} max={1440} value={beforeMinutes} onChange={event => setBeforeMinutes(event.target.valueAsNumber)} /></label>
          <span className="journey-comparison__divider" aria-hidden="true">→</span>
          <label className="field-stack">Recorded journey time in this retest (minutes)<input type="number" min={1} max={1440} value={afterMinutes} onChange={event => setAfterMinutes(event.target.valueAsNumber)} /></label>
        </div>
        <label className="check-control"><input type="checkbox" checked={beforeSucceeded} onChange={event => setBeforeSucceeded(event.target.checked)} /> The journey could already be completed before the repair.</label>
      </div>

      <label className="field-stack verification-notes">Retest notes or rework reason<textarea aria-label="Rework reason" value={reason} onChange={event => setReason(event.target.value)} /></label>
    </section>

    {barrier.status === 'awaiting_verification' ? <section className="verification-actions"><p className="worksheet-step">Decision 03</p><h2>Verification decision</h2><p>Acceptance is bounded to this journey, access requirement and recorded test conditions. It is not a universal guarantee or legal certification.</p><div className="action-row"><button className="button-primary" onClick={() => decide('accepted')}>Accept for this journey and test conditions</button><button onClick={() => decide('rejected')}>Send to rework</button><button onClick={() => decide('additional_inspection')}>Request another inspection</button></div></section> : null}
    {barrier.status === 'rework_required' ? <section className="rework-notice"><h2>Rework required</h2><p>Earlier audit and repair evidence remains preserved for traceability.</p></section> : null}
    {barrier.status === 'verified' ? <section><h2>Verified for these bounded conditions</h2><p>This accepted retest is limited to the defined journey and conditions.</p><button className="button-primary" onClick={() => navigate('/impact')}>View traceable impact</button></section> : null}
    <ActivityTimeline events={events}/>
  </div>
}

import { useState, type Dispatch } from 'react'
import { ActivityTimeline } from '../components/ActivityTimeline'
import { ErrorSummary } from '../components/ErrorSummary'
import { EvidenceImage } from '../components/EvidenceImage'
import type { DemoAction } from '../domain/demoReducer'
import type { DemoState } from '../domain/types'
import { validateVerification } from '../domain/validation'

export function VerificationScreen({ state, dispatch, barrierId, navigate }: { state: DemoState; dispatch: Dispatch<DemoAction>; barrierId: string; navigate: (path: string) => void }) {
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
    dispatch({ type: 'APPLY_TRANSITION', command: { type, barrierId, eventId: `event-${type}-${state.verifications.length + 1}`, verificationId: `verification-${state.verifications.length + 1}`, timestamp: '2026-08-15T10:00:00.000Z', actorPerspective: 'verifier', reason: eventReason, consented, testerRole, definedTestConditions: conditions, beforeOutcome, afterOutcome } })
  }

  const events = state.activity.filter(item => item.barrierId === barrierId)
  return <div className="screen-stack verification-screen"><section className="hero-panel"><p className="eyebrow">Independent retest · illustrative demo data</p><h1>User verification</h1><p><strong>{journey.name}</strong> · {journey.accessRequirement}</p><p><strong>Status:</strong> {barrier.status.replaceAll('_', ' ')}</p></section><ErrorSummary errors={errors}/><section className="consent-panel"><h2>Voluntary consent and independence</h2><p>Participation is voluntary. Refusal has no consequence for services, studies or support.</p><p>We do not ask for a disability diagnosis or medical details. Describe only the access requirement and this journey experience.</p><p><strong>Repair owner:</strong> {workOrder.ownerRole}. The verifier must be independent from this role.</p><label className="check-control"><input type="checkbox" checked={consented} onChange={event => setConsented(event.target.checked)} /> I freely consent to this bounded journey retest.</label></section><section><h2>Evidence and defined test</h2><div className="comparison-grid"><div><h3>Before repair</h3><EvidenceImage evidence={barrier.evidence[0]} /></div><div><h3>Repair evidence</h3><EvidenceImage evidence={workOrder.repairEvidence[0]} /></div></div><label className="field-stack">Verifier role<input value={testerRole} onChange={event => setTesterRole(event.target.value)} /></label><label className="field-stack">Defined journey and test conditions<textarea value={conditions} onChange={event => setConditions(event.target.value)} /></label><div className="comparison-grid"><label className="field-stack">Recorded journey time before repair (minutes)<input type="number" min={1} max={1440} value={beforeMinutes} onChange={event => setBeforeMinutes(event.target.valueAsNumber)} /></label><label className="field-stack">Recorded journey time in this retest (minutes)<input type="number" min={1} max={1440} value={afterMinutes} onChange={event => setAfterMinutes(event.target.valueAsNumber)} /></label></div><label className="check-control"><input type="checkbox" checked={beforeSucceeded} onChange={event => setBeforeSucceeded(event.target.checked)} /> The journey could already be completed before the repair.</label><label className="field-stack">Retest notes or rework reason<textarea aria-label="Rework reason" value={reason} onChange={event => setReason(event.target.value)} /></label></section>{barrier.status === 'awaiting_verification' ? <section className="verification-actions"><h2>Verification decision</h2><p>Acceptance is bounded to this journey, access requirement and recorded test conditions. It is not a universal guarantee or legal certification.</p><div className="action-row"><button className="button-primary" onClick={() => decide('accepted')}>Accept for this journey and test conditions</button><button onClick={() => decide('rejected')}>Send to rework</button><button onClick={() => decide('additional_inspection')}>Request another inspection</button></div></section> : null}{barrier.status === 'rework_required' ? <section className="rework-notice"><h2>Rework required</h2><p>Earlier audit and repair evidence remains preserved for traceability.</p></section> : null}{barrier.status === 'verified' ? <section><h2>Verified for these bounded conditions</h2><p>This accepted retest is limited to the defined journey and conditions.</p><button className="button-primary" onClick={() => navigate('/impact')}>View traceable impact</button></section> : null}<ActivityTimeline events={events}/></div>
}

import { MetricCard } from '../components/MetricCard'
import { calculateImpact, calculateAverageDaysFromObservation, type ImpactRecord } from '../domain/calculations'
import type { DemoState } from '../domain/types'
import '../styles/print.css'

function extractSpend(costBand: string): number {
  const match = costBand.match(/(\d+),?(\d{3})?[–-](\d+),?(\d{3})?/)
  if (!match) return 0
  const min = Number(match[1] + (match[2] ?? '')) || 0
  const max = Number(match[3] + (match[4] ?? '')) || 0
  return (min + max) / 2
}

function buildImpactRecords(state: DemoState): ImpactRecord[] {
  return state.verifications.flatMap(verification => {
    const barrier = state.barriers.find(item => item.id === verification.barrierId && item.status === 'verified')
    const workOrder = state.workOrders.find(item => item.id === verification.workOrderId && item.barrierId === barrier?.id)
    const { beforeOutcome, afterOutcome } = verification
    if (verification.decision !== 'accepted' || !barrier || !workOrder?.repairEvidence.length || !beforeOutcome || !afterOutcome) return []
    const repairStart = new Date(workOrder.repairEvidence[0]?.capturedAt || verification.timestamp).getTime()
    const verificationTime = new Date(verification.timestamp).getTime()
    const repairDays = Math.round((verificationTime - repairStart) / (1000 * 60 * 60 * 24))
    return [{
      barrierId: barrier.id,
      workOrderId: workOrder.id,
      verificationId: verification.id,
      status: barrier.status,
      baselineSucceeded: beforeOutcome.succeeded,
      verifiedSucceeded: afterOutcome.succeeded,
      baselineMinutes: beforeOutcome.completionMinutes,
      verifiedMinutes: afterOutcome.completionMinutes,
      repairDays,
      spend: extractSpend(workOrder.costBand),
      observedAt: barrier.observedAt,
      verifiedAt: verification.timestamp,
    }]
  })
}

export function ImpactScreen({ state, navigate }: { state: DemoState; navigate: (path: string) => void }) {
  const records = buildImpactRecords(state)
  const impact = calculateImpact(records)
  const averageDaysFromObservation = calculateAverageDaysFromObservation(records)
  const verified = state.verifications.flatMap(verification => {
    const barrier = state.barriers.find(item => item.id === verification.barrierId && item.status === 'verified')
    const workOrder = state.workOrders.find(item => item.id === verification.workOrderId && item.barrierId === barrier?.id)
    return verification.decision === 'accepted' && barrier && workOrder?.repairEvidence.length ? [{ verification, barrier, workOrder }] : []
  })
  return <div className="screen-stack impact-report"><section className="hero-panel"><p className="eyebrow">Evidence-chain impact report · illustrative demo data</p><h1>Bounded verified outcomes</h1><p>Only repairs with repair evidence and an accepted independent journey retest are included.</p><button className="button-primary no-print" onClick={() => window.print()}>Print evidence summary</button></section><section className="metric-grid"><MetricCard label="Verified repairs" value={impact.verifiedRepairs} detail="Accepted for defined journeys and recorded conditions."/><MetricCard label="Successful journey tests" value={impact.successfulJourneyTests} detail="One bounded successful retest per included repair."/><MetricCard label="Before-repair journey success" value={impact.baselineSuccessRate !== null ? `${Math.round(impact.baselineSuccessRate)}%` : 'N/A'} detail="Share of accepted verifications with successful before-repair journey."/><MetricCard label="After-repair journey success" value={impact.verifiedSuccessRate !== null ? `${Math.round(impact.verifiedSuccessRate)}%` : 'N/A'} detail="Share of accepted verifications with successful after-repair journey."/><MetricCard label="Average time saved" value={impact.averageTimeSavedMinutes !== null ? `${Math.round(impact.averageTimeSavedMinutes)} min` : 'N/A'} detail="Average journey completion time reduction across accepted verifications."/><MetricCard label="Days to verification" value={averageDaysFromObservation !== null ? `${Math.round(averageDaysFromObservation)} days` : 'N/A'} detail="Average time from barrier observation to accepted verification."/><MetricCard label="Pilot spend" value={impact.pilotSpend ? `₹${Math.round(impact.pilotSpend).toLocaleString('en-IN')}` : 'Not available'} detail="Estimated repair costs; meaningful only for this fictional case."/></section><section><h2>Traceable outcomes</h2>{verified.length === 0 ? <p>No accepted verified repairs yet. Awaiting-verification and rework records are excluded.</p> : verified.map(({ barrier, workOrder, verification }) => <article className="trace-record" key={verification.id}><div><p className="eyebrow">Verified repair for this journey and test conditions</p><h3>{barrier.title}</h3><p>{verification.definedTestConditions}</p></div><dl><div><dt>Barrier</dt><dd><a href={`/barriers/${barrier.id}`} onClick={event => { event.preventDefault(); navigate(`/barriers/${barrier.id}`) }}>{barrier.id}</a></dd></div><div><dt>Work order</dt><dd><a href={`/work-orders/${barrier.id}`} onClick={event => { event.preventDefault(); navigate(`/work-orders/${barrier.id}`) }}>{workOrder.id}</a></dd></div><div><dt>Repair evidence</dt><dd>{workOrder.repairEvidence.map(item => item.id).join(', ')}</dd></div><div><dt>Verification</dt><dd>{verification.id}</dd></div><div><dt>Timeline event</dt><dd>{state.activity.find(item => item.barrierId === barrier.id && item.toStatus === 'verified')?.id ?? 'Accepted retest record'}</dd></div></dl></article>)}</section><footer className="print-disclaimer"><strong>Illustrative demo data.</strong> A bounded retest reports one defined journey, access requirement and set of test conditions. It is not universal usability, professional certification or a determination of legal compliance.</footer></div>
}

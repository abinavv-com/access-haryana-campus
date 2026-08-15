import { MetricCard } from '../components/MetricCard'
import { calculateImpact, calculateAverageDaysFromObservation, type ImpactRecord } from '../domain/calculations'
import type { DemoState } from '../domain/types'

function extractSpend(costBand: string): number {
  // Cost bands are free text ('₹10,000–₹25,000 (illustrative)'); take the midpoint of the first two figures.
  const figures = costBand.replaceAll(',', '').match(/\d+/g)?.map(Number) ?? []
  if (!figures.length) return 0
  return (figures[0] + (figures[1] ?? figures[0])) / 2
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

  return <div className="screen-stack impact-report">
    <section className="hero-panel impact-cover">
      <div className="impact-cover__lead">
        <p className="eyebrow">Evidence-chain impact report · illustrative demo data</p>
        <h1>Bounded verified outcomes</h1>
        <p className="impact-cover__standfirst">Only repairs with repair evidence and an accepted independent journey retest are included.</p>
        <button className="button-primary no-print" onClick={() => window.print()}>Print evidence summary</button>
      </div>
      <aside className="impact-cover__scope" aria-label="Report scope">
        <p className="ledger-label">Inclusion rule</p>
        <strong>Verified records only</strong>
        <p>Awaiting-verification, rejected, rework and missing-outcome records do not contribute to the measures below.</p>
        <p className="impact-cover__count"><span>{records.length}</span> qualifying {records.length === 1 ? 'record' : 'records'}</p>
      </aside>
    </section>

    <section className="metric-composition" aria-labelledby="impact-measures-title">
      <header className="metric-composition__heading"><p className="worksheet-step">Measured change</p><h2 id="impact-measures-title">What the bounded retests show</h2><p>Each measure is calculated from the same qualifying evidence chain.</p></header>
      <div className="metric-grid">
        <MetricCard label="Verified repairs" value={impact.verifiedRepairs} detail="Accepted for defined journeys and recorded conditions."/>
        <MetricCard label="Successful journey tests" value={impact.successfulJourneyTests} detail="One bounded successful retest per included repair."/>
        <MetricCard label="Before-repair journey success" value={impact.baselineSuccessRate !== null ? `${Math.round(impact.baselineSuccessRate)}%` : 'N/A'} detail="Share of accepted verifications with successful before-repair journey."/>
        <MetricCard label="After-repair journey success" value={impact.verifiedSuccessRate !== null ? `${Math.round(impact.verifiedSuccessRate)}%` : 'N/A'} detail="Share of accepted verifications with successful after-repair journey."/>
        <MetricCard label="Average time saved" value={impact.averageTimeSavedMinutes !== null ? `${Math.round(impact.averageTimeSavedMinutes)} min` : 'N/A'} detail="Average journey completion time reduction across accepted verifications."/>
        <MetricCard label="Days to verification" value={averageDaysFromObservation !== null ? `${Math.round(averageDaysFromObservation)} days` : 'N/A'} detail="Average time from barrier observation to accepted verification."/>
        <MetricCard label="Pilot spend" value={impact.pilotSpend ? `₹${Math.round(impact.pilotSpend).toLocaleString('en-IN')}` : 'Not available'} detail="Estimated repair costs; meaningful only for this fictional case."/>
      </div>
    </section>

    <section className="source-ledger" aria-labelledby="source-ledger-title">
      <header className="source-ledger__heading"><p className="worksheet-step">Source ledger</p><h2 id="source-ledger-title">Traceable outcomes</h2><p>Every reported outcome resolves back through the barrier, repair instruction, evidence, independent verification and recorded transition.</p></header>
      {verified.length === 0 ? <p className="source-ledger__empty">No accepted verified repairs yet. Awaiting-verification and rework records are excluded.</p> : verified.map(({ barrier, workOrder, verification }, index) => <article className="trace-record" key={verification.id}>
        <div className="trace-record__summary"><p className="trace-record__number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</p><p className="eyebrow">Verified repair for this journey and test conditions</p><h3>{barrier.title}</h3><p>{verification.definedTestConditions}</p></div>
        <dl>
          <div><dt>Barrier</dt><dd><a href={`/barriers/${barrier.id}`} onClick={event => { event.preventDefault(); navigate(`/barriers/${barrier.id}`) }}>{barrier.id}</a></dd></div>
          <div><dt>Work order</dt><dd><a href={`/work-orders/${barrier.id}`} onClick={event => { event.preventDefault(); navigate(`/work-orders/${barrier.id}`) }}>{workOrder.id}</a></dd></div>
          <div><dt>Repair evidence</dt><dd>{workOrder.repairEvidence.map(item => item.id).join(', ')}</dd></div>
          <div><dt>Verification</dt><dd>{verification.id}</dd></div>
          <div><dt>Timeline event</dt><dd>{state.activity.find(item => item.barrierId === barrier.id && item.toStatus === 'verified')?.id ?? 'Accepted retest record'}</dd></div>
        </dl>
      </article>)}
    </section>

    <footer className="print-disclaimer"><strong>Illustrative demo data.</strong> A bounded retest reports one defined journey, access requirement and set of test conditions. It is not universal usability, professional certification or a determination of legal compliance.</footer>
  </div>
}

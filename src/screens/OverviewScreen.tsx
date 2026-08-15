import { useState } from 'react'
import { StatusBadge } from '../components/StatusBadge'
import type { BarrierStatus, DemoState, Severity } from '../domain/types'

export function OverviewScreen({ state, onStartAudit }: { state: DemoState; onStartAudit: () => void }) {
  const [status, setStatus] = useState<BarrierStatus | 'all'>('all')
  const [severity, setSeverity] = useState<Severity | 'all'>('all')
  const visible = state.barriers.filter(
    finding => (status === 'all' || finding.status === status) && (severity === 'all' || finding.severity === severity),
  )
  const journey = state.journeys[0]
  const evidenceCount = state.barriers.reduce((count, finding) => count + finding.evidence.length, 0)

  return <div className="screen-stack overview-screen">
    <section className="overview-ledger">
      <div className="overview-ledger__lead">
        <p className="eyebrow">Campus command centre · Illustrative demo data</p>
        <h1>Saraswati campus access pulse</h1>
        <p className="overview-ledger__standfirst">Maps and findings are outputs. Repairs become outcomes after evidence and an independent bounded retest.</p>
        <div className="journey-context">
          <p className="ledger-label">Defined journey</p>
          <h2>{journey.name}</h2>
          <dl>
            <div><dt>From</dt><dd>{journey.origin}</dd></div>
            <div><dt>To</dt><dd>{journey.destination}</dd></div>
            <div><dt>Test need</dt><dd>{journey.accessRequirement}</dd></div>
          </dl>
        </div>
        <button className="button-primary" onClick={onStartAudit}>Continue guided audit</button>
      </div>

      <aside className="evidence-index" aria-label="Evidence index">
        <p className="ledger-label">Evidence index</p>
        <dl>
          <div><dt>Screening findings</dt><dd>{state.barriers.length}</dd></div>
          <div><dt>Illustrative records</dt><dd>{evidenceCount}</dd></div>
          <div><dt>Journey checkpoints</dt><dd>{journey.checkpoints.length}</dd></div>
        </dl>
        <p><strong>{state.barriers.length} screening findings</strong></p>
        <p className="data-qualification">Illustrative demo data · not a compliance assessment</p>
      </aside>
    </section>

    <section className="finding-register">
      <div className="register-heading">
        <div>
          <p className="ledger-label">Screening register</p>
          <h2>Barrier records</h2>
        </div>
        <div className="filters">
          <label>Status
            <select value={status} onChange={event => setStatus(event.target.value as BarrierStatus | 'all')}>
              <option value="all">All statuses</option>
              <option value="observed">Observed</option>
              <option value="verified">Verified</option>
            </select>
          </label>
          <label>Severity
            <select value={severity} onChange={event => setSeverity(event.target.value as Severity | 'all')}>
              <option value="all">All severities</option>
              <option value="high">High</option>
              <option value="moderate">Moderate</option>
            </select>
          </label>
        </div>
      </div>

      {visible.length
        ? <ol className="finding-list">
          {visible.map(finding => <li key={finding.id}>
            <article>
              <div className="finding-record__body">
                <small>{finding.severity} severity</small>
                <h3>{finding.title}</h3>
                <p>{finding.campusZone} · {finding.description}</p>
              </div>
              <StatusBadge tone={finding.status === 'verified' ? 'success' : finding.status === 'rework_required' ? 'danger' : 'info'}>
                {finding.status.replace('_', ' ')}
              </StatusBadge>
            </article>
          </li>)}
        </ol>
        : <div className="empty-state" role="status">
          <h3>No findings match these filters</h3>
          <button onClick={() => { setStatus('all'); setSeverity('all') }}>Clear filters</button>
        </div>}
    </section>
  </div>
}

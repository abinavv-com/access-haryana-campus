import type { BarrierStatus } from '../domain/types'
import { StatusBadge } from './StatusBadge'

const stages = [
  { key: 'observed', label: 'Observed', actor: 'Auditor' },
  { key: 'validated', label: 'Validated', actor: 'Designated reviewer' },
  { key: 'prioritised', label: 'Prioritised', actor: 'Facilities' },
  { key: 'assigned', label: 'Assigned', actor: 'Facilities' },
  { key: 'awaiting_verification', label: 'Fixed / awaiting verification', actor: 'Repair owner' },
  { key: 'verified', label: 'User verified', actor: 'Independent verifier' },
] as const

export const statusIndex: Record<BarrierStatus, number> = {
  observed: 0,
  validated: 1,
  prioritised: 2,
  assigned: 3,
  rework_required: 3,
  awaiting_verification: 4,
  verified: 5,
}

export function LifecycleRail({ status }: { status: BarrierStatus }) {
  const currentIndex = statusIndex[status]

  return <nav className="case-progress lifecycle" aria-label="Case progress">
    <div className="case-progress__heading">
      <p className="eyebrow">Evidence chain</p>
      <h2>Case progress</h2>
    </div>
    <div className="case-progress__track">
      <ol>{stages.map((stage, index) => {
        const state = index < currentIndex ? 'Complete' : index === currentIndex ? 'Current' : 'Upcoming'
        return <li key={stage.key} data-state={state.toLowerCase()}>
          <a href={`#stage-${stage.key}`} aria-current={index === currentIndex ? 'step' : undefined}>
            <span className="stage-number" aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
            <span><strong>{stage.label}</strong><small>{stage.actor}</small></span>
            <StatusBadge tone={state === 'Complete' ? 'success' : state === 'Current' ? 'info' : 'neutral'}>{state}</StatusBadge>
          </a>
          {status === 'rework_required' && index === 3 ? <StatusBadge tone="danger">Action required</StatusBadge> : null}
        </li>
      })}</ol>
    </div>
    <span className="case-progress__cue" aria-hidden="true">Continue →</span>
  </nav>
}

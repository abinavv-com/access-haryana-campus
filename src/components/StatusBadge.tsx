import type { ReactNode } from 'react'

export function StatusBadge({ tone = 'neutral', children }: { tone?: 'neutral' | 'info' | 'success' | 'danger'; children: ReactNode }) {
  return <span className={`record-status status-badge status-badge--${tone}`}><span className="record-status__label">{children}</span></span>
}

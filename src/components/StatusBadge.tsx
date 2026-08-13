import type { ReactNode } from 'react'
export function StatusBadge({ tone = 'neutral', children }: { tone?: 'neutral' | 'info' | 'success' | 'danger'; children: ReactNode }) { return <span className={`status-badge status-badge--${tone}`}>{children}</span> }

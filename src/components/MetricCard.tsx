import type { ReactNode } from 'react'

export function MetricCard({ label, value, detail }: { label: string; value: ReactNode; detail: string }) {
  return <article className="metric-card"><p className="eyebrow">{label}</p><strong className="metric-value">{value}</strong><p>{detail}</p><small>Illustrative demo data</small></article>
}

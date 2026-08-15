import { useState } from 'react'
import type { EvidenceItem } from '../domain/types'

export function EvidenceImage({ evidence }: { evidence: EvidenceItem }) {
  const [failed, setFailed] = useState(false)
  const captured = new Date(evidence.capturedAt)
  const capturedLabel = Number.isNaN(captured.getTime()) ? null : captured.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  return <figure className="evidence-plate evidence-card">
    {failed
      ? <div role="img" aria-label={evidence.altText}>Illustrative evidence unavailable</div>
      : <img src={evidence.path} alt={evidence.altText} onError={() => setFailed(true)} />}
    <figcaption>
      <strong>Illustrative demo evidence</strong>
      <span>{evidence.altText}</span>
      {capturedLabel ? <span className="provenance"><span className="provenance-label">Recorded</span> <time dateTime={evidence.capturedAt}>{capturedLabel}</time> <span aria-hidden="true">·</span> <span>{evidence.id}</span></span> : null}
    </figcaption>
  </figure>
}

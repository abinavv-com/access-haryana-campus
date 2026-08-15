import { useState, type Dispatch, type FormEvent } from 'react'
import { ErrorSummary } from '../components/ErrorSummary'
import { EvidenceImage } from '../components/EvidenceImage'
import type { DemoAction } from '../domain/demoReducer'
import { illustrativeDataLabel, type DemoState } from '../domain/types'
import { validateAudit, type AuditMeasurement } from '../domain/validation'

export function AuditScreen({ state, dispatch, navigate }: { state: DemoState; dispatch: Dispatch<DemoAction>; navigate: (path: string) => void }) {
  const journey = state.journeys[0]
  const evidence = state.barriers[0].evidence[0]
  const [selected, setSelected] = useState(true)
  const [measurement, setMeasurement] = useState<'measured' | 'unable'>('measured')
  const [unableReason, setUnableReason] = useState('')
  const [errors, setErrors] = useState<string[]>([])

  function submit(event: FormEvent) {
    event.preventDefault()
    const auditMeasurement: AuditMeasurement = measurement === 'unable'
      ? { outcome: 'unable', reason: unableReason }
      : { outcome: 'clear_width', widthMm: 860, implausibleConfirmed: false }
    const nextErrors = validateAudit({ evidenceIds: selected ? [evidence.id] : [], measurement: auditMeasurement })
    setErrors(nextErrors)
    if (nextErrors.length) return

    const id = 'audit-obstruction-2026'
    const detail = measurement === 'unable' ? `Unable to measure safely: ${unableReason.trim()}` : 'Clear width screened at 860 mm.'
    dispatch({
      type: 'SUBMIT_AUDIT',
      barrier: {
        id,
        journeyId: journey.id,
        dataLabel: illustrativeDataLabel,
        category: 'obstructed_landing',
        title: 'Approach landing requires designated review',
        description: `${detail} Designated follow-up is required.`,
        campusZone: 'Admissions approach zone',
        severity: 'high',
        status: 'observed',
        observedAt: '2026-08-13T10:00:00.000Z',
        evidence: [evidence],
        guidelineReference: {
          source: 'Accessibility Guidelines and Standards for Higher Education Institutions and Universities',
          editionYear: 2024,
          section: '6.2',
          checkType: 'screening',
        },
      },
      event: {
        id: 'event-audit-observation-2026',
        barrierId: id,
        dataLabel: illustrativeDataLabel,
        actorPerspective: 'auditor',
        fromStatus: null,
        toStatus: 'observed',
        reason: `Guided field screening submitted for designated review. ${detail}`,
        timestamp: '2026-08-13T10:00:00.000Z',
      },
    })
    navigate(`/barriers/${id}`)
  }

  return <form className="screen-stack audit-worksheet" onSubmit={submit} noValidate>
    <section className="audit-worksheet__lead">
      <p className="eyebrow">Guided field audit · Step 1 of 1</p>
      <h1>Main gate → Admissions</h1>
      <p className="audit-worksheet__standfirst">This standards-aligned screening is not a compliance determination.</p>
      <dl className="journey-strip">
        <div><dt>Origin</dt><dd>{journey.origin}</dd></div>
        <div><dt>Destination</dt><dd>{journey.destination}</dd></div>
        <div><dt>Screening need</dt><dd>{journey.accessRequirement}</dd></div>
      </dl>
    </section>

    <ErrorSummary errors={errors} />

    <div className="audit-worksheet__body">
      <section className="worksheet-section worksheet-evidence" aria-labelledby="audit-evidence-heading">
        <p className="worksheet-step">01 · Evidence</p>
        <h2 id="audit-evidence-heading">Review the approach record</h2>
        <EvidenceImage evidence={evidence} />
        <label className="check-control worksheet-evidence__select">
          <input type="checkbox" checked={selected} onChange={event => setSelected(event.target.checked)} />
          Select illustrative obstruction photo
        </label>
      </section>

      <section className="worksheet-section worksheet-measurement" aria-labelledby="audit-measurement-heading">
        <p className="worksheet-step">02 · Measurement</p>
        <h2 id="audit-measurement-heading">Can the approach landing be used without an obstruction?</h2>
        <fieldset>
          <legend>Measurement outcome</legend>
          <label><input type="radio" name="measurement" checked={measurement === 'measured'} onChange={() => setMeasurement('measured')} /> Measured: clear width 860 mm</label>
          <label><input type="radio" name="measurement" checked={measurement === 'unable'} onChange={() => setMeasurement('unable')} /> Unable to measure safely</label>
          {measurement === 'unable'
            ? <label className="field-stack">Why could the measurement not be taken?<textarea value={unableReason} onChange={event => setUnableReason(event.target.value)} required /></label>
            : null}
        </fieldset>
      </section>

      <section className="worksheet-section worksheet-provenance" aria-labelledby="audit-provenance-heading">
        <p className="worksheet-step">03 · Provenance</p>
        <h2 id="audit-provenance-heading">Screening basis and handling</h2>
        <div className="standard-note">
          <strong>Accessibility Guidelines and Standards for Higher Education Institutions and Universities</strong>
          <span>2024 · Section 6.2 · Screening check</span>
        </div>
        <p className="privacy-note"><strong>Fictional demo:</strong> avoid identifiable people or personal data in supporting evidence.</p>
      </section>
    </div>

    <div className="worksheet-action">
      <div>
        <p className="worksheet-step">04 · Submit</p>
        <span>Creates an Observed record; designated review is required.</span>
      </div>
      <button className="button-primary">Submit screening finding</button>
    </div>
  </form>
}

import { useState, type Dispatch, type FormEvent } from 'react'
import { ErrorSummary } from '../components/ErrorSummary'
import { EvidenceImage } from '../components/EvidenceImage'
import type { DemoAction } from '../domain/demoReducer'
import { illustrativeDataLabel, type DemoState } from '../domain/types'
import { validateAudit, type AuditMeasurement } from '../domain/validation'

export function AuditScreen({state,dispatch,navigate}:{state:DemoState;dispatch:Dispatch<DemoAction>;navigate:(path:string)=>void}) {
  const evidence=state.barriers[0].evidence[0]
  const [selected,setSelected]=useState(true),[measurement,setMeasurement]=useState<'measured'|'unable'>('measured'),[unableReason,setUnableReason]=useState(''),[errors,setErrors]=useState<string[]>([])
  function submit(event:FormEvent) {
    event.preventDefault()
    const auditMeasurement:AuditMeasurement=measurement==='unable'?{outcome:'unable',reason:unableReason}:{outcome:'clear_width',widthMm:860,implausibleConfirmed:false}
    const nextErrors=validateAudit({evidenceIds:selected?[evidence.id]:[],measurement:auditMeasurement});setErrors(nextErrors);if(nextErrors.length)return
    const id='audit-obstruction-2026',detail=measurement==='unable'?`Unable to measure safely: ${unableReason.trim()}`:'Clear width screened at 860 mm.'
    dispatch({type:'SUBMIT_AUDIT',barrier:{id,journeyId:state.journeys[0].id,dataLabel:illustrativeDataLabel,category:'obstructed_landing',title:'Approach landing requires designated review',description:`${detail} Designated follow-up is required.`,campusZone:'Admissions approach zone',severity:'high',status:'observed',observedAt:'2026-08-13T10:00:00.000Z',evidence:[evidence],guidelineReference:{source:'Accessibility Guidelines and Standards for Higher Education Institutions and Universities',editionYear:2024,section:'6.2',checkType:'screening'}},event:{id:'event-audit-observation-2026',barrierId:id,dataLabel:illustrativeDataLabel,actorPerspective:'auditor',fromStatus:null,toStatus:'observed',reason:`Guided field screening submitted for designated review. ${detail}`,timestamp:'2026-08-13T10:00:00.000Z'}})
    navigate(`/barriers/${id}`)
  }
  return <form className="screen-stack" onSubmit={submit} noValidate><section className="hero-panel"><p className="eyebrow">Guided field audit · Step 1 of 1</p><h1>Main gate → Admissions</h1><p>This standards-aligned screening is not a compliance determination.</p><p className="privacy-note"><strong>Fictional demo:</strong> avoid identifiable people or personal data in supporting evidence.</p></section><ErrorSummary errors={errors}/><section className="audit-grid"><div><h2>Can the approach landing be used without an obstruction?</h2><div className="standard-note"><strong>Accessibility Guidelines and Standards for Higher Education Institutions and Universities</strong><span>2024 · Section 6.2 · Screening check</span></div><fieldset><legend>Measurement outcome</legend><label><input type="radio" name="measurement" checked={measurement==='measured'} onChange={()=>setMeasurement('measured')}/> Measured: clear width 860 mm</label><label><input type="radio" name="measurement" checked={measurement==='unable'} onChange={()=>setMeasurement('unable')}/> Unable to measure safely</label>{measurement==='unable'?<label className="field-stack">Why could the measurement not be taken?<textarea value={unableReason} onChange={event=>setUnableReason(event.target.value)} required/></label>:null}</fieldset></div><aside><EvidenceImage evidence={evidence}/><label><input type="checkbox" checked={selected} onChange={event=>setSelected(event.target.checked)}/> Select illustrative obstruction photo</label></aside></section><div className="submit-bar"><span>Creates an Observed record; designated review is required.</span><button className="button-primary">Submit screening finding</button></div></form>
}

import { useEffect, useRef } from 'react'
export function ErrorSummary({ errors }: { errors: string[] }) { const ref=useRef<HTMLDivElement>(null);useEffect(()=>{if(errors.length)ref.current?.focus()},[errors]);return errors.length?<div className="error-summary" role="alert" tabIndex={-1} ref={ref}><h2>Check the audit</h2><ul>{errors.map(e=><li key={e}>{e}</li>)}</ul></div>:null }

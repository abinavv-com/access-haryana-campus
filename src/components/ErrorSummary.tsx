import { useEffect, useId, useRef } from 'react'

export function ErrorSummary({ errors }: { errors: string[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const headingId = useId()
  const messagesId = useId()

  useEffect(() => {
    if (errors.length) ref.current?.focus()
  }, [errors])

  return errors.length ? <div className="error-brief error-summary" role="alert" tabIndex={-1} ref={ref} aria-labelledby={headingId} aria-describedby={messagesId}>
    <h2 id={headingId}>Check the audit</h2>
    <ul id={messagesId}>{errors.map(error => <li key={error}>{error}</li>)}</ul>
  </div> : null
}

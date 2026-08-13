import { useEffect, useRef, useState, type Dispatch, type KeyboardEvent, type ReactNode } from 'react'
import type { DemoAction } from '../domain/demoReducer'
import type { BarrierStatus, DemoState } from '../domain/types'
import { LifecycleRail } from './LifecycleRail'

export type SimulatedRole = 'auditor' | 'facilities' | 'verifier'

const roleTasks: Record<SimulatedRole, string> = {
  auditor: 'Record and submit the screening finding.',
  facilities: 'Review priority and prepare assignment.',
  verifier: 'Independently retest the defined journey.',
}

interface Props {
  state: DemoState; dispatch: Dispatch<DemoAction>; role: SimulatedRole
  onRoleChange: (role: SimulatedRole) => void
  reducedMotion: boolean; onReducedMotionChange: (enabled: boolean) => void
  largeText: boolean; onLargeTextChange: (enabled: boolean) => void
  highContrast: boolean; onHighContrastChange: (enabled: boolean) => void
  children: ReactNode
}

export function AppShell(props: Props) {
  const { state, dispatch, role, onRoleChange, reducedMotion, onReducedMotionChange, largeText, onLargeTextChange, highContrast, onHighContrastChange, children } = props
  const [confirming, setConfirming] = useState(false)
  const resetTriggerRef = useRef<HTMLButtonElement>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)
  const confirmRef = useRef<HTMLButtonElement>(null)
  const hasOpenedDialog = useRef(false)
  const routeBarrierId = window.location.pathname.match(/^\/(?:barriers|work-orders|verification)\/([^/]+)$/)?.[1]
  const primaryStatus: BarrierStatus = state.barriers.find(barrier => barrier.id === routeBarrierId)?.status ?? state.barriers[0]?.status ?? 'observed'

  useEffect(() => {
    if (confirming) {
      hasOpenedDialog.current = true
      cancelRef.current?.focus()
    } else if (hasOpenedDialog.current) {
      resetTriggerRef.current?.focus()
    }
  }, [confirming])

  function handleDialogKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (event.key === 'Escape') {
      event.preventDefault()
      setConfirming(false)
      return
    }
    if (event.key !== 'Tab') return
    if (event.shiftKey && document.activeElement === cancelRef.current) {
      event.preventDefault()
      confirmRef.current?.focus()
    } else if (!event.shiftKey && document.activeElement === confirmRef.current) {
      event.preventDefault()
      cancelRef.current?.focus()
    }
  }

  return <>
    <a className="skip-link" href="#main-content">Skip to main content</a>
    <div className="demo-banner" role="note">Demo mode — fictional records and illustrative images.</div>
    <header className="app-header">
      <div className="identity"><strong>Access Haryana Campus</strong><span>Haryana Ideathon 2026 demo</span></div>
      <nav aria-label="Primary"><a href="/">Overview</a><a href="/audit">Guided audit</a><a href="/barriers">Barrier record</a><a href="/work-order">Work order</a><a href="/verification">Verification</a><a href="/impact">Impact report</a></nav>
      <div className="header-actions">
        <label>Simulated role<select aria-label="Simulated role" value={role} onChange={event => onRoleChange(event.target.value as SimulatedRole)}><option value="auditor">Auditor</option><option value="facilities">Facilities</option><option value="verifier">Verifier</option></select></label>
        <button type="button" aria-pressed={largeText} onClick={() => onLargeTextChange(!largeText)}>Increase text size</button>
        <label className="check-control"><input type="checkbox" checked={highContrast} onChange={event => onHighContrastChange(event.target.checked)} /> High contrast</label>
        <label className="check-control"><input type="checkbox" checked={reducedMotion} onChange={event => onReducedMotionChange(event.target.checked)} /> Reduce motion</label>
        <button ref={resetTriggerRef} type="button" className="button-secondary" onClick={() => setConfirming(true)}>Reset demo</button>
      </div>
    </header>
    <div className="perspective" role="status"><strong>Current perspective: {role}</strong><span>{roleTasks[role]}</span><small>Role selection simulates perspective; it is not authentication.</small></div>
    <div className="app-layout"><LifecycleRail status={primaryStatus} /><main id="main-content" tabIndex={-1}>{children}</main></div>
    {confirming ? <div className="dialog-backdrop"><section role="dialog" aria-modal="true" aria-labelledby="reset-title" onKeyDown={handleDialogKeyDown}><h2 id="reset-title">Reset fictional demo records?</h2><p>This restores the seeded case. Accessibility preferences are kept.</p><div className="dialog-actions"><button ref={cancelRef} type="button" onClick={() => setConfirming(false)}>Cancel</button><button ref={confirmRef} type="button" className="button-primary" onClick={() => { dispatch({ type: 'RESET_DEMO' }); setConfirming(false) }}>Confirm reset</button></div></section></div> : null}
  </>
}

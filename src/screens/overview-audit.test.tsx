import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useReducer } from 'react'
import { describe, expect, test, vi } from 'vitest'
import { createDemoFixture } from '../data/demo-fixture.v1'
import { demoReducer } from '../domain/demoReducer'
import { OverviewScreen } from './OverviewScreen'
import { AuditScreen } from './AuditScreen'

describe('overview', () => {
  test('uses the editorial overview ledger composition', () => {
    render(<OverviewScreen state={createDemoFixture()} onStartAudit={() => undefined} />)

    expect(screen.getByRole('heading', { level: 1 }).closest('section')).toHaveClass('overview-ledger')
  })

  test('uses the semantic finding register composition', () => {
    render(<OverviewScreen state={createDemoFixture()} onStartAudit={() => undefined} />)

    expect(screen.getByRole('heading', { level: 2, name: /barrier records/i }).closest('section')).toHaveClass('finding-register')
  })

  test('links every visible finding title to its exact barrier route', () => {
    render(<OverviewScreen state={createDemoFixture()} onStartAudit={() => undefined} />)

    const routes = [
      ['Landing narrowed by stored materials', '/barriers/barrier-obstructed-landing'],
      ['Ramp gradient requires measurement review', '/barriers/barrier-ramp-gradient'],
      ['Admissions direction is not signed', '/barriers/barrier-directional-signage'],
    ] as const
    for (const [title, href] of routes) {
      expect(screen.getByRole('link', { name: title })).toHaveAttribute('href', href)
    }
  })

  test('renders an accessible recovery state when journey context is unavailable', () => {
    const state = createDemoFixture()
    state.journeys = []

    render(<OverviewScreen state={state} onStartAudit={() => undefined} />)

    expect(screen.getByRole('status')).toHaveTextContent(/journey context is unavailable/i)
  })

  test('filters fictional barrier metrics by lifecycle status and severity', async () => {
    const user = userEvent.setup()
    render(<OverviewScreen state={createDemoFixture()} onStartAudit={() => undefined} />)

    expect(screen.getByText(/3 screening findings/i)).toBeInTheDocument()
    expect(screen.getAllByText(/illustrative demo data/i).length).toBeGreaterThan(0)
    await user.selectOptions(screen.getByRole('combobox', { name: /status/i }), 'verified')
    expect(screen.getByRole('status')).toHaveTextContent(/no findings match/i)
    await user.click(screen.getByRole('button', { name: /clear filters/i }))
    await user.selectOptions(screen.getByRole('combobox', { name: /severity/i }), 'high')
    expect(screen.getByText('Landing narrowed by stored materials')).toBeInTheDocument()
    expect(screen.queryByText('Admissions direction is not signed')).not.toBeInTheDocument()
  })
})

describe('guided audit', () => {
  function Harness({ navigate = vi.fn() }: { navigate?: (path: string) => void }) {
    const [state, dispatch] = useReducer(demoReducer, undefined, createDemoFixture)
    return <><AuditScreen state={state} dispatch={dispatch} navigate={navigate} /><output data-testid="count">{state.barriers.length}</output></>
  }

  test('uses the field worksheet composition', () => {
    render(<Harness />)

    expect(screen.getByRole('heading', { level: 1, name: /main gate/i }).closest('form')).toHaveClass('audit-worksheet')
  })

  test('shows exact provenance and qualified illustrative evidence', () => {
    render(<Harness />)
    expect(screen.getByText(/Accessibility Guidelines and Standards for Higher Education Institutions and Universities/i)).toBeInTheDocument()
    expect(screen.getByText(/2024 · section 6\.2 · screening check/i)).toBeInTheDocument()
    const evidence = screen.getByRole('img', { name: /illustrative example of tactile paving obstructed/i })
    expect(evidence).toBeInTheDocument()
    expect(evidence.closest('figure')).toHaveClass('evidence-plate')
    expect(screen.getByText(/not a compliance determination/i)).toBeInTheDocument()
    expect(screen.getByText(/avoid identifiable people or personal data/i).closest('p')).toHaveTextContent(/fictional demo/i)
  })

  test('focuses an error summary when required evidence is deselected', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.click(screen.getByRole('checkbox', { name: /select illustrative obstruction photo/i }))
    await user.click(screen.getByRole('button', { name: /submit screening finding/i }))
    const errorBrief = screen.getByRole('alert')
    expect(errorBrief).toHaveFocus()
    expect(errorBrief).toHaveClass('error-brief')
    expect(errorBrief).toHaveTextContent(/supporting evidence is required/i)
  })

  test('requires a reason when unable to measure and preserves it in the record and event', async () => {
    const navigate = vi.fn()
    const user = userEvent.setup()
    function InspectableHarness() { const [state,dispatch]=useReducer(demoReducer,undefined,createDemoFixture); return <><AuditScreen state={state} dispatch={dispatch} navigate={navigate}/><output data-testid="record">{state.barriers.at(-1)?.description}</output><output data-testid="event">{state.activity.at(-1)?.reason}</output></> }
    render(<InspectableHarness />)
    await user.click(screen.getByRole('radio', { name: /unable to measure/i }))
    const reason=screen.getByRole('textbox',{name:/why could the measurement not be taken/i})
    screen.getByRole('button', { name: /submit screening finding/i }).focus()
    await user.keyboard('{Enter}')
    expect(screen.getByRole('alert')).toHaveTextContent(/explain why the measurement could not be taken/i)
    expect(navigate).not.toHaveBeenCalled()
    await user.type(reason,'Stored materials blocked safe access to the landing edge.')
    screen.getByRole('button', { name: /submit screening finding/i }).focus()
    await user.keyboard('{Enter}')
    expect(screen.getByTestId('record')).toHaveTextContent(/stored materials blocked safe access/i)
    expect(screen.getByTestId('event')).toHaveTextContent(/stored materials blocked safe access/i)
    expect(navigate).toHaveBeenCalledWith('/barriers/audit-obstruction-2026')
  })

  test('submits only the displayed clear-width measurement provenance', async () => {
    const user=userEvent.setup();const navigate=vi.fn()
    function InspectableHarness(){const[state,dispatch]=useReducer(demoReducer,undefined,createDemoFixture);return <><AuditScreen state={state} dispatch={dispatch} navigate={navigate}/><output data-testid="record">{state.barriers.at(-1)?.description}</output><output data-testid="event">{state.activity.at(-1)?.reason}</output></>}
    render(<InspectableHarness/>);await user.click(screen.getByRole('button',{name:/submit screening finding/i}))
    expect(screen.getByTestId('record')).toHaveTextContent(/clear width screened at 860 mm/i)
    expect(screen.getByTestId('event')).toHaveTextContent(/clear width screened at 860 mm/i)
    expect(screen.getByTestId('record')).not.toHaveTextContent(/rise|run|75 mm/i)
  })
})

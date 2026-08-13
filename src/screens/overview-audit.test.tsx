import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useReducer } from 'react'
import { describe, expect, test, vi } from 'vitest'
import { createDemoFixture } from '../data/demo-fixture.v1'
import { demoReducer } from '../domain/demoReducer'
import { OverviewScreen } from './OverviewScreen'
import { AuditScreen } from './AuditScreen'

describe('overview', () => {
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

  test('shows exact provenance and qualified illustrative evidence', () => {
    render(<Harness />)
    expect(screen.getByText(/Accessibility Guidelines and Standards for Higher Education Institutions and Universities/i)).toBeInTheDocument()
    expect(screen.getByText(/2024 · section 6\.2 · screening check/i)).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /illustrative example of tactile paving obstructed/i })).toBeInTheDocument()
    expect(screen.getByText(/not a compliance determination/i)).toBeInTheDocument()
  })

  test('focuses an error summary when required evidence is deselected', async () => {
    const user = userEvent.setup()
    render(<Harness />)
    await user.click(screen.getByRole('checkbox', { name: /select illustrative obstruction photo/i }))
    await user.click(screen.getByRole('button', { name: /submit screening finding/i }))
    expect(screen.getByRole('alert')).toHaveFocus()
    expect(screen.getByRole('alert')).toHaveTextContent(/select at least one supporting evidence photo/i)
  })

  test('accepts unable to measure and submits by keyboard through the reducer', async () => {
    const navigate = vi.fn()
    const user = userEvent.setup()
    render(<Harness navigate={navigate} />)
    await user.click(screen.getByRole('radio', { name: /unable to measure/i }))
    await user.tab()
    screen.getByRole('button', { name: /submit screening finding/i }).focus()
    await user.keyboard('{Enter}')
    expect(screen.getByTestId('count')).toHaveTextContent('4')
    expect(navigate).toHaveBeenCalledWith('/barriers/audit-obstruction-2026')
  })
})

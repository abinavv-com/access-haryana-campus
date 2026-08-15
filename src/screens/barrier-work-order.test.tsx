import { useReducer } from 'react'
import { fireEvent, render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import { createDemoFixture, fixtureIds } from '../data/demo-fixture.v1'
import { demoReducer } from '../domain/demoReducer'
import { BarrierScreen } from './BarrierScreen'
import { WorkOrderScreen } from './WorkOrderScreen'

function BarrierHarness() {
  const [state, dispatch] = useReducer(demoReducer, createDemoFixture())
  return <BarrierScreen state={state} dispatch={dispatch} barrierId={fixtureIds.primaryBarrier} navigate={() => undefined} />
}

test('presents the barrier record as a case file', () => {
  render(<BarrierHarness />)
  expect(screen.getByRole('heading', { name: /landing narrowed by stored materials/i }).closest('article')).toHaveClass('case-file')
})

test('presents the priority calculation as a decision annotation', () => {
  render(<BarrierHarness />)
  expect(screen.getByText(/score .*severity.*essential service.*alternative route.*affected journey.*urgency/i).closest('section')).toHaveClass('decision-annotation')
})

test('records designated reviewer provenance, hazard control and an immutable validation timeline', async () => {
  const user = userEvent.setup()
  render(<BarrierHarness />)
  expect(screen.getByText(/screening finding.*not a compliance determination/i)).toBeInTheDocument()
  expect(screen.getByText(/no safe, signed, available and comparably dignified alternative/i)).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: /record interim control/i }))
  expect(screen.getByText(/temporary signed assistance route/i)).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: /validate screening/i }))
  expect(screen.getByText(/designated accessibility reviewer/i)).toBeInTheDocument()
  expect(screen.getByText(/reviewed the screening evidence/i)).toBeInTheDocument()
})

test('uses a selected priority override band and persists its rationale', async () => {
  const user = userEvent.setup()
  render(<BarrierHarness />)
  await user.click(screen.getByRole('button', { name: /prioritise before validation/i }))
  expect(screen.getByRole('alert')).toHaveTextContent(/not allowed from observed/i)
  await user.click(screen.getByRole('button', { name: /validate screening/i }))
  expect(screen.getByText(/severity.*essential service.*alternative route.*affected journey.*urgency/i)).toBeInTheDocument()
  await user.click(screen.getByLabelText(/override calculated priority/i))
  await user.selectOptions(screen.getByLabelText(/override band/i), 'moderate')
  await user.clear(screen.getByLabelText(/override reason/i))
  await user.click(screen.getByRole('button', { name: /^prioritise barrier$/i }))
  expect(screen.getByRole('alert')).toHaveTextContent(/reason is required/i)
  await user.type(screen.getByLabelText(/override reason/i), 'Temporary control reduces immediate exposure')
  await user.click(screen.getByRole('button', { name: /^prioritise barrier$/i }))
  expect(screen.getByText(/overridden from critical to moderate/i)).toBeInTheDocument()
  expect(screen.getByText(/temporary control reduces immediate exposure/i)).toBeInTheDocument()
})

function WorkOrderHarness() {
  const initial = createDemoFixture()
  initial.barriers[0].status = 'prioritised'
  const [state, dispatch] = useReducer(demoReducer, initial)
  return <WorkOrderScreen state={state} dispatch={dispatch} barrierId={fixtureIds.primaryBarrier} />
}

test('presents the repair work order as a repair brief', () => {
  render(<WorkOrderHarness />)
  expect(screen.getByRole('heading', { name: /repair work order/i }).closest('form')).toHaveClass('repair-brief')
})

test('blocks direct assignment from a validated barrier and explains the priority prerequisite', () => {
  const state = createDemoFixture()
  state.barriers[0].status = 'validated'
  const dispatched: unknown[] = []
  render(<WorkOrderScreen state={state} dispatch={action => dispatched.push(action)} barrierId={fixtureIds.primaryBarrier} />)

  const form = screen.getByRole('heading', { name: /repair work order/i }).closest('form')
  expect(form).not.toBeNull()
  fireEvent.submit(form!)

  expect(dispatched).toEqual([])
  expect(screen.queryByRole('button', { name: /create work order/i })).not.toBeInTheDocument()
  const prerequisite = screen.getByRole('heading', { name: /priority decision required/i }).closest('section')
  expect(prerequisite).not.toBeNull()
  expect(within(prerequisite!).getByText(/validated but not prioritised.*record a priority decision/i)).toBeInTheDocument()
})

test('validates every assignment field, focuses errors and preserves entered work order values', async () => {
  const user = userEvent.setup()
  render(<WorkOrderHarness />)
  await user.clear(screen.getByLabelText(/owner role/i))
  await user.clear(screen.getByLabelText(/repair remedy/i))
  await user.clear(screen.getByLabelText(/cost band/i))
  await user.clear(screen.getByLabelText(/due date/i))
  await user.click(screen.getByRole('button', { name: /create work order/i }))
  const summary = screen.getByRole('alert')
  expect(summary).toHaveFocus()
  expect(summary).toHaveTextContent(/owner role is required/i)
  expect(summary).toHaveTextContent(/remedy is required/i)
  expect(summary).toHaveTextContent(/cost band is required/i)
  expect(summary).toHaveTextContent(/due date is required/i)
  await user.type(screen.getByLabelText(/owner role/i), 'Civil works coordinator')
  await user.type(screen.getByLabelText(/repair remedy/i), 'Clear the landing and renew the tactile edge.')
  await user.type(screen.getByLabelText(/cost band/i), '₹25,000–₹50,000')
  await user.type(screen.getByLabelText(/due date/i), '2026-08-28')
  await user.click(screen.getByRole('button', { name: /create work order/i }))
  expect(screen.getByRole('heading', { name: /assigned work/i })).toBeInTheDocument()
  expect(screen.getByText(/civil works coordinator/i)).toBeInTheDocument()
  expect(screen.getByText(/clear the landing and renew the tactile edge/i)).toBeInTheDocument()
  expect(screen.getByText(/₹25,000–₹50,000/i)).toBeInTheDocument()
  expect(screen.getByText(/28 august 2026/i)).toBeInTheDocument()
  expect(screen.getByText(/before repair/i)).toBeInTheDocument()
  expect(screen.getByText(/after repair/i)).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: /submit repair evidence/i }))
  expect(screen.getAllByText(/awaiting verification/i).length).toBeGreaterThan(0)
  expect(screen.getAllByText(/does not mean verified complete/i).length).toBeGreaterThan(0)
})

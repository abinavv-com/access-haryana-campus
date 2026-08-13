import { useReducer } from 'react'
import { render, screen } from '@testing-library/react'
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

test('explains priority inputs and requires an override reason', async () => {
  const user = userEvent.setup()
  render(<BarrierHarness />)
  await user.click(screen.getByRole('button', { name: /prioritise before validation/i }))
  expect(screen.getByRole('alert')).toHaveTextContent(/not allowed from observed/i)
  await user.click(screen.getByRole('button', { name: /validate screening/i }))
  expect(screen.getByText(/severity.*essential service.*alternative route.*affected journey.*urgency/i)).toBeInTheDocument()
  await user.click(screen.getByLabelText(/override calculated priority/i))
  await user.clear(screen.getByLabelText(/override reason/i))
  await user.click(screen.getByRole('button', { name: /^prioritise barrier$/i }))
  expect(screen.getByRole('alert')).toHaveTextContent(/reason is required/i)
})

function WorkOrderHarness() {
  const initial = createDemoFixture()
  initial.barriers[0].status = 'prioritised'
  const [state, dispatch] = useReducer(demoReducer, initial)
  return <WorkOrderScreen state={state} dispatch={dispatch} barrierId={fixtureIds.primaryBarrier} />
}

test('validates assignment and moves repair evidence only to awaiting verification', async () => {
  const user = userEvent.setup()
  render(<WorkOrderHarness />)
  await user.clear(screen.getByLabelText(/owner role/i))
  await user.click(screen.getByRole('button', { name: /create work order/i }))
  expect(screen.getByRole('alert')).toHaveTextContent(/owner role is required/i)
  await user.type(screen.getByLabelText(/owner role/i), 'Campus facilities officer')
  await user.click(screen.getByRole('button', { name: /create work order/i }))
  expect(screen.getByRole('heading', { name: /assigned work/i })).toBeInTheDocument()
  expect(screen.getByText(/before repair/i)).toBeInTheDocument()
  expect(screen.getByText(/after repair/i)).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: /submit repair evidence/i }))
  expect(screen.getAllByText(/awaiting verification/i).length).toBeGreaterThan(0)
  expect(screen.getAllByText(/does not mean verified complete/i).length).toBeGreaterThan(0)
})

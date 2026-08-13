import { useReducer } from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test, vi } from 'vitest'
import { createDemoFixture, fixtureIds } from '../data/demo-fixture.v1'
import { demoReducer } from '../domain/demoReducer'
import { illustrativeDataLabel, type DemoState } from '../domain/types'
import { ImpactScreen } from './ImpactScreen'
import { VerificationScreen } from './VerificationScreen'

function awaitingState(): DemoState {
  const state = createDemoFixture()
  state.barriers[0].status = 'awaiting_verification'
  state.workOrders.push({
    id: 'work-order-primary', barrierId: fixtureIds.primaryBarrier, dataLabel: illustrativeDataLabel,
    ownerRole: 'Campus facilities officer', remedy: 'Clear the landing', costBand: '₹10,000–₹25,000', dueDate: '2026-08-20',
    repairEvidence: [{ id: 'repair-after', dataLabel: illustrativeDataLabel, kind: 'illustrative_photo', path: '/media/gradual-ramp-pathway.jpg', altText: 'Illustrative repaired route evidence.', capturedAt: '2026-08-14T11:00:00.000Z' }],
  })
  return state
}

function VerificationHarness() {
  const [state, dispatch] = useReducer(demoReducer, undefined, awaitingState)
  return <VerificationScreen state={state} dispatch={dispatch} barrierId={fixtureIds.primaryBarrier} navigate={() => undefined} />
}

test('asks for voluntary consent without requesting a diagnosis and identifies the independent verifier boundary', () => {
  render(<VerificationHarness />)
  expect(screen.getByText(/participation is voluntary/i)).toBeInTheDocument()
  expect(screen.getByText(/refusal has no consequence/i)).toBeInTheDocument()
  expect(screen.getByText(/we do not ask for.*diagnosis/i)).toBeInTheDocument()
  expect(screen.getByText((_, element) => element?.tagName === 'P' && /repair owner:.*campus facilities officer/i.test(element.textContent ?? ''))).toBeInTheDocument()
  expect(screen.getByLabelText(/verifier role/i)).not.toHaveValue('Campus facilities officer')
  expect(screen.getByRole('button', { name: /accept for this journey and test conditions/i })).toBeInTheDocument()
})

test('requires rejection reason, returns to rework and preserves earlier repair evidence', async () => {
  const user = userEvent.setup()
  render(<VerificationHarness />)
  await user.click(screen.getByLabelText(/i freely consent/i))
  await user.click(screen.getByRole('button', { name: /send to rework/i }))
  expect(screen.getByRole('alert')).toHaveTextContent(/rejection reason is required/i)
  await user.type(screen.getByLabelText(/rework reason/i), 'The landing still catches the front caster at the east edge.')
  await user.click(screen.getByRole('button', { name: /send to rework/i }))
  expect(screen.getByRole('heading', { name: /rework required/i })).toBeInTheDocument()
  expect(screen.getAllByText(/landing still catches/i).length).toBeGreaterThan(0)
  expect(screen.getByText(/illustrative repaired route evidence/i)).toBeInTheDocument()
  expect(screen.getByText(/earlier audit and repair evidence remains preserved/i)).toBeInTheDocument()
})

test('records another inspection without advancing the awaiting-verification status', async () => {
  const user = userEvent.setup()
  render(<VerificationHarness />)
  await user.click(screen.getByLabelText(/i freely consent/i))
  await user.click(screen.getByRole('button', { name: /request another inspection/i }))
  expect(screen.getAllByText(/awaiting verification/i).length).toBeGreaterThan(0)
  expect(screen.getByText(/another independent inspection requested/i)).toBeInTheDocument()
})

test('reports only accepted verified records with source links and a qualified print summary', async () => {
  const state = awaitingState()
  state.barriers[0].status = 'verified'
  state.verifications.push({ id: 'verification-primary', barrierId: fixtureIds.primaryBarrier, workOrderId: 'work-order-primary', dataLabel: illustrativeDataLabel, decision: 'accepted', definedTestConditions: 'Dry daylight journey from main gate to admissions using a manual wheelchair.', feedback: 'Journey completed.', timestamp: '2026-08-15T10:00:00.000Z' })
  state.workOrders.push({ id: 'work-order-unverified', barrierId: fixtureIds.rampBarrier, dataLabel: illustrativeDataLabel, ownerRole: 'Estates', remedy: 'Review ramp', costBand: '₹25,000', dueDate: '2026-08-25', repairEvidence: [] })
  const print = vi.spyOn(window, 'print').mockImplementation(() => undefined)
  const user = userEvent.setup()
  render(<ImpactScreen state={state} navigate={() => undefined} />)
  expect(screen.getAllByText('1', { selector: '.metric-value' })).toHaveLength(2)
  expect(screen.getByRole('link', { name: /barrier-obstructed-landing/i })).toBeInTheDocument()
  expect(screen.getByRole('link', { name: /work-order-primary/i })).toBeInTheDocument()
  expect(screen.getByText(/verification-primary/i)).toBeInTheDocument()
  expect(screen.queryByText(/work-order-unverified/i)).not.toBeInTheDocument()
  expect(screen.getAllByText(/illustrative demo data/i).length).toBeGreaterThan(0)
  expect(screen.getByText(/bounded retest.*not.*certification.*legal compliance/i)).toBeInTheDocument()
  await user.click(screen.getByRole('button', { name: /print evidence summary/i }))
  expect(print).toHaveBeenCalledOnce()
})

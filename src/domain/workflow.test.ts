import { describe, expect, it } from 'vitest'
import { createDemoFixture } from '../data/demo-fixture.v1'
import type { BarrierStatus, DemoState, EvidenceItem, WorkOrder } from './types'
import { transitionBarrier, type TransitionCommand } from './workflow'

const before: EvidenceItem = {
  id: 'repair-photo', dataLabel: 'Illustrative demo data', kind: 'illustrative_photo',
  path: '/repair.jpg', altText: 'Cleared landing after repair.', capturedAt: '2026-08-12T10:00:00Z',
}
const workOrder: WorkOrder = {
  id: 'wo-1', barrierId: 'barrier-obstructed-landing', dataLabel: 'Illustrative demo data',
  ownerRole: 'facilities-officer', remedy: 'Clear stored materials', costBand: 'low',
  dueDate: '2026-08-15', repairEvidence: [],
}

function stateAt(status: BarrierStatus): DemoState {
  const state = createDemoFixture()
  state.barriers[0].status = status
  if (!['observed', 'validated', 'prioritised'].includes(status)) state.workOrders.push(structuredClone(workOrder))
  if (['awaiting_verification', 'verified', 'rework_required'].includes(status)) state.workOrders[0].repairEvidence.push(before)
  return state
}

const base = { barrierId: 'barrier-obstructed-landing', eventId: 'event-1', timestamp: '2026-08-12T11:00:00Z' }
const commands: Record<string, TransitionCommand> = {
  validate: { ...base, type: 'validate', actorPerspective: 'auditor', reviewerRole: 'designated-reviewer', reason: 'Reviewed screening evidence.' },
  prioritise: { ...base, type: 'prioritise', actorPerspective: 'facilities', reason: 'Essential journey and no safe alternative.' },
  assign: { ...base, type: 'assign', actorPerspective: 'facilities', workOrder, reason: 'Repair assigned.' },
  submit: { ...base, type: 'submit_evidence', actorPerspective: 'facilities', workOrderId: 'wo-1', evidence: [before], reason: 'Repair evidence submitted.' },
  accept: { ...base, type: 'accept', actorPerspective: 'verifier', verificationId: 'verify-1', testerRole: 'student-verifier', consented: true, definedTestConditions: 'Main gate to admissions, dry daylight conditions.', reason: 'Journey completed under defined conditions.' },
  reject: { ...base, type: 'reject', actorPerspective: 'verifier', verificationId: 'verify-1', testerRole: 'student-verifier', consented: true, definedTestConditions: 'Main gate to admissions, dry daylight conditions.', reason: 'Landing remains obstructed.' },
  inspect: { ...base, type: 'request_inspection', actorPerspective: 'verifier', verificationId: 'verify-1', testerRole: 'student-verifier', consented: true, definedTestConditions: 'Gradient requires professional assessment.', reason: 'Bounded retest cannot responsibly determine gradient.' },
}

describe('transitionBarrier', () => {
  it.each([
    ['observed', 'validate', 'validated'], ['validated', 'prioritise', 'prioritised'],
    ['prioritised', 'assign', 'assigned'], ['assigned', 'submit', 'awaiting_verification'],
    ['awaiting_verification', 'accept', 'verified'], ['awaiting_verification', 'reject', 'rework_required'],
    ['awaiting_verification', 'inspect', 'awaiting_verification'], ['rework_required', 'submit', 'awaiting_verification'],
  ] as const)('allows %s via %s to %s and appends one immutable event', (from, commandName, to) => {
    const state = stateAt(from)
    const result = transitionBarrier(state, commands[commandName])
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.state.barriers[0].status).toBe(to)
    expect(result.state.activity).toHaveLength(1)
    expect(result.event).toMatchObject({ fromStatus: from, toStatus: to })
    expect(Object.isFrozen(result.event)).toBe(true)
    expect(state.barriers[0].status).toBe(from)
  })

  it.each([
    ['observed', 'prioritise'], ['observed', 'assign'], ['assigned', 'accept'], ['verified', 'reject'],
  ] as const)('rejects forbidden %s -> %s without changing state', (from, commandName) => {
    const state = stateAt(from)
    const snapshot = structuredClone(state)
    const result = transitionBarrier(state, commands[commandName])
    expect(result).toMatchObject({ ok: false })
    expect(state).toEqual(snapshot)
    if (!result.ok) expect(result.state).toBe(state)
  })

  it('records immediate-hazard escalation and interim control without bypassing status', () => {
    const state = stateAt('observed')
    const result = transitionBarrier(state, { ...base, type: 'escalate_hazard', actorPerspective: 'auditor', interimControl: 'Remove obstruction and post a signed alternate route.', reason: 'Potential immediate trip hazard.' })
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.state.barriers[0].status).toBe('observed')
    expect(result.event.reason).toContain('Remove obstruction and post a signed alternate route.')
  })

  it('preserves prior repair evidence and verification history when rejected to rework', () => {
    const state = stateAt('awaiting_verification')
    state.verifications.push({ id: 'old', barrierId: base.barrierId, workOrderId: 'wo-1', dataLabel: 'Illustrative demo data', decision: 'additional_inspection', definedTestConditions: 'Earlier test', timestamp: '2026-08-11T00:00:00Z' })
    const result = transitionBarrier(state, commands.reject)
    expect(result.ok).toBe(true)
    if (!result.ok) return
    expect(result.state.workOrders[0].repairEvidence).toEqual([before])
    expect(result.state.verifications.map((item) => item.id)).toEqual(['old', 'verify-1'])
  })

  it.each([
    [{ consented: false }, 'consent'], [{ testerRole: 'facilities-officer' }, 'independent'],
    [{ definedTestConditions: '' }, 'test conditions'],
  ])('requires an independent consenting verifier with bounded conditions', (override, error) => {
    const state = stateAt('awaiting_verification')
    const result = transitionBarrier(state, { ...commands.accept, ...override } as TransitionCommand)
    expect(result).toMatchObject({ ok: false })
    if (!result.ok) expect(result.error.toLowerCase()).toContain(error)
  })

  it('derives the repair owner from state and ignores a caller claim of a different owner', () => {
    const state = stateAt('awaiting_verification')
    const misleadingCommand = {
      ...commands.accept,
      testerRole: 'facilities-officer',
      repairOwnerRole: 'outside-contractor',
    } as unknown as TransitionCommand
    const result = transitionBarrier(state, misleadingCommand)
    expect(result).toMatchObject({ ok: false })
    if (!result.ok) expect(result.error.toLowerCase()).toContain('independent')
  })
})

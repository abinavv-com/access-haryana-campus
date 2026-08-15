import { createDemoFixture } from '../data/demo-fixture.v1'
import { validateVerification, type TrustedVerificationContext, type VerificationInput } from './validation'
import { transitionBarrier, type TransitionCommand } from './workflow'
import type { DemoState } from './types'

export type DemoAction =
  | { type: 'APPLY_TRANSITION'; command: TransitionCommand }
  | { type: 'SUBMIT_AUDIT'; barrier: DemoState['barriers'][number]; event: DemoState['activity'][number] }
  | { type: 'RESET_DEMO' }

function verificationInput(state: DemoState, command: TransitionCommand): {
  input: VerificationInput
  context: TrustedVerificationContext
} | null {
  if (!['accept', 'reject', 'request_inspection'].includes(command.type)) return null
  if (command.type !== 'accept' && command.type !== 'reject' && command.type !== 'request_inspection') return null

  const barrier = state.barriers.find((item) => item.id === command.barrierId)
  const journey = barrier && state.journeys.find((item) => item.id === barrier.journeyId)
  const workOrder = state.workOrders.find((item) => item.barrierId === command.barrierId)
  if (!barrier || !journey || !workOrder) return null

  return {
    input: {
      decision: command.type === 'accept' ? 'accepted' : command.type === 'reject' ? 'rejected' : 'additional_inspection',
      consented: command.consented,
      testerRole: command.testerRole,
      journeyId: journey.id,
      accessRequirement: journey.accessRequirement,
      definedTestConditions: command.definedTestConditions,
      beforeOutcome: command.beforeOutcome,
      afterOutcome: command.afterOutcome,
      reason: command.reason,
    },
    context: { ownerRole: workOrder.ownerRole, hasRepairEvidence: workOrder.repairEvidence.length > 0 },
  }
}

export function demoReducer(state: DemoState, action: DemoAction): DemoState {
  if (action.type === 'RESET_DEMO') return createDemoFixture()
  if (action.type === 'SUBMIT_AUDIT') {
    const consistentEvent = action.event.barrierId === action.barrier.id && action.event.toStatus === action.barrier.status && action.event.dataLabel === action.barrier.dataLabel && action.event.fromStatus === null
    if (!consistentEvent || state.barriers.some(item => item.id === action.barrier.id) || action.barrier.status !== 'observed' || action.barrier.evidence.length === 0) return state
    return { ...state, barriers: [...state.barriers, structuredClone(action.barrier)], activity: [...state.activity, structuredClone(action.event)] }
  }

  const verification = verificationInput(state, action.command)
  if (['accept', 'reject', 'request_inspection'].includes(action.command.type)) {
    if (!verification || validateVerification(verification.input, verification.context).length > 0) return state
  }

  const result = transitionBarrier(state, action.command)
  return result.ok ? result.state : state
}

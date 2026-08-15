import { illustrativeDataLabel, type ActivityEvent, type BarrierStatus, type DemoState, type EvidenceItem, type Verification, type WorkOrder } from './types'

interface CommandBase {
  barrierId: string
  eventId: string
  timestamp: string
  actorPerspective: ActivityEvent['actorPerspective']
  reason: string
}

export type TransitionCommand =
  | (CommandBase & { type: 'validate'; reviewerRole: string })
  | (CommandBase & { type: 'prioritise' })
  | (CommandBase & { type: 'assign'; workOrder: WorkOrder })
  | (CommandBase & { type: 'submit_evidence'; workOrderId: string; evidence: EvidenceItem[] })
  | (CommandBase & VerificationCommand & { type: 'accept' | 'reject' | 'request_inspection' })
  | (CommandBase & { type: 'escalate_hazard'; interimControl: string })

interface VerificationCommand {
  verificationId: string
  testerRole: string
  consented: boolean
  definedTestConditions: string
  beforeOutcome?: { succeeded: boolean; completionMinutes: number }
  afterOutcome?: { succeeded: boolean; completionMinutes: number }
}

export type TransitionResult =
  | { ok: true; state: DemoState; event: Readonly<ActivityEvent> }
  | { ok: false; state: DemoState; error: string }

const transitions: Partial<Record<BarrierStatus, Partial<Record<TransitionCommand['type'], BarrierStatus>>>> = {
  observed: { validate: 'validated' },
  validated: { prioritise: 'prioritised' },
  prioritised: { assign: 'assigned' },
  assigned: { submit_evidence: 'awaiting_verification' },
  awaiting_verification: {
    accept: 'verified',
    reject: 'rework_required',
    request_inspection: 'awaiting_verification',
  },
  rework_required: { submit_evidence: 'awaiting_verification' },
}

function fail(state: DemoState, error: string): TransitionResult {
  return { ok: false, state, error }
}

export function transitionBarrier(state: DemoState, command: TransitionCommand): TransitionResult {
  const barrierIndex = state.barriers.findIndex((item) => item.id === command.barrierId)
  if (barrierIndex < 0) return fail(state, 'Barrier not found.')

  const barrier = state.barriers[barrierIndex]
  let toStatus = transitions[barrier.status]?.[command.type]
  let eventReason = command.reason.trim()

  if (command.type === 'escalate_hazard') {
    if (!command.interimControl.trim()) return fail(state, 'Immediate-hazard escalation requires an interim control.')
    toStatus = barrier.status
    eventReason = `${eventReason} Interim control: ${command.interimControl.trim()}`
  } else if (!toStatus) {
    return fail(state, `The ${command.type} command is not allowed from ${barrier.status}.`)
  }

  if (!eventReason) return fail(state, 'A transition reason is required.')
  if (command.type === 'validate' && !command.reviewerRole.trim()) return fail(state, 'A designated reviewer role is required.')

  const workOrder = command.type === 'submit_evidence'
    ? state.workOrders.find((item) => item.id === command.workOrderId && item.barrierId === barrier.id)
    : state.workOrders.find((item) => item.barrierId === barrier.id)

  if (command.type === 'assign' && command.workOrder.barrierId !== barrier.id) return fail(state, 'Work order must belong to the barrier.')
  if (command.type === 'submit_evidence' && !workOrder) return fail(state, 'A matching work order is required.')
  if (command.type === 'submit_evidence' && command.evidence.length === 0) return fail(state, 'Repair evidence is required.')

  if (command.type === 'accept' || command.type === 'reject' || command.type === 'request_inspection') {
    if (!workOrder?.repairEvidence.length) return fail(state, 'Repair evidence is required before verification.')
    if (!command.consented) return fail(state, 'Voluntary tester consent is required.')
    if (!command.testerRole.trim() || command.testerRole === workOrder.ownerRole) return fail(state, 'An independent verifier is required.')
    if (!command.definedTestConditions.trim()) return fail(state, 'Defined test conditions are required.')
    if (command.beforeOutcome && command.afterOutcome) {
      if (![command.beforeOutcome.completionMinutes, command.afterOutcome.completionMinutes].every(value => Number.isFinite(value) && value >= 1 && value <= 1440)) return fail(state, 'Journey completion times must be between 1 and 1,440 minutes.')
    }
  }

  const next = structuredClone(state)
  next.barriers[barrierIndex].status = toStatus!

  if (command.type === 'assign') next.workOrders.push(structuredClone(command.workOrder))
  if (command.type === 'submit_evidence') {
    const index = next.workOrders.findIndex((item) => item.id === command.workOrderId)
    next.workOrders[index].repairEvidence.push(...structuredClone(command.evidence))
  }
  if (command.type === 'accept' || command.type === 'reject' || command.type === 'request_inspection') {
    const verification: Verification = {
      id: command.verificationId,
      barrierId: barrier.id,
      workOrderId: workOrder!.id,
      dataLabel: illustrativeDataLabel,
      decision: command.type === 'accept' ? 'accepted' : command.type === 'reject' ? 'rejected' : 'additional_inspection',
      definedTestConditions: command.definedTestConditions,
      beforeOutcome: command.beforeOutcome,
      afterOutcome: command.afterOutcome,
      feedback: eventReason,
      timestamp: command.timestamp,
    }
    next.verifications.push(verification)
  }

  const event: Readonly<ActivityEvent> = Object.freeze({
    id: command.eventId,
    barrierId: barrier.id,
    dataLabel: illustrativeDataLabel,
    actorPerspective: command.actorPerspective,
    fromStatus: barrier.status,
    toStatus: toStatus!,
    reason: eventReason,
    timestamp: command.timestamp,
  })
  next.activity.push(event)
  return { ok: true, state: next, event }
}

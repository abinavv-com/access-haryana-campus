import type { BarrierStatus } from './types'

export type AuditMeasurement =
  | { outcome: 'measured'; riseMm: number; runMm: number; implausibleConfirmed: boolean }
  | { outcome: 'clear_width'; widthMm: number; implausibleConfirmed: boolean }
  | { outcome: 'unable'; reason: string }

export interface AuditInput {
  evidenceIds: string[]
  measurement: AuditMeasurement
}

export interface WorkOrderInput {
  barrierStatus: BarrierStatus
  ownerRole: string
  remedy: string
  costBand: string
  dueDate: string
}

export interface VerificationInput {
  decision: 'accepted' | 'rejected' | 'additional_inspection'
  consented: boolean
  testerRole: string
  journeyId: string
  accessRequirement: string
  definedTestConditions: string
  reason: string
}

export interface TrustedVerificationContext {
  ownerRole: string
  hasRepairEvidence: boolean
}

export function validateAudit(input: AuditInput): string[] {
  const errors: string[] = []
  if (input.evidenceIds.length === 0) errors.push('Supporting evidence is required.')

  if (input.measurement.outcome === 'unable') {
    if (!input.measurement.reason.trim()) errors.push('Explain why the measurement could not be taken.')
    return errors
  }

  if (input.measurement.outcome === 'clear_width') {
    const { widthMm, implausibleConfirmed } = input.measurement
    if (!Number.isFinite(widthMm) || widthMm <= 0) errors.push('Clear width must be a positive measurement in millimetres.')
    else if ((widthMm < 300 || widthMm > 5_000) && !implausibleConfirmed) errors.push('Confirm the implausible clear-width value before continuing.')
    return errors
  }

  const { riseMm, runMm, implausibleConfirmed } = input.measurement
  if (!Number.isFinite(riseMm) || riseMm <= 0) errors.push('Rise must be a positive measurement in millimetres.')
  if (!Number.isFinite(runMm) || runMm <= 0) errors.push('Run must be a positive measurement in millimetres.')
  const isImplausible = riseMm > 1_000 || runMm < 300 || riseMm > runMm
  if (isImplausible && !implausibleConfirmed) errors.push('Confirm the implausible rise/run values before continuing.')
  return errors
}

export function validateWorkOrder(input: WorkOrderInput): string[] {
  const errors: string[] = []
  if (!['validated', 'prioritised'].includes(input.barrierStatus)) errors.push('The barrier must be validated before a work order is created.')
  if (!input.ownerRole.trim()) errors.push('An owner role is required.')
  if (!input.remedy.trim()) errors.push('A remedy is required.')
  if (!input.costBand.trim()) errors.push('A cost band is required.')
  if (!input.dueDate.trim()) errors.push('A due date is required.')
  return errors
}

export function validateVerification(input: VerificationInput, trustedWorkOrder: TrustedVerificationContext): string[] {
  const errors: string[] = []
  if (!trustedWorkOrder.hasRepairEvidence) errors.push('Repair evidence is required before verification.')
  if (!input.consented) errors.push('Voluntary tester consent is required.')
  if (!input.testerRole.trim() || input.testerRole.trim() === trustedWorkOrder.ownerRole.trim()) errors.push('An independent verifier is required.')
  if (!input.journeyId.trim()) errors.push('A defined journey is required.')
  if (!input.accessRequirement.trim()) errors.push('An access requirement is required.')
  if (!input.definedTestConditions.trim()) errors.push('Defined test conditions are required.')
  if (input.decision === 'rejected' && !input.reason.trim()) errors.push('A rejection reason is required.')
  return errors
}

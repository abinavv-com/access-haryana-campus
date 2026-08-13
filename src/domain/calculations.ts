import type { BarrierStatus, Severity } from './types'

export type PriorityBand = 'low' | 'moderate' | 'high' | 'critical'
export type Fixability = 'quick' | 'standard' | 'complex'

export interface PriorityInput {
  severity: Severity
  essentialServiceImpact: boolean
  alternativeRouteQuality: 'comparable' | 'limited' | 'none'
  affectedJourneys: number
  urgency: 'routine' | 'soon' | 'immediate'
  fixability: Fixability
  overrideBand?: PriorityBand
  overrideReason?: string
}

export interface PriorityResult {
  score: number
  band: PriorityBand
  sequencing: Fixability
}

const severityScore: Record<Severity, number> = { low: 5, moderate: 15, high: 30, urgent: 40 }
const routeScore: Record<PriorityInput['alternativeRouteQuality'], number> = { comparable: 0, limited: 8, none: 15 }
const urgencyScore: Record<PriorityInput['urgency'], number> = { routine: 0, soon: 5, immediate: 10 }

export function calculatePriority(input: PriorityInput): PriorityResult {
  if (input.overrideBand && !input.overrideReason?.trim()) throw new Error('A reason is required to override calculated priority.')
  const journeyScore = Math.min(15, Math.max(0, Math.trunc(input.affectedJourneys)) * 5)
  const score = severityScore[input.severity]
    + (input.essentialServiceImpact ? 20 : 0)
    + routeScore[input.alternativeRouteQuality]
    + journeyScore
    + urgencyScore[input.urgency]
  const calculatedBand: PriorityBand = score >= 75 ? 'critical' : score >= 50 ? 'high' : score >= 25 ? 'moderate' : 'low'
  return { score, band: input.overrideBand ?? calculatedBand, sequencing: input.fixability }
}

export interface ImpactRecord {
  barrierId: string
  workOrderId: string
  verificationId: string
  status: BarrierStatus
  baselineSucceeded: boolean
  verifiedSucceeded: boolean
  baselineMinutes: number
  verifiedMinutes: number
  repairDays: number
  spend: number
}

export interface ImpactResult {
  verifiedRepairs: number
  successfulJourneyTests: number
  baselineSuccessRate: number | null
  verifiedSuccessRate: number | null
  averageTimeSavedMinutes: number | null
  medianRepairDays: number | null
  pilotSpend: number
  costPerVerifiedFix: number | null
  sourceRecordIds: { barrierIds: string[]; workOrderIds: string[]; verificationIds: string[] }
}

const round = (value: number) => Math.round(value * 100) / 100

export function calculateImpact(records: readonly ImpactRecord[]): ImpactResult {
  const verified = records.filter((record) => record.status === 'verified')
  const count = verified.length
  const pilotSpend = verified.reduce((sum, record) => sum + record.spend, 0)
  const sortedRepairDays = verified.map(({ repairDays }) => repairDays).sort((a, b) => a - b)
  const middle = Math.floor(count / 2)
  const medianRepairDays = count === 0 ? null : count % 2
    ? sortedRepairDays[middle]
    : round((sortedRepairDays[middle - 1] + sortedRepairDays[middle]) / 2)

  return {
    verifiedRepairs: count,
    successfulJourneyTests: verified.filter(({ verifiedSucceeded }) => verifiedSucceeded).length,
    baselineSuccessRate: count ? round(verified.filter(({ baselineSucceeded }) => baselineSucceeded).length / count * 100) : null,
    verifiedSuccessRate: count ? round(verified.filter(({ verifiedSucceeded }) => verifiedSucceeded).length / count * 100) : null,
    averageTimeSavedMinutes: count ? round(verified.reduce((sum, record) => sum + record.baselineMinutes - record.verifiedMinutes, 0) / count) : null,
    medianRepairDays,
    pilotSpend,
    costPerVerifiedFix: count ? round(pilotSpend / count) : null,
    sourceRecordIds: {
      barrierIds: verified.map(({ barrierId }) => barrierId),
      workOrderIds: verified.map(({ workOrderId }) => workOrderId),
      verificationIds: verified.map(({ verificationId }) => verificationId),
    },
  }
}

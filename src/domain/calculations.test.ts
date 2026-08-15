import { describe, expect, it } from 'vitest'
import { calculateImpact, calculatePriority } from './calculations'

describe('calculatePriority', () => {
  const urgentCase = {
    severity: 'urgent' as const,
    essentialServiceImpact: true,
    alternativeRouteQuality: 'none' as const,
    affectedJourneys: 3,
    urgency: 'immediate' as const,
    fixability: 'complex' as const,
  }

  it('scores rights and safety factors while reporting fixability separately', () => {
    expect(calculatePriority(urgentCase)).toEqual({ score: 100, band: 'critical', sequencing: 'complex' })
    expect(calculatePriority({ ...urgentCase, fixability: 'quick' })).toEqual({ score: 100, band: 'critical', sequencing: 'quick' })
  })

  it('requires a reason for a manual priority override', () => {
    expect(() => calculatePriority({ ...urgentCase, overrideBand: 'low' })).toThrow('A reason is required to override calculated priority.')
    expect(calculatePriority({ ...urgentCase, overrideBand: 'low', overrideReason: 'Duplicate temporary control is active.' }).band).toBe('low')
  })

  it.each([Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])('treats non-finite affected journey count %s as zero', (affectedJourneys) => {
    expect(calculatePriority({
      severity: 'low', essentialServiceImpact: false, alternativeRouteQuality: 'comparable',
      affectedJourneys, urgency: 'routine', fixability: 'standard',
    })).toEqual({ score: 5, band: 'low', sequencing: 'standard' })
  })
})

describe('calculateImpact', () => {
  it('calculates metrics only from verified outcomes and exposes their source record IDs', () => {
    const impact = calculateImpact([
      { barrierId: 'b1', workOrderId: 'w1', verificationId: 'v1', status: 'verified', baselineSucceeded: false, verifiedSucceeded: true, baselineMinutes: 12, verifiedMinutes: 7, repairDays: 4, spend: 1000 },
      { barrierId: 'b2', workOrderId: 'w2', verificationId: 'v2', status: 'awaiting_verification', baselineSucceeded: false, verifiedSucceeded: true, baselineMinutes: 10, verifiedMinutes: 5, repairDays: 2, spend: 500 },
      { barrierId: 'b3', workOrderId: 'w3', verificationId: 'v3', status: 'rework_required', baselineSucceeded: false, verifiedSucceeded: true, baselineMinutes: 8, verifiedMinutes: 4, repairDays: 3, spend: 700 },
    ])

    expect(impact).toEqual({
      verifiedRepairs: 1,
      successfulJourneyTests: 1,
      baselineSuccessRate: 0,
      verifiedSuccessRate: 100,
      averageTimeSavedMinutes: 5,
      medianRepairDays: 4,
      pilotSpend: 1000,
      costPerVerifiedFix: 1000,
      sourceRecordIds: { barrierIds: ['b1'], workOrderIds: ['w1'], verificationIds: ['v1'] },
    })
  })

  it('returns null rates and aggregates when there are no verified records', () => {
    expect(calculateImpact([])).toEqual({
      verifiedRepairs: 0,
      successfulJourneyTests: 0,
      baselineSuccessRate: null,
      verifiedSuccessRate: null,
      averageTimeSavedMinutes: null,
      medianRepairDays: null,
      pilotSpend: 0,
      costPerVerifiedFix: null,
      sourceRecordIds: { barrierIds: [], workOrderIds: [], verificationIds: [] },
    })
  })
})

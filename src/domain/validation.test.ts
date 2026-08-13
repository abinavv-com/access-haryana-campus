import { describe, expect, it } from 'vitest'
import { validateAudit, validateVerification, validateWorkOrder } from './validation'

describe('validateAudit', () => {
  const validAudit = {
    evidenceIds: ['evidence-1'],
    measurement: { outcome: 'measured' as const, riseMm: 150, runMm: 1800, implausibleConfirmed: false },
  }

  it('rejects an audit with no supporting evidence', () => {
    expect(validateAudit({ ...validAudit, evidenceIds: [] })).toContain('Supporting evidence is required.')
  })

  it('accepts unable to measure as a report outcome when a reason is supplied', () => {
    expect(validateAudit({ evidenceIds: ['evidence-1'], measurement: { outcome: 'unable' as const, reason: 'Ramp was temporarily obstructed.' } })).toEqual([])
  })

  it('requires confirmation for an implausible rise or run instead of declaring failure', () => {
    const errors = validateAudit({ ...validAudit, measurement: { ...validAudit.measurement, riseMm: 1200, runMm: 100 } })
    expect(errors).toContain('Confirm the implausible rise/run values before continuing.')
    expect(validateAudit({ ...validAudit, measurement: { ...validAudit.measurement, riseMm: 1200, runMm: 100, implausibleConfirmed: true } })).toEqual([])
  })
})

describe('validateWorkOrder', () => {
  it('requires a validated barrier and all assignment prerequisites', () => {
    expect(validateWorkOrder({ barrierStatus: 'observed', ownerRole: '', remedy: '', costBand: '', dueDate: '' })).toEqual([
      'The barrier must be validated before a work order is created.',
      'An owner role is required.',
      'A remedy is required.',
      'A cost band is required.',
      'A due date is required.',
    ])
  })
})

describe('validateVerification', () => {
  const valid = {
    decision: 'accepted' as const,
    consented: true,
    testerRole: 'student-verifier',
    repairOwnerRole: 'facilities',
    hasRepairEvidence: true,
    journeyId: 'journey-1',
    accessRequirement: 'Step-free mobility access',
    definedTestConditions: 'Dry daylight conditions',
    reason: '',
  }

  it('requires acceptance to be bounded to a journey, access requirement and test conditions', () => {
    expect(validateVerification({ ...valid, journeyId: '', accessRequirement: '', definedTestConditions: '' })).toEqual([
      'A defined journey is required.',
      'An access requirement is required.',
      'Defined test conditions are required.',
    ])
  })

  it('requires a reason when verification is rejected', () => {
    expect(validateVerification({ ...valid, decision: 'rejected', reason: '  ' })).toContain('A rejection reason is required.')
  })
})

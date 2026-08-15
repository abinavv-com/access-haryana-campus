import type { DemoState } from '../domain/types'
import { createDemoFixture } from './demo-fixture.v1'

export const DEMO_STORAGE_KEY = 'access-haryana-campus.demo'
const RESTORE_WARNING = 'Saved demo data could not be restored; a fresh fictional fixture is being used.'

export interface LoadDemoResult {
  state: DemoState
  warning: string | null
}

type StorageAdapter = Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function hasString(value: Record<string, unknown>, key: string): boolean {
  return typeof value[key] === 'string'
}

function isEvidence(value: unknown): boolean {
  return isRecord(value) && hasString(value, 'id') && value.dataLabel === 'Illustrative demo data'
    && value.kind === 'illustrative_photo' && hasString(value, 'path')
    && hasString(value, 'altText') && hasString(value, 'capturedAt')
}

function isGuidelineReference(value: unknown): boolean {
  return isRecord(value) && hasString(value, 'source') && typeof value.editionYear === 'number'
    && hasString(value, 'section') && value.checkType === 'screening'
}

function isJourneyOutcome(value: unknown): boolean {
  return value === undefined || (isRecord(value) && typeof value.succeeded === 'boolean' && typeof value.completionMinutes === 'number')
}

function everyRecord(value: unknown, guard: (item: unknown) => boolean): boolean {
  return Array.isArray(value) && value.every(guard)
}

function isOneOf<const T extends readonly string[]>(value: unknown, choices: T): value is T[number] {
  return typeof value === 'string' && choices.includes(value)
}

function isDemoState(value: unknown): value is DemoState {
  if (!isRecord(value) || value.schemaVersion !== 1) return false
  const campus = value.campus
  if (!isRecord(campus) || !hasString(campus, 'id') || campus.dataLabel !== 'Illustrative demo data'
    || !hasString(campus, 'name') || !hasString(campus, 'district') || campus.isFictional !== true) return false

  return everyRecord(value.journeys, (item) => isRecord(item) && hasString(item, 'id')
      && hasString(item, 'campusId') && item.dataLabel === 'Illustrative demo data'
      && hasString(item, 'name') && hasString(item, 'origin') && hasString(item, 'destination')
      && Array.isArray(item.checkpoints) && item.checkpoints.every((part) => typeof part === 'string')
      && hasString(item, 'accessRequirement'))
    && everyRecord(value.barriers, (item) => isRecord(item) && hasString(item, 'id')
      && hasString(item, 'journeyId') && item.dataLabel === 'Illustrative demo data'
      && isOneOf(item.category, ['obstructed_landing', 'ramp_gradient', 'directional_signage'])
      && hasString(item, 'title') && hasString(item, 'description') && hasString(item, 'campusZone')
      && isOneOf(item.severity, ['low', 'moderate', 'high', 'urgent'])
      && isOneOf(item.status, ['observed', 'validated', 'prioritised', 'assigned', 'awaiting_verification', 'verified', 'rework_required'])
      && hasString(item, 'observedAt') && everyRecord(item.evidence, isEvidence)
      && (typeof item.guidelineReference === 'undefined' || isGuidelineReference(item.guidelineReference)))
    && everyRecord(value.workOrders, (item) => isRecord(item) && hasString(item, 'id')
      && hasString(item, 'barrierId') && item.dataLabel === 'Illustrative demo data'
      && hasString(item, 'ownerRole') && hasString(item, 'remedy') && hasString(item, 'costBand')
      && hasString(item, 'dueDate') && everyRecord(item.repairEvidence, isEvidence))
    && everyRecord(value.verifications, (item) => isRecord(item) && hasString(item, 'id')
      && hasString(item, 'barrierId') && hasString(item, 'workOrderId')
      && item.dataLabel === 'Illustrative demo data'
      && isOneOf(item.decision, ['accepted', 'rejected', 'additional_inspection'])
      && hasString(item, 'definedTestConditions') && isJourneyOutcome(item.beforeOutcome) && isJourneyOutcome(item.afterOutcome)
      && hasString(item, 'timestamp'))
    && everyRecord(value.activity, (item) => isRecord(item) && hasString(item, 'id')
      && hasString(item, 'barrierId') && item.dataLabel === 'Illustrative demo data'
      && isOneOf(item.actorPerspective, ['auditor', 'facilities', 'verifier'])
      && (item.fromStatus === null || isOneOf(item.fromStatus, ['observed', 'validated', 'prioritised', 'assigned', 'awaiting_verification', 'verified', 'rework_required']))
      && isOneOf(item.toStatus, ['observed', 'validated', 'prioritised', 'assigned', 'awaiting_verification', 'verified', 'rework_required'])
      && hasString(item, 'reason') && hasString(item, 'timestamp'))
}

function isV1Envelope(value: unknown): value is { schemaVersion: 1; savedAt: string; state: DemoState } {
  return isRecord(value) && value.schemaVersion === 1 && typeof value.savedAt === 'string' && isDemoState(value.state)
}

export function loadDemoState(storage: StorageAdapter = localStorage): LoadDemoResult {
  try {
    const serialized = storage.getItem(DEMO_STORAGE_KEY)
    if (serialized === null) return { state: createDemoFixture(), warning: null }
    const envelope: unknown = JSON.parse(serialized)
    if (isV1Envelope(envelope)) return { state: structuredClone(envelope.state), warning: null }
  } catch {
    // A storage or parse failure is recoverable for this frontend-only demo.
  }
  return { state: createDemoFixture(), warning: RESTORE_WARNING }
}

export function saveDemoState(
  state: DemoState,
  storage: StorageAdapter = localStorage,
  now: () => string = () => new Date().toISOString(),
): boolean {
  try {
    storage.setItem(DEMO_STORAGE_KEY, JSON.stringify({ schemaVersion: 1, savedAt: now(), state }))
    return true
  } catch {
    return false
  }
}

export function resetDemoState(storage: StorageAdapter = localStorage): boolean {
  try {
    storage.removeItem(DEMO_STORAGE_KEY)
    return true
  } catch {
    return false
  }
}

export const illustrativeDataLabel = 'Illustrative demo data' as const

export type IllustrativeDataLabel = typeof illustrativeDataLabel

export type BarrierStatus =
  | 'observed'
  | 'validated'
  | 'prioritised'
  | 'assigned'
  | 'awaiting_verification'
  | 'verified'
  | 'rework_required'

export type Severity = 'low' | 'moderate' | 'high' | 'urgent'

export interface Campus {
  id: string
  dataLabel: IllustrativeDataLabel
  name: string
  district: string
  isFictional: true
}

export interface Journey {
  id: string
  campusId: string
  dataLabel: IllustrativeDataLabel
  name: string
  origin: string
  destination: string
  checkpoints: string[]
  accessRequirement: string
}

export interface EvidenceItem {
  id: string
  dataLabel: IllustrativeDataLabel
  kind: 'illustrative_photo'
  path: string
  altText: string
  capturedAt: string
}

export interface GuidelineReference {
  source: string
  editionYear: number
  section: string
  checkType: 'screening'
}

export interface Barrier {
  id: string
  journeyId: string
  dataLabel: IllustrativeDataLabel
  category: 'obstructed_landing' | 'ramp_gradient' | 'directional_signage'
  title: string
  description: string
  campusZone: string
  severity: Severity
  status: BarrierStatus
  evidence: EvidenceItem[]
  observedAt: string
  guidelineReference?: GuidelineReference
}

export interface WorkOrder {
  id: string
  barrierId: string
  dataLabel: IllustrativeDataLabel
  ownerRole: string
  remedy: string
  costBand: string
  dueDate: string
  repairEvidence: EvidenceItem[]
}

export interface Verification {
  id: string
  barrierId: string
  workOrderId: string
  dataLabel: IllustrativeDataLabel
  decision: 'accepted' | 'rejected' | 'additional_inspection'
  definedTestConditions: string
  feedback?: string
  timestamp: string
}

export interface ActivityEvent {
  id: string
  barrierId: string
  dataLabel: IllustrativeDataLabel
  actorPerspective: 'auditor' | 'facilities' | 'verifier'
  fromStatus: BarrierStatus | null
  toStatus: BarrierStatus
  reason: string
  timestamp: string
}

export interface DemoState {
  schemaVersion: 1
  campus: Campus
  journeys: Journey[]
  barriers: Barrier[]
  workOrders: WorkOrder[]
  verifications: Verification[]
  activity: ActivityEvent[]
}

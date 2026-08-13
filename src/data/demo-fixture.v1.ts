import {
  illustrativeDataLabel,
  type DemoState,
} from '../domain/types'

export const fixtureIds = {
  campus: 'campus-saraswati-fictional',
  primaryJourney: 'journey-main-gate-admissions',
  primaryBarrier: 'barrier-obstructed-landing',
  rampBarrier: 'barrier-ramp-gradient',
  signageBarrier: 'barrier-directional-signage',
} as const

const fixture: DemoState = {
  schemaVersion: 1,
  campus: {
    id: fixtureIds.campus,
    dataLabel: illustrativeDataLabel,
    name: 'Saraswati Government College (fictional)',
    district: 'Haryana (fictional campus)',
    isFictional: true,
  },
  journeys: [
    {
      id: fixtureIds.primaryJourney,
      campusId: fixtureIds.campus,
      dataLabel: illustrativeDataLabel,
      name: 'Main gate to admissions',
      origin: 'Main gate',
      destination: 'Admissions office',
      checkpoints: ['Main gate', 'Approach ramp', 'Path junction', 'Admissions entrance'],
      accessRequirement: 'Step-free mobility access for this defined journey and test conditions',
    },
  ],
  barriers: [
    {
      id: fixtureIds.primaryBarrier,
      journeyId: fixtureIds.primaryJourney,
      dataLabel: illustrativeDataLabel,
      category: 'obstructed_landing',
      title: 'Landing narrowed by stored materials',
      description: 'A structured screening observation awaiting designated review; it is not a compliance finding.',
      campusZone: 'Main entrance zone',
      severity: 'high',
      status: 'observed',
      observedAt: '2026-08-10T09:30:00.000Z',
      evidence: [
        {
          id: 'evidence-obstructed-landing-before',
          dataLabel: illustrativeDataLabel,
          kind: 'illustrative_photo',
          path: '/media/obstructed-landing-before.jpg',
          altText: 'Stored materials narrow the level landing on the main gate to admissions route.',
          capturedAt: '2026-08-10T09:25:00.000Z',
        },
      ],
    },
    {
      id: fixtureIds.rampBarrier,
      journeyId: fixtureIds.primaryJourney,
      dataLabel: illustrativeDataLabel,
      category: 'ramp_gradient',
      title: 'Ramp gradient requires measurement review',
      description: 'A screening measurement is queued for designated review and is not a compliance determination.',
      campusZone: 'Main entrance zone',
      severity: 'moderate',
      status: 'observed',
      observedAt: '2026-08-10T09:40:00.000Z',
      evidence: [
        {
          id: 'evidence-ramp-screening',
          dataLabel: illustrativeDataLabel,
          kind: 'illustrative_photo',
          path: '/media/ramp-screening.jpg',
          altText: 'Ramp approach viewed from the lower landing for gradient screening.',
          capturedAt: '2026-08-10T09:39:00.000Z',
        },
      ],
    },
    {
      id: fixtureIds.signageBarrier,
      journeyId: fixtureIds.primaryJourney,
      dataLabel: illustrativeDataLabel,
      category: 'directional_signage',
      title: 'Admissions direction is not signed',
      description: 'A wayfinding screening observation remains in the backlog for designated review.',
      campusZone: 'Central path junction',
      severity: 'moderate',
      status: 'observed',
      observedAt: '2026-08-10T09:50:00.000Z',
      evidence: [
        {
          id: 'evidence-signage-missing',
          dataLabel: illustrativeDataLabel,
          kind: 'illustrative_photo',
          path: '/media/signage-missing.jpg',
          altText: 'Path junction has no directional sign pointing toward the admissions office.',
          capturedAt: '2026-08-10T09:49:00.000Z',
        },
      ],
    },
  ],
  workOrders: [],
  verifications: [],
  activity: [],
}

export function createDemoFixture(): DemoState {
  return structuredClone(fixture)
}

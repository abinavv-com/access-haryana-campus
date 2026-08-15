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
      guidelineReference: {
        source: 'Government of India — Accessibility Guidelines and Standards for Higher Education Institutions and Universities',
        editionYear: 2024,
        section: 'Demo reference: Section 6.2',
        checkType: 'screening',
      },
      evidence: [
        {
          id: 'evidence-obstructed-landing-before',
          dataLabel: illustrativeDataLabel,
          kind: 'illustrative_photo',
          path: '/media/tactile-paving-obstructed.jpg',
          altText: 'Illustrative example of tactile paving obstructed by street furniture and other objects.',
          capturedAt: '2026-08-10T09:25:00.000Z',
        },
        {
          id: 'evidence-shattered-tactile-tile',
          dataLabel: illustrativeDataLabel,
          kind: 'illustrative_photo',
          path: '/media/shattered-tactile-tile.jpg',
          altText: 'Illustrative example of a shattered tactile paving tile creating an uneven surface.',
          capturedAt: '2026-08-10T09:26:00.000Z',
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
      guidelineReference: {
        source: 'Government of India — Accessibility Guidelines and Standards for Higher Education Institutions and Universities',
        editionYear: 2024,
        section: 'Demo reference: Section 6.2',
        checkType: 'screening',
      },
      evidence: [
        {
          id: 'evidence-ramp-screening',
          dataLabel: illustrativeDataLabel,
          kind: 'illustrative_photo',
          path: '/media/accessible-entrance-ramp.jpg',
          altText: 'Illustrative example of an accessible entrance ramp viewed from its approach.',
          capturedAt: '2026-08-10T09:39:00.000Z',
        },
        {
          id: 'evidence-gradual-ramp-pathway',
          dataLabel: illustrativeDataLabel,
          kind: 'illustrative_photo',
          path: '/media/gradual-ramp-pathway.jpg',
          altText: 'Illustrative example of a long gradual pathway ramp leading to tactile paving and a curb cut.',
          capturedAt: '2026-08-10T09:40:00.000Z',
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
      guidelineReference: {
        source: 'Government of India — Accessibility Guidelines and Standards for Higher Education Institutions and Universities',
        editionYear: 2024,
        section: 'Demo reference: Section 6.2',
        checkType: 'screening',
      },
      evidence: [
        {
          id: 'evidence-signage-missing',
          dataLabel: illustrativeDataLabel,
          kind: 'illustrative_photo',
          path: '/media/accessibility-sign.jpg',
          altText: 'Illustrative example of an accessibility sign used for route wayfinding.',
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

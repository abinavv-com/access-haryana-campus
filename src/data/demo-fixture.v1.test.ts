import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

import { createDemoFixture, fixtureIds } from './demo-fixture.v1'

describe('createDemoFixture', () => {
  it('returns isolated mutable state for each caller', () => {
    const first = createDemoFixture()
    const second = createDemoFixture()

    expect(first).not.toBe(second)
    expect(first.campus).not.toBe(second.campus)
    expect(first.journeys).not.toBe(second.journeys)
    expect(first.journeys[0]).not.toBe(second.journeys[0])
    expect(first.barriers).not.toBe(second.barriers)
    expect(first.workOrders).not.toBe(second.workOrders)
    expect(first.verifications).not.toBe(second.verifications)
    expect(first.activity).not.toBe(second.activity)
    first.barriers.forEach((barrier, barrierIndex) => {
      expect(barrier).not.toBe(second.barriers[barrierIndex])
      expect(barrier.evidence).not.toBe(second.barriers[barrierIndex].evidence)
      barrier.evidence.forEach((item, evidenceIndex) => {
        expect(item).not.toBe(second.barriers[barrierIndex].evidence[evidenceIndex])
      })
    })

    first.campus.name = 'Changed campus'
    first.journeys[0].checkpoints.push('Changed checkpoint')
    first.barriers.forEach((barrier) => {
      barrier.title = 'Changed barrier'
      barrier.evidence[0].altText = 'Changed evidence'
    })
    first.workOrders.length = 1
    first.verifications.length = 1
    first.activity.length = 1

    expect(second.campus.name).toBe('Saraswati Government College (fictional)')
    expect(second.journeys[0].checkpoints).not.toContain('Changed checkpoint')
    expect(second.barriers.every(({ title }) => title !== 'Changed barrier')).toBe(true)
    expect(second.barriers.flatMap(({ evidence }) => evidence).every(({ altText }) => altText !== 'Changed evidence')).toBe(true)
    expect(second.workOrders).toHaveLength(0)
    expect(second.verifications).toHaveLength(0)
    expect(second.activity).toHaveLength(0)
  })

  it('contains the primary gate-to-admissions story and two backlog findings', () => {
    const state = createDemoFixture()
    const primaryJourney = state.journeys.find(({ id }) => id === fixtureIds.primaryJourney)
    const primaryBarrier = state.barriers.find(({ id }) => id === fixtureIds.primaryBarrier)

    expect(primaryJourney).toMatchObject({
      origin: 'Main gate',
      destination: 'Admissions office',
    })
    expect(primaryBarrier).toMatchObject({
      journeyId: fixtureIds.primaryJourney,
      category: 'obstructed_landing',
      status: 'observed',
    })
    expect(state.barriers.map(({ category }) => category)).toEqual([
      'obstructed_landing',
      'ramp_gradient',
      'directional_signage',
    ])
  })

  it('uses exported stable IDs across entity relationships', () => {
    const state = createDemoFixture()

    expect(fixtureIds).toEqual({
      campus: 'campus-saraswati-fictional',
      primaryJourney: 'journey-main-gate-admissions',
      primaryBarrier: 'barrier-obstructed-landing',
      rampBarrier: 'barrier-ramp-gradient',
      signageBarrier: 'barrier-directional-signage',
    })
    expect(state.campus.id).toBe(fixtureIds.campus)
    expect(state.journeys.every(({ campusId }) => campusId === fixtureIds.campus)).toBe(true)
    expect(state.barriers.every(({ journeyId }) => journeyId === fixtureIds.primaryJourney)).toBe(true)
  })

  it('seeds an exact bounded screening reference on every standards-related barrier', () => {
    const references = createDemoFixture().barriers.map(({ guidelineReference }) => guidelineReference)
    expect(references).toHaveLength(3)
    expect(references.every((reference) => reference?.source === 'Government of India — Accessibility Guidelines and Standards for Higher Education Institutions and Universities')).toBe(true)
    expect(references.every((reference) => reference?.editionYear === 2024 && reference.section === 'Demo reference: Section 6.2' && reference.checkType === 'screening')).toBe(true)
  })

  it('labels every record as illustrative demo data', () => {
    const state = createDemoFixture()
    const records = [state.campus, ...state.journeys, ...state.barriers]
    const evidence = state.barriers.flatMap((barrier) => barrier.evidence)

    expect(records.every(({ dataLabel }) => dataLabel === 'Illustrative demo data')).toBe(true)
    expect(evidence.every(({ dataLabel }) => dataLabel === 'Illustrative demo data')).toBe(true)
  })

  it('gives every evidence item decision-relevant alt text', () => {
    const evidence = createDemoFixture().barriers.flatMap((barrier) => barrier.evidence)

    expect(evidence.length).toBeGreaterThan(0)
    expect(evidence.every(({ altText }) => altText.trim().length >= 24)).toBe(true)
    expect(evidence.map(({ altText }) => altText)).toEqual([
      'Illustrative example of tactile paving obstructed by street furniture and other objects.',
      'Illustrative example of a shattered tactile paving tile creating an uneven surface.',
      'Illustrative example of an accessible entrance ramp viewed from its approach.',
      'Illustrative example of a long gradual pathway ramp leading to tactile paving and a curb cut.',
      'Illustrative example of an accessibility sign used for route wayfinding.',
    ])
  })

  it('resolves every evidence path through Vite public and attributes every evidence ID', () => {
    const evidence = createDemoFixture().barriers.flatMap((barrier) => barrier.evidence)
    const ledgerPath = resolve(process.cwd(), 'public/media/ATTRIBUTION.md')

    expect(evidence).toHaveLength(5)
    expect(existsSync(ledgerPath)).toBe(true)

    const ledger = readFileSync(ledgerPath, 'utf8')
    evidence.forEach(({ id, path }) => {
      expect(path).toMatch(/^\/media\/[^/]+\.(?:jpg|jpeg|png)$/i)
      expect(existsSync(resolve(process.cwd(), 'public', path.slice(1)))).toBe(true)
      expect(ledger).toContain(`\`${id}\``)
    })
  })
})

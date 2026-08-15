import { beforeEach, describe, expect, it, vi } from 'vitest'
import { createDemoFixture } from './demo-fixture.v1'
import { DEMO_STORAGE_KEY, loadDemoState, resetDemoState, saveDemoState } from './storage'

describe('demo storage', () => {
  beforeEach(() => localStorage.clear())

  it('round trips a valid v1 envelope', () => {
    const state = createDemoFixture()
    state.barriers[0].status = 'validated'
    expect(saveDemoState(state, localStorage, () => '2026-08-13T10:00:00Z')).toBe(true)
    expect(JSON.parse(localStorage.getItem(DEMO_STORAGE_KEY)!)).toMatchObject({
      schemaVersion: 1, savedAt: '2026-08-13T10:00:00Z', state,
    })
    expect(loadDemoState(localStorage)).toEqual({ state, warning: null })
  })

  it('uses a fresh fixture when the key is missing', () => {
    expect(loadDemoState(localStorage)).toEqual({ state: createDemoFixture(), warning: null })
  })

  it.each([
    ['corrupt JSON', '{'],
    ['unsupported version', JSON.stringify({ schemaVersion: 2, savedAt: 'now', state: createDemoFixture() })],
    ['malformed v1 state', JSON.stringify({ schemaVersion: 1, savedAt: 'now', state: { schemaVersion: 1 } })],
    ['invalid lifecycle value', (() => {
      const state = createDemoFixture() as unknown as { barriers: Array<{ status: string }> }
      state.barriers[0].status = 'certified'
      return JSON.stringify({ schemaVersion: 1, savedAt: 'now', state })
    })()],
  ])('falls back safely for %s', (_label, value) => {
    localStorage.setItem(DEMO_STORAGE_KEY, value)
    const result = loadDemoState(localStorage)
    expect(result.state).toEqual(createDemoFixture())
    expect(result.warning).toMatch(/could not be restored/i)
  })

  it('reports a write exception without changing the in-memory state', () => {
    const state = createDemoFixture()
    const storage = { ...localStorage, setItem: vi.fn(() => { throw new Error('quota') }) } as unknown as Storage
    expect(saveDemoState(state, storage)).toBe(false)
    expect(state).toEqual(createDemoFixture())
  })

  it('resets only demo records and preserves separate preferences', () => {
    localStorage.setItem(DEMO_STORAGE_KEY, 'saved demo')
    localStorage.setItem('access-haryana-campus.preferences', '{"reducedMotion":true}')
    expect(resetDemoState(localStorage)).toBe(true)
    expect(localStorage.getItem(DEMO_STORAGE_KEY)).toBeNull()
    expect(localStorage.getItem('access-haryana-campus.preferences')).not.toBeNull()
  })
})

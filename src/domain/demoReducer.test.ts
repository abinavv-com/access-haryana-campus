import { describe, expect, it } from 'vitest'
import { createDemoFixture } from '../data/demo-fixture.v1'
import type { WorkOrder } from './types'
import { demoReducer, type DemoAction } from './demoReducer'

const workOrder: WorkOrder = {
  id: 'wo-1', barrierId: 'barrier-obstructed-landing', dataLabel: 'Illustrative demo data',
  ownerRole: 'facilities-officer', remedy: 'Clear stored materials', costBand: 'low',
  dueDate: '2026-08-15', repairEvidence: [],
}

const assign: DemoAction = {
  type: 'APPLY_TRANSITION',
  command: {
    type: 'assign', barrierId: workOrder.barrierId, eventId: 'event-1',
    timestamp: '2026-08-13T08:00:00Z', actorPerspective: 'facilities',
    reason: 'Repair assigned.', workOrder,
  },
}

describe('demoReducer', () => {
  it('atomically updates the entity and appends its event', () => {
    const state = createDemoFixture()
    state.barriers[0].status = 'prioritised'
    const next = demoReducer(state, assign)

    expect(next).not.toBe(state)
    expect(next.barriers[0].status).toBe('assigned')
    expect(next.workOrders).toEqual([workOrder])
    expect(next.activity).toHaveLength(1)
    expect(state).toMatchObject({ workOrders: [], activity: [] })
  })

  it('returns the identical state when an action fails', () => {
    const state = createDemoFixture()
    const next = demoReducer(state, assign)
    expect(next).toBe(state)
  })

  it('resets to a fresh fixture without retaining mutations', () => {
    const state = createDemoFixture()
    state.barriers[0].status = 'verified'
    const reset = demoReducer(state, { type: 'RESET_DEMO' })
    expect(reset).toEqual(createDemoFixture())
    expect(reset).not.toBe(state)
  })

  it('derives verification trust only from the stored work order', () => {
    const state = createDemoFixture()
    state.barriers[0].status = 'awaiting_verification'
    state.workOrders.push({ ...workOrder, repairEvidence: [{
      id: 'after', dataLabel: 'Illustrative demo data', kind: 'illustrative_photo',
      path: '/after.jpg', altText: 'Landing after repair.', capturedAt: '2026-08-13T07:00:00Z',
    }] })
    const next = demoReducer(state, {
      type: 'APPLY_TRANSITION',
      command: {
        type: 'accept', barrierId: workOrder.barrierId, eventId: 'event-2',
        timestamp: '2026-08-13T09:00:00Z', actorPerspective: 'verifier',
        reason: 'Bounded journey completed.', verificationId: 'verification-1',
        testerRole: 'facilities-officer', consented: true,
        definedTestConditions: 'Dry daylight conditions.',
        repairOwnerRole: 'outside-contractor',
      } as DemoAction extends { command: infer C } ? C : never,
    })
    expect(next).toBe(state)
    expect(next.verifications).toHaveLength(0)
  })

  it('rejects an audit whose event does not describe the submitted observed barrier', () => {
    const state=createDemoFixture();const barrier={...state.barriers[0],id:'audit-new'}
    const mismatches=[
      {barrierId:'another-barrier',toStatus:'observed' as const,dataLabel:barrier.dataLabel},
      {barrierId:barrier.id,toStatus:'verified' as const,dataLabel:barrier.dataLabel},
      {barrierId:barrier.id,toStatus:'observed' as const,dataLabel:'Different label'},
    ]
    for(const mismatch of mismatches){const next=demoReducer(state,{type:'SUBMIT_AUDIT',barrier,event:{id:'event-new',actorPerspective:'auditor',fromStatus:null,reason:'Submitted.',timestamp:'2026-08-13T10:00:00Z',...mismatch} as DemoAction extends {type:'SUBMIT_AUDIT';event:infer E}?E:never});expect(next).toBe(state)}
  })
})

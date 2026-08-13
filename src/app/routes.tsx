import type { Dispatch } from 'react'
import type { DemoAction } from '../domain/demoReducer'
import type { DemoState } from '../domain/types'
import { AuditScreen } from '../screens/AuditScreen'
import { OverviewScreen } from '../screens/OverviewScreen'
import { BarrierScreen } from '../screens/BarrierScreen'
import { WorkOrderScreen } from '../screens/WorkOrderScreen'
export function RouteContent({state,dispatch}:{state:DemoState;dispatch:Dispatch<DemoAction>}){const path=window.location.pathname;const navigate=(next:string)=>{window.history.pushState({},'',next);window.dispatchEvent(new PopStateEvent('popstate'))};if(path==='/audit')return <AuditScreen state={state} dispatch={dispatch} navigate={navigate}/>;if(path.startsWith('/barriers/'))return <BarrierScreen state={state} dispatch={dispatch} barrierId={path.split('/').at(-1)!} navigate={navigate}/>;if(path.startsWith('/work-orders/'))return <WorkOrderScreen state={state} dispatch={dispatch} barrierId={path.split('/').at(-1)!}/>;return <OverviewScreen state={state} onStartAudit={()=>navigate('/audit')}/>}

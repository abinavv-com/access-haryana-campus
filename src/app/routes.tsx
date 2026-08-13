import type { Dispatch } from 'react'
import type { DemoAction } from '../domain/demoReducer'
import type { DemoState } from '../domain/types'
import { AuditScreen } from '../screens/AuditScreen'
import { OverviewScreen } from '../screens/OverviewScreen'
export function RouteContent({state,dispatch}:{state:DemoState;dispatch:Dispatch<DemoAction>}){const path=window.location.pathname;const navigate=(next:string)=>{window.history.pushState({},'',next);window.dispatchEvent(new PopStateEvent('popstate'))};return path==='/audit'?<AuditScreen state={state} dispatch={dispatch} navigate={navigate}/>:<OverviewScreen state={state} onStartAudit={()=>navigate('/audit')}/>}

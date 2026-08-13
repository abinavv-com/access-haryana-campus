import { useEffect,useReducer,useState } from 'react'
import { AppShell,type SimulatedRole } from '../components/AppShell'
import { createDemoFixture } from '../data/demo-fixture.v1'
import { demoReducer } from '../domain/demoReducer'
import { RouteContent } from './routes'
import '../styles/tokens.css';import '../styles/base.css';import '../styles/components.css'
const preferenceKey='access-haryana-campus.preferences'
function initialPreferences(){try{return JSON.parse(localStorage.getItem(preferenceKey)??'{}') as {reducedMotion?:boolean;largeText?:boolean;highContrast?:boolean}}catch{return {}}}
export function App(){const[state,dispatch]=useReducer(demoReducer,undefined,createDemoFixture);const[role,setRole]=useState<SimulatedRole>('auditor');const initial=initialPreferences();const[reducedMotion,setReducedMotion]=useState(initial.reducedMotion===true);const[largeText,setLargeText]=useState(initial.largeText===true);const[highContrast,setHighContrast]=useState(initial.highContrast===true);useEffect(()=>{document.documentElement.dataset.reducedMotion=String(reducedMotion);document.documentElement.dataset.textSize=largeText?'large':'default';document.documentElement.dataset.highContrast=String(highContrast);try{localStorage.setItem(preferenceKey,JSON.stringify({reducedMotion,largeText,highContrast}))}catch{/* Preferences remain usable for this session. */}},[reducedMotion,largeText,highContrast]);return <AppShell state={state} dispatch={dispatch} role={role} onRoleChange={setRole} reducedMotion={reducedMotion} onReducedMotionChange={setReducedMotion} largeText={largeText} onLargeTextChange={setLargeText} highContrast={highContrast} onHighContrastChange={setHighContrast}><RouteContent/></AppShell>}

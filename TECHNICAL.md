# Technical Specification — Access Haryana Campus

Complete technical documentation for developers and operators.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│           React 19.2 + TypeScript 7.0               │
│                                                     │
│  ┌─────────────────────────────────────────────┐  │
│  │ UI Layer (Screens & Components)             │  │
│  │ - OverviewScreen, AuditScreen, etc.         │  │
│  │ - AppShell (header, sidebar, layout)        │  │
│  │ - Reusable components (cards, inputs, etc.) │  │
│  └──────────────────┬──────────────────────────┘  │
│                     │                               │
│  ┌──────────────────▼──────────────────────────┐  │
│  │ State Management (Context + Reducer)        │  │
│  │ - demoReducer handles all state changes     │  │
│  │ - AppContext provides state to all screens  │  │
│  │ - useAppContext hook for easy access        │  │
│  └──────────────────┬──────────────────────────┘  │
│                     │                               │
│  ┌──────────────────▼──────────────────────────┐  │
│  │ Domain Logic (Business Rules)               │  │
│  │ - types.ts: TypeScript interfaces           │  │
│  │ - workflow.ts: Workflow rules & transitions │  │
│  │ - calculations.ts: Metrics computation      │  │
│  │ - validation.ts: Form & data validation     │  │
│  └──────────────────┬──────────────────────────┘  │
│                     │                               │
│  ┌──────────────────▼──────────────────────────┐  │
│  │ Data Layer (LocalStorage)                   │  │
│  │ - Case state: access-haryana-campus:case    │  │
│  │ - Preferences: access-haryana-campus:prefs  │  │
│  │ - Auto-save on every state change           │  │
│  └─────────────────────────────────────────────┘  │
│                                                     │
└─────────────────────────────────────────────────────┘
        │
        ↓ (Deployment)
┌─────────────────────────────────────────────────────┐
│              Vercel (Serverless)                    │
│                                                     │
│ - SPA Routing (vercel.json rewrites)               │
│ - Edge caching (12 months for versioned assets)    │
│ - Automatic HTTPS                                  │
│ - Global CDN                                       │
└─────────────────────────────────────────────────────┘
```

---

## 📦 Tech Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Language** | TypeScript | 7.0 | Type safety, IDE support |
| **Runtime** | Node.js | 18+ | Build & deployment |
| **Framework** | React | 19.2 | UI rendering |
| **Build Tool** | Vite | 8.2 | Fast development & production builds |
| **Testing** | Vitest | 4.1 | Unit & integration tests |
| **Test Utils** | React Testing Library | 16.3 | Component testing |
| **DOM Simulation** | jsdom | 26.1 | Test environment |
| **Styling** | CSS | (native) | No CSS-in-JS, BEM methodology |
| **Deployment** | Vercel | (latest) | Serverless hosting |
| **State** | React Context + Hooks | (built-in) | No external state library |
| **Storage** | Browser LocalStorage | (API) | Persistent demo state |

---

## 🏃 Development Commands

```bash
# Start local dev server (http://localhost:5173)
npm run dev

# Build for production (outputs to dist/)
npm run build

# Run tests once
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Type check without running build
npx tsc --noEmit

# Preview production build locally
npm run preview
```

---

## 📂 File Organization

### `src/app/`
- **App.tsx**: Root component, sets up context provider and routing
- **routes.tsx**: Screen routing logic (maps `state.screen` to component)
- **App.test.tsx**: App-level integration tests

### `src/screens/`
Each file is a full-page screen component:
- **OverviewScreen.tsx**: Command centre, evidence chain, next actions
- **AuditScreen.tsx**: Guided barrier discovery
- **BarrierScreen.tsx**: Barrier record details
- **WorkOrderScreen.tsx**: Facilities work order management
- **VerificationScreen.tsx**: Independent accessibility retest
- **ImpactScreen.tsx**: Impact metrics and reporting

### `src/components/`
Reusable UI components:
- **AppShell.tsx**: Header, sidebar, main layout container
- **LifecycleRail.tsx**: 6-stage evidence chain visualization
- **StatusBadge.tsx**: Status indicators
- **MetricCard.tsx**: Data metric cards
- **ErrorSummary.tsx**: Form error display
- **ActivityTimeline.tsx**: Action history log
- **EvidenceImage.tsx**: Image + measurement display

### `src/domain/`
Business logic (no React dependencies):
- **types.ts**: TypeScript interfaces (Barrier, WorkOrder, Verification, etc.)
- **demoReducer.ts**: State reducer handling all actions
- **workflow.ts**: Workflow rules and state transitions
- **calculations.ts**: Computed metrics (repair count, success rate, etc.)
- **validation.ts**: Form validation and data validation rules

### `src/data/`
Demo data and storage:
- **demo-fixture.v1.ts**: Hardcoded fictional demo data (barriers, work orders, verifications)
- **storage.ts**: LocalStorage read/write utilities
- **demo-fixture.v1.test.ts**: Fixture validation tests
- **storage.test.ts**: Storage persistence tests

### `src/test/`
Test setup:
- **setup.ts**: Test environment configuration

### Root Files
- **package.json**: Dependencies, scripts, metadata
- **tsconfig.json**: TypeScript compiler options
- **vite.config.ts**: Vite build configuration
- **vercel.json**: Vercel deployment config (SPA routing rules)
- **index.html**: HTML entry point

---

## 🧠 State Management

### Architecture

No external library (Redux, Zustand, etc.). Uses React's built-in Context + useReducer:

```typescript
// src/app/App.tsx
const [state, dispatch] = useReducer(demoReducer, initialState);
<AppContext.Provider value={{state, dispatch}}>
  {/* All child components access state via useAppContext() */}
</AppContext.Provider>
```

### Data Model (State Shape)

```typescript
interface CaseState {
  barriers: Barrier[];           // List of identified barriers
  workOrders: WorkOrder[];       // Facilities repairs
  verifications: Verification[]; // Retest results
  activity: Activity[];          // Action audit trail
  screen: 'overview' | 'audit' | 'barrier' | 'work-order' | 'verification' | 'impact';
  currentBarrierId?: string;     // Selected barrier
  preferences: {
    textSize: number;            // 100, 120, 150 (%)
    highContrast: boolean;
    reduceMotion: boolean;
  };
}

interface Barrier {
  id: string;
  journey: string;               // e.g. "Main gate → Admissions"
  location: string;              // Campus location
  description: string;
  standard: string;              // WCAG 2.1 reference
  immediateHazard: boolean;
  priority: 'low' | 'medium' | 'high';
  evidence: Evidence[];
  createdDate: Date;
  validatedDate?: Date;
}

// ... (see PRODUCT_DOCUMENTATION.md for full data model)
```

### State Mutation (Reducer Actions)

All state changes go through the reducer:

```typescript
// Dispatch actions from any screen
dispatch({
  type: 'SUBMIT_AUDIT_BARRIER',
  payload: { /* barrier data */ }
});

dispatch({
  type: 'VERIFY_REPAIR',
  payload: { /* verification result */ }
});

// Reducer processes actions and returns new state
function demoReducer(state, action) {
  switch (action.type) {
    case 'SUBMIT_AUDIT_BARRIER':
      return {
        ...state,
        barriers: [...state.barriers, newBarrier],
        activity: [...state.activity, logEntry]
      };
    // ...
  }
}
```

### Persistence

Every state change is auto-saved to LocalStorage:

```typescript
// src/data/storage.ts
useEffect(() => {
  saveCaseState(state);
}, [state]);

// Restore on page load
const savedState = loadCaseState();
if (savedState) {
  setInitialState(savedState);
}
```

**Storage Keys**:
- `access-haryana-campus:case` — Full case state (barriers, work orders, verifications)
- `access-haryana-campus:prefs` — User preferences (text size, contrast, motion)

---

## 🎨 Styling

### Approach
- **No CSS-in-JS** (no styled-components, Emotion, etc.)
- **Plain CSS** with **BEM** (Block Element Modifier) methodology
- Single stylesheet (`src/app/App.css` or similar)
- Utility classes for common patterns

### Example

```css
/* BEM naming: .block__element--modifier */
.audit-screen { }
.audit-screen__form { }
.audit-screen__form-input { }
.audit-screen__form-input--error { }
.audit-screen__submit-button { }
.audit-screen__submit-button:hover { }
```

### Responsive Breakpoints

```css
/* Mobile first */
.component { /* 0-640px (mobile) */ }

@media (min-width: 641px) {
  .component { /* tablet and up */ }
}

@media (min-width: 1024px) {
  .component { /* desktop and up */ }
}
```

---

## ✅ Testing Strategy

### Test Structure

```
src/
├── app/App.test.tsx              # Integration tests
├── screens/overview-audit.test.tsx
├── screens/barrier-work-order.test.tsx
├── screens/verification-impact.test.tsx
├── components/...test.tsx
├── domain/calculations.test.ts   # Unit tests
├── domain/demoReducer.test.ts
├── domain/validation.test.ts
├── domain/workflow.test.ts
└── data/demo-fixture.v1.test.ts
```

### Test Types

**Unit Tests** (Business Logic)
- `demoReducer.test.ts`: Reducer actions and state transitions
- `calculations.test.ts`: Metric computations
- `validation.test.ts`: Form validation rules
- `workflow.test.ts`: Workflow state transitions

**Integration Tests** (User Journeys)
- `overview-audit.test.tsx`: Full audit workflow
- `barrier-work-order.test.tsx`: Barrier → Work Order transition
- `verification-impact.test.tsx`: Verification → Impact flow

**Component Tests**
- Screen and component rendering
- User interactions (clicks, form inputs)
- State changes and side effects

### Running Tests

```bash
# All tests
npm test

# Watch mode (re-run on file changes)
npm test -- --watch

# Coverage report
npm test -- --coverage

# Specific file
npm test -- app/App.test.tsx
```

---

## 🚀 Deployment

### Vercel

**Production URL**: https://011-access-haryana-campus.vercel.app

#### Setup (One-Time)

```bash
# Install Vercel CLI
npm install -g vercel

# Link project to Vercel account
vercel

# This creates .vercel/project.json with project ID
```

#### Deployment

```bash
# Deploy to production (alias domain)
vercel deploy --prod --yes

# This builds with `npm run build` and deploys dist/ to Vercel
```

#### Verification

```bash
# View deployment URL and logs
vercel ls

# Inspect specific deployment
vercel inspect <deployment-url>

# View production logs
vercel logs <production-url>
```

### Vercel Configuration

**File**: `vercel.json`

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
```

This enables **SPA routing** — all requests route to `index.html`, where React Router handles the path.

### Build Process

1. User/CI runs `vercel deploy --prod`
2. Vercel pulls latest code from GitHub
3. Runs `npm run build` (TypeScript + Vite)
4. Outputs to `dist/` directory
5. Uploads `dist/` to Vercel's global CDN
6. Assigns URL and SSL certificate
7. Redirects alias domain to latest deployment

**Build Time**: ~3-5 minutes total

**Output Size**:
- JS: 255 kB → 75.6 kB gzipped
- CSS: 41.8 kB → 8.08 kB gzipped
- HTML: ~0.4 kB

### Environment Variables

No environment variables needed for demo. If adding secrets (API keys, etc.):

```bash
# Set a secret
vercel env add MY_API_KEY

# Deploy (picks up new env vars)
vercel deploy --prod
```

---

## 📊 Performance

### Metrics (Current)

| Metric | Value | Notes |
|--------|-------|-------|
| **Lighthouse (Mobile)** | 90+ | Target: 90+ |
| **Lighthouse (Desktop)** | 95+ | Target: 95+ |
| **Core Web Vitals** | Good | LCP <2.5s, FID <100ms, CLS <0.1 |
| **Bundle (Gzipped)** | ~84 kB | JS 75.6 kB + CSS 8.08 kB |
| **Time to Interactive** | <2s | On 4G throttled connection |
| **State Restore** | <100ms | From LocalStorage |

### Optimization Strategies

1. **Code Splitting**: Vite automatically handles this
2. **Lazy Loading**: Images use `loading="lazy"` attribute
3. **Caching**: Vercel caches versioned assets for 12 months
4. **Minification**: Vite minifies JS/CSS in production
5. **Tree Shaking**: Vite removes unused code
6. **Component Memoization**: React.memo where needed

---

## 🔐 Security

### No Backend = No Auth

This is a **frontend-only demo**. No authentication or authorization.

If deploying for real users:
1. Add backend API with authentication
2. Use OAuth 2.0 or similar
3. Implement role-based access control (RBAC)
4. Encrypt sensitive data in transit (HTTPS) and at rest

### Current Safeguards

- ✅ HTTPS enforced by Vercel
- ✅ No sensitive data stored (all fictional)
- ✅ LocalStorage only for demo state (not production-grade)
- ✅ No external API calls
- ✅ XSS protection via React's default escaping

### For Production

1. Add real database (PostgreSQL, MongoDB, etc.)
2. Implement API authentication (JWT, session cookies)
3. Add CORS policies
4. Implement RBAC (Admin, Auditor, Facilities, Verifier roles)
5. Encrypt sensitive fields in database
6. Add audit logging for compliance
7. Set up security headers (CSP, X-Frame-Options, etc.)

---

## 🐛 Debugging

### Browser DevTools

1. Press `F12` to open DevTools
2. **Console tab**: Check for errors/warnings
3. **Network tab**: Monitor API calls (none for demo)
4. **Storage tab**: Inspect LocalStorage under `access-haryana-campus:*` keys
5. **React DevTools**: Install React DevTools extension to inspect component tree

### Local Logging

Add console logs in reducer:

```typescript
case 'SUBMIT_AUDIT_BARRIER':
  console.log('Submitting barrier:', action.payload);
  return newState;
```

### React DevTools Extension

```bash
# Install extension from Chrome/Firefox store
# Or dev mode setup:
```

In `App.tsx`:
```typescript
if (import.meta.env.DEV) {
  window.__APP_STATE__ = state; // Inspect in console
}
```

---

## 📝 TypeScript Notes

### Strict Mode

TypeScript is configured with strict mode enabled:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

**All types must be explicit.** No `any` without justification.

### Common Types

```typescript
// Domain types
type ScreenName = 'overview' | 'audit' | 'barrier' | 'work-order' | 'verification' | 'impact';
type Priority = 'low' | 'medium' | 'high';
type BarrierStatus = 'observed' | 'validated' | 'prioritised' | 'assigned' | 'fixed' | 'verified';

// State types
type AppAction = 
  | { type: 'SUBMIT_AUDIT_BARRIER'; payload: Barrier }
  | { type: 'VERIFY_REPAIR'; payload: Verification }
  | // ... more actions
```

---

## 🔄 CI/CD (Optional)

To set up automated testing/deployment:

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Build & Deploy
on:
  push:
    branches: [master]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm test
      - run: npm run build
  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

Then set GitHub secrets:
```
VERCEL_TOKEN: <vercel token>
VERCEL_ORG_ID: <org id>
VERCEL_PROJECT_ID: <project id>
```

---

## 📞 Support

- **Vercel Docs**: https://vercel.com/docs
- **React Docs**: https://react.dev
- **TypeScript Docs**: https://www.typescriptlang.org/docs
- **Vite Docs**: https://vitejs.dev
- **GitHub Issues**: Report bugs or ask questions

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 0.0.0 | Aug 21, 2026 | Initial release (Ideathon demo) |

---

Last Updated: **August 21, 2026**

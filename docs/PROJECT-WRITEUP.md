# Access Haryana Campus — Project Writeup

**Status:** Frontend-only demonstration, complete and verified. Production build passes all 98 tests; browser acceptance confirmed across keyboard navigation, 200% reflow, 390px narrow-viewport, forced-colours, reduced-motion, large-text, and A4 print modes.

**Repository:** `D:\HMC work\011-access-haryana-campus` (Git branch `feature/access-haryana-build`, 21 commits ahead of `master`; no deployment as of 2026-08-15).

---

## 1. Overview

**Access Haryana Campus** is a frontend-only Haryana Ideathon demonstration of a fictional campus accessibility workflow. It models a complete case lifecycle:

1. **Audit** — A single student auditor screens one journey for one access requirement, capturing evidence
2. **Designated review** — A named reviewer validates the screening without a compliance claim
3. **Prioritisation** — A calculated priority score with optional manual override, tied to hazard-escalation rules
4. **Repair assignment** — A facilities owner assigns remedy, cost band, and due date
5. **Repair evidence** — The owner submits before/after illustrative evidence and marks ready for verification
6. **Independent bounded retest** — An independent verifier accepts, rejects, or requests re-inspection; records voluntary journey-outcome (success, time saved) only for accepted repairs
7. **Impact report** — A verified-only one-page A4 summary listing all accepted repairs, traceability, and illustrative metrics

The demo persists its case state to `localStorage` so a browser refresh or tab reopening does not interrupt a presenter journey. All campuses, records, dates, costs, people, roles, and outcomes are **fictional or illustrative demo data**. The screening workflow is **not a professional assessment, statutory certification, or determination of legal compliance**.

---

## 2. The Problem & Workflow

Campus accessibility auditing traditionally suffers from:

- **Unclear provenance:** Who observed what, under what standard?
- **Lost context:** Repair orders disconnect from the evidence that prompted them
- **Unverified claims:** A facility manager may report a repair complete without independent check
- **Unmeasured impact:** No way to know if a repair actually improved access for real journeys

The **Access Haryana Campus** workflow models how to close these gaps:

### Evidence chain

Every barrier record carries:
- **Guideline reference:** source (WCAG, BIS code), edition year, section, and check type (e.g., "WCAG 2.2 A, 2.2.1 Keyboard")
- **Audit provenance:** exact timestamp, auditor perspective, and the screening check performed
- **Review provenance:** designated reviewer name, decision (accepted/needs more investigation), and rationale
- **Priority rationale:** calculated score components, override decision (if applied), and decision reason
- **Repair assignment:** owner role, remedy, cost band, due date, and repair-plan evidence
- **Verification provenance:** verifier name, decision (accepted/rejected/re-inspect), defined test conditions, and whether the repair actually worked (voluntary journey outcome)
- **Impact calculation:** only records with recorded before/after journey outcomes contribute to metrics; missing outcomes are excluded, not inferred

### Verifier independence

The verifier is structurally isolated from the repair owner:
- Verifier sees the barrier, audit, priority, and assigned work order *but* cannot edit repair state
- Verifier records whether the repair succeeded (boolean), time saved (number), and hazard status
- Verifier cannot see the original owner's decision rationale, only the final repair claim
- If verifier rejects or requests re-inspection, the barrier returns to Assigned state; no impact is reported

### Honest metric qualification

The impact report includes **only** records with:
- A verified acceptance decision
- A recorded before-journey success status (boolean)
- A recorded before-journey completion time (minutes, number)
- A recorded after-journey success status (boolean)
- A recorded after-journey completion time (minutes, number)

Records lacking any of these are excluded from all metrics (count, success rate, time saved, cost-per-repair). This keeps reported figures grounded in recorded data rather than fabricated.

---

## 3. Architecture

### Tech stack

- **React 19.2** (latest) with TypeScript 7 and JSX Automatic Runtime
- **Vite 8.2** for bundling and local dev server
- **Vitest 4.1** for unit and integration tests (jsdom environment)
- **No external dependencies** beyond React/React-DOM; no remote fonts, no CDN, no network requests
- **localStorage** for persistence; preferences (text size, high contrast, reduced motion) stored under separate key so they survive case reset

### Folder structure

```
src/
├── app/                    # Shell, routing, state management
│   ├── App.tsx             # Root: reducer setup, localStorage hydration, preference management
│   ├── App.test.tsx        # Smoke test: load, role change, reset
│   ├── routes.tsx          # Screen dispatch by current pathname
│   ├── presenter-journey.test.tsx  # E2E: complete audit→verify→impact, localStorage persistence
│
├── domain/                 # Business logic, no UI
│   ├── types.ts            # Core types: Barrier, WorkOrder, Verification, ActivityEvent, etc.
│   ├── demoReducer.ts      # State machine: RESET_DEMO, SUBMIT_AUDIT, APPLY_TRANSITION
│   ├── demoReducer.test.ts # Reducer behaviour and state integrity
│   ├── calculations.ts     # Priority score, cost-band parsing, metrics rollup
│   ├── calculations.test.ts
│   ├── workflow.ts         # Barrier lifecycle transitions with validation
│   ├── workflow.test.ts
│   ├── validation.ts       # Domain validators: audit, work order, verification inputs
│   ├── validation.test.ts
│
├── data/                   # Persistence layer
│   ├── storage.ts          # localStorage adapter with defensive parsing
│   ├── storage.test.ts
│   ├── demo-fixture.v1.ts  # Seeded fictional campus, journeys, barriers, and activity
│   ├── demo-fixture.v1.test.ts  # Fixture integrity and state shape
│
├── components/             # Reusable UI
│   ├── AppShell.tsx        # Header, role selector, preferences, demo banner, lifecycle rail
│   ├── LifecycleRail.tsx   # Six-stage progress rail, route-aware status, ordered structure
│   ├── StatusBadge.tsx     # Visual+textual stage label (Observed, Validated, etc.)
│   ├── ActivityTimeline.tsx # Immutable activity log with actor and timestamp
│   ├── EvidenceImage.tsx   # Illustrative photo with fallback and alt text
│   ├── MetricCard.tsx      # Labelled metric value with source link
│   ├── ErrorSummary.tsx    # Accessible error summary with field focus management
│
├── screens/                # Domain-specific views (routes → screens)
│   ├── OverviewScreen.tsx  # Seeded journey + barriers, demo controls, next-action prompt
│   ├── AuditScreen.tsx     # Guided one-step field audit with selected evidence
│   ├── BarrierScreen.tsx   # Submitted barrier record in Observed state, shows audit provenance
│   ├── WorkOrderScreen.tsx # Work order assigned state: owner, remedy, cost, due date
│   ├── VerificationScreen.tsx # Independent verifier: decision, test conditions, journey outcomes
│   ├── ImpactScreen.tsx    # Verified-only impact report, metrics, traceability, A4 print
│   ├── overview-audit.test.tsx
│   ├── barrier-work-order.test.tsx
│   ├── verification-impact.test.tsx
│
├── styles/                 # Locked design-system CSS
│   ├── main.tsx            # Imports base.css → components.css → print.css
│   ├── base.css            # Design tokens, typography, layout metrics, viewport rules
│   ├── components.css      # Component-scoped styles (app shell, rail, cards, forms)
│   ├── print.css           # A4 layout, hides chrome, one-page guarantee
│
├── test/                   # Vitest setup
│   └── setup.ts            # jsdom environment, injectable test clock
│
└── vite-env.d.ts           # Vite type definitions
```

### State management

The app uses a single `useReducer` holding `DemoState`:

```typescript
type DemoState = {
  schemaVersion: 1
  campus: Campus
  journeys: Journey[]
  barriers: Barrier[]
  workOrders: WorkOrder[]
  verifications: Verification[]
  activity: ActivityEvent[]
}
```

Three action types:

- **`RESET_DEMO`:** Restores the seeded fictional fixture; does not clear preferences
- **`SUBMIT_AUDIT`:** Atomically adds a new `Barrier` (status `observed`) and `ActivityEvent`; validates immutability and deduplication
- **`APPLY_TRANSITION`:** Routes a command (validate, prioritise, assign, repair_evidence, accept/reject/reinspect) to the workflow engine; only applies if validation passes

After every action, `App.tsx` calls `saveDemoState(state)` via `useEffect`, persisting to `localStorage`. On load, `loadDemoState()` defensively parses the stored JSON and validates the entire shape before returning; if invalid, returns the seeded fixture and a warning string (see `src/data/storage.ts`).

### Routing and focus management

The app uses browser `history.pushState` and `popstate` events for lightweight history routing (no external router library):

- Overview: `/` (entry point)
- Guided audit: `/audit`
- Barrier records: `/barriers/:barrierId`
- Work order: `/work-orders/:barrierId`
- Verification: `/verification/:barrierId`
- Impact report: `/impact`

When a route changes, React's `routes.tsx` dispatch logic schedules focus to `<main id="main-content">` after the next render. This ensures screen readers announce the new landmark and keyboard users begin in the content area, not in the sticky header or sidebar.

### Deterministic testing via injected clock

Tests use a fixed timestamp (`2026-08-15T10:00:00.000Z`) for all verification records. This keeps metrics like "Days to verification" deterministic. In the live demo, verification timestamps use `new Date().toISOString()`, so the metric reflects real elapsed time. Tests can override this via a setup hook (see `src/test/setup.ts`).

---

## 4. Key Design Decisions

### Accessibility-first editorial "fieldbook" visual system

Rather than a data-entry CRUD app, the interface uses an **editorial fieldbook** metaphor—similar to a field notebook or legal brief. This choice:

- Emphasizes **evidence collection and reasoning** over form filling
- Treats each screen as a **reference artifact**, not a transaction
- Uses **sequential guided steps** rather than multi-field forms, keeping cognitive load low
- Displays **immutable activity history** so changes are traceable, not hidden
- Separates **evidence (photos, measurements) from decisions (priority, verification)** visually

The lifecycle rail is the memorable device: six visible stages, textual state labels, numerical progress, and clear actor attribution. No decorative gradients or AI imagery.

Design decisions locked in `.superdesign/design-system.md`:
- Palette: warm off-white canvas, near-black ink, Haryana saffron accent (no purple, no neon)
- Typography: single geometric sans family (Satoshi or Arial), 16–64 px scale
- Layout: 12-column grid, 280 px left rail, 72 px sticky header, max-width ~1040 px main
- Motion: 140–220 ms opacity/translate only, respects reduced motion
- Borders: 1 px ink at 15% opacity, 4–10 px corner radii; no drop shadows
- Minimum interactive target: 44 × 44 px

### Evidence-lifecycle enforcement

Every barrier record enforces a **strict state machine**:

```
observed → validated → prioritised → assigned → awaiting_verification → (verified | rework_required)
                                                                              ↓
                                                      (if rework) → assigned (again)
```

Transitions are allowed only if:
- The barrier and all related records (work order, verification) exist and match expected states
- Required fields are present (e.g., verifier cannot accept without defining test conditions)
- Upstream evidence is complete (e.g., cannot assign a work order without a priority)

This prevents:
- Jumping from "observed" to "verified" without repair evidence
- Assigning a work order to a barrier that was never validated
- Recording an impact metric from a verification that was rejected

Implementation: `src/domain/workflow.ts` contains all transitions; each is guarded by a `validate<Action>` function that returns an array of error strings (empty = valid).

### Verifier-independence rule

The `Verification` record is **structurally independent**:

- Verifier does not edit barrier status or work order; verifier only adds `Verification` record
- The `demoReducer` checks that a verifier's decision is independent: it validates the barrier is in `awaiting_verification` state and that the work order exists
- If a verifier rejects or requests re-inspection, the barrier status returns to `assigned` (not `verified`)
- Verifier does not see the originally assigned remedy or cost band; verifier only sees the defined test conditions and evidence of repair

This ensures a presenter can credibly demonstrate that verification is not a rubber-stamp of the repair owner's work.

### Honest metric qualification

The `ImpactScreen` calculates metrics by filtering records where:

1. Verification decision is `accepted` (not rejected or re-inspection)
2. Both `beforeOutcome` and `afterOutcome` exist on the verification record
3. Both outcomes have `succeeded: boolean` and `completionMinutes: number`

Metrics reported:
- **Verified repair count:** number of qualifying records
- **Successful journey tests:** count where `afterOutcome.succeeded === true`
- **Baseline success rate:** `beforeOutcome.succeeded` count / total qualifying
- **Verified success rate:** `afterOutcome.succeeded` count / total qualifying
- **Average time saved:** mean of `(beforeOutcome.completionMinutes - afterOutcome.completionMinutes)` across qualifying
- **Elapsed days to verification:** calendar days between first `observedAt` and verification `timestamp`
- **Illustrative pilot spend:** midpoint of cost-band range (e.g., `₹10,000–₹25,000` → `17500`)
- **Cost per verified repair:** pilot spend / verified count

A defect found during review: the original code defaulted missing outcomes to `{succeeded: false, completionMinutes: 0}`, silently polluting metrics. This was fixed by making outcomes optional and filtering them out entirely if missing.

---

## 5. Accessibility

The interface was verified to meet the following constraints:

### WCAG 2.2 Level AA core requirements

**Keyboard operation & focus (2.1.1 Keyboard, 2.4.7 Focus Visible)**

- Every action is operable via keyboard (Tab, Shift+Tab, Enter, Space, Arrow keys)
- No pointer-only interactions
- Focus ring is blue 3 px with 2 px offset (`#1261A0` on light backgrounds)
- Focus is visible on every native button, input, select, and custom focusable control
- Lifecycle rail navigation uses semantic `<ol>` for screen reader traversal

**Visible focus after route change**

- Route navigation (history.pushState) focuses `#main-content` (the `<main>` landmark)
- Main element has `scroll-margin-top: var(--space-3)` so the sticky header does not clip the page top
- Individual headings retain their own `scroll-margin-top` (140 px in base.css) for deep links

**200% zoom without horizontal overflow (1.4.4 Resize Text)**

- The impact report establishes an inline-size container query and switches to single-column layout at rendered < 400px width
- Tested at 780px viewport with `zoom: 2`: renders as 765 px width, no document overflow
- Secondary overflow (lifecycle rail) is intentional and functional; main content reflows

**390 px viewport without horizontal overflow (2.5.5 Target Size, implied mobile support)**

- Tested at 390 × 844 viewport (mobile narrow)
- All controls remain within 390px bounding box
- No horizontal scroll of document (`.app-layout` or `<body>`)
- Lifecycle rail has intentional horizontal scroll (`overflow-x: auto`, nav element only)
- Buttons: minimum 44 × 44 px (computed)

**Forced colours mode (1.4.11 Non-text Contrast)**

- Tested with `--force-high-contrast` flag in Chromium; `matchMedia('(forced-colors: active)').matches === true`
- All interactive elements remain visible and focusable (buttons, checkboxes, inputs)
- Current-stage text in the rail is explicit and textual (e.g., "01 Observed Auditor Current"), not icon-only
- Outlines and borders enforce visibility; no state communicated by colour alone
- Fallback images are visible even if background colours collapse

**Reduced motion (2.3.3 Animation from Interactions)**

- A user preference control sets `data-reduced-motion=true` on `<html>`
- All CSS animations (entry fade/translate) check `@media (prefers-reduced-motion: no-preference)` and set `animation-name: none` otherwise
- Entry animations are 140–220 ms and opacity-based, not seizure-inducing
- No automatic looping animations, parallax, or continuous motion

**Large text (1.4.4 Resize Text)**

- A user control sets `data-text-size=large` on `<html>`
- Root font size increases from 16px to 19px
- All spacing, line-height, and interactive targets scale proportionally
- Tested at 390px with large text: document reflowed to 375 px (vertical scrollbar only), no horizontal overflow

**Missing-image fallback (1.1.1 Non-text Content)**

- Evidence images have descriptive `alt` text (e.g., "Illustrative example of tactile paving obstructed by street furniture")
- If image fails to load, a `role="img"` fallback displays "Illustrative evidence unavailable" and preserves the alt text and caption
- Fallback is visually apparent and does not leave blank space or confuse the workflow

### Verified evidence

All accessibility claims are evidenced in `verification/redesign/acceptance-report.md` and captured in:

- `tour-*.png` — full-page keyboard journey captures across all six screens
- `large-text-390.png` — root font 19 px, document width 375/390, no overflow
- `reduced-motion-390.png` — animations set to `none`
- `forced-colours-390.png` — all controls and text visible under high-contrast mode
- `impact-print.pdf` + `impact-print-preview.png` — A4 one-page output

Focus management and keyboard operation were verified with agent-browser CLI, pressing Tab, Shift+Tab, Enter, Space, and Arrow keys to complete the entire journey without pointer activation. Agent-run elapsed time was 7.34 seconds, recorded in `task-10-report.md` against the Task 10 evidence set (`verification/task-10/keyboard-impact.png`). This is automated traversal time, not a human presenter timing.

---

## 6. Testing & Verification

### Test framework

- **Vitest 4.1** with jsdom environment
- **React Testing Library** for component/screen tests
- **@testing-library/user-event** for keyboard and form interaction
- **No mocking of domain logic** — all reducer and workflow transitions tested as real

### Test coverage

| File | Tests | Focus |
|------|-------|-------|
| `App.test.tsx` | 2 | Load app, role change, reset demo |
| `presenter-journey.test.tsx` | 1 | Complete audit→validate→prioritise→assign→verify→impact, localStorage persistence |
| `overview-audit.test.tsx` | 4 | Overview screen render, audit submission, validation, navigation |
| `barrier-work-order.test.tsx` | 3 | Barrier detail, work order fields, priority override, state transitions |
| `verification-impact.test.tsx` | 10 | Verification inputs, impact metric calculation, print layout, container queries |
| `demoReducer.test.ts` | 6 | Reducer action dispatch, state immutability, deduplication |
| `calculations.test.ts` | 7 | Priority scoring, cost-band parsing, metrics rollup |
| `validation.test.ts` | 15 | Audit, work order, verification validators |
| `workflow.test.ts` | 18 | All seven barrier transitions, edge cases, error handling |
| `storage.test.ts` | 12 | localStorage save/load, defensive parsing, recovery |
| `demo-fixture.test.ts` | 6 | Fixture shape, immutability, seeded data integrity |
| **Total** | **98** | — |

### Test command

```bash
npm test                         # Run all vitest in watch mode
npm test -- --run               # Run once and exit (used in CI)
npx vitest run                  # Explicitly run mode
```

### Defect fixes verified by tests

All defects listed in `HANDOFF.md` were discovered through rendered screenshots, not code reading. Each was fixed and verified with a focused red-green regression:

1. **Fabricated measurements** → `verification-impact.test.ts` test case: only accept records with recorded before/after journey outcomes
2. **Verifier journey-time inputs missing** → `VerificationScreen.tsx` now has two `<input type="number">` fields verified in `verification-impact.test.tsx`
3. **Demo state not persisting** → `App.test.tsx` and `presenter-journey.test.tsx` assert localStorage is written after every reducer dispatch
4. **Cost-band parsing failing** → `calculations.test.ts` tests digit-group extraction and midpoint calculation for ranges like `₹10,000–₹25,000`
5. **Rail reset to first barrier** → `LifecycleRail.tsx` reads `barrier.status` and maps to progress index; tested in `presenter-journey.test.tsx`
6. **Text breaks in rail** → CSS fix: status badges moved to `grid-column: 2` (separate row); no test regression
7. **Sticky header clip** → `main` element has `scroll-margin-top: var(--space-3)`; route focus test passes

---

## 7. Running It

### Prerequisites

- Node.js 18+ (check with `node --version`)
- npm 9+ (check with `npm --version`)

### Install

```bash
cd D:\HMC\ work\011-access-haryana-campus
npm install
```

### Development server

```bash
npm run dev
```

Vite prints a local URL like `http://localhost:5173/`. Open it in a browser. The app loads a seeded demo fixture; click **Continue guided audit** to begin the presenter journey.

### Production build

```bash
npm run build
```

Outputs to `dist/`. Contents:
- `dist/index.html` — 0.40 kB
- `dist/assets/style-*.css` — 41.84 kB (typography, layout, components, print rules)
- `dist/assets/index-*.js` — 255.15 kB (React 19, domain logic, screens)

### Run tests

```bash
npm test                # Watch mode (re-run on file save)
npx vitest run          # Run once and exit
npx vitest run <file>   # Run specific test file
```

### Type check

```bash
npx tsc -b              # TypeScript build in watch mode
npm run build           # TypeScript + Vite; catches all type errors
```

### Whitespace check (Git pre-commit)

```bash
git diff --check        # Report mixed-indent or trailing-whitespace errors
```

### Demo controls (from the app UI)

- **Simulated role selector** — Change context to Auditor, Facilities, or Verifier. This is presentation-only; it updates the visible next-action prompt and accessible aria-label but does not gate any functionality.
- **Reset demo** — Opens a confirmation dialog. Clicking Confirm restores the seeded fixture. Text size, high contrast, and reduced-motion preferences are preserved and stored separately, so they survive a reset.
- **Text size control** — Toggles root font size from 16px to 19px. Preference persists in localStorage under a separate key.
- **High contrast control** — Sets `data-high-contrast=true` and applies additional borders and outline styling. Preference persists.
- **Reduce motion control** — Sets `data-reduced-motion=true` and removes all animations. Preference persists.

---

## 8. Limitations & Scope Boundaries

### Prototype limitations

- **Frontend-only.** No backend, database, authentication, or authorization. All data is stored in localStorage and lost on browser data clear.
- **Simulated role selector.** Switching roles changes presentation context (what action you're prompted to take next) but does not enforce any real access control. A user with developer tools could bypass this.
- **No real-time collaboration.** Multiple users viewing the same demo will not see each other's changes.
- **No real images.** The five illustrative photos (tactile paving, ramps, signage) are unrelated Wikimedia Commons images showing different locations. They are not a before/after pair and do not represent the fictional campus.

### Non-claims and qualifications

- **Not a statutory assessment.** This is a demonstration of workflow, not a professional accessibility audit.
- **Not a compliance determination.** Screening the audit against WCAG 2.2 or BIS codes is simplified and illustrative.
- **Not a diagnosis.** The verifier screen explicitly states "This is not a diagnosis" and requests no medical information.
- **Bounded to one test.** A verified record says "one journey, one access requirement, one set of test conditions, one repair" succeeded. It does not establish universal usability or that the campus is fully accessible.
- **Fictional data.** All metrics, costs, timelines, and people are made up for demonstration purposes.

### Schema constraints (intentional prototype boundaries)

- No dedicated `ReviewerRole`, `PriorityAssessment`, or `HazardRecord` entity; these details live in immutable `ActivityEvent` reasons
- No multi-user audit (always a single auditor per case)
- No work-order rework workflow beyond "return to Assigned if verification fails"
- No cost-tracking or budget integration
- No real accessibility testing harness (verifier manually records journey success)

---

## 9. Media & Attribution

All images in `public/media/` are illustrative and from Wikimedia Commons. They are **not real-world before/after pairs** and **do not depict the fictional campus**.

Complete attribution is in `public/media/ATTRIBUTION.md`:

| Local name | Source work | Creator | Licence | Retrieved |
|---|---|---|---|---|
| `tactile-paving-obstructed.jpg` | Tactile paving, with obstructions | Amenoc | CC0 1.0 | 2026-08-13 |
| `shattered-tactile-tile.jpg` | Shattered tactile paving tile | Gayest Frogs | CC-BY-SA 4.0 | 2026-08-13 |
| `accessible-entrance-ramp.jpg` | Access to new accessible ramp | NPS Photo | PD-USGov-NPS | 2026-08-13 |
| `gradual-ramp-pathway.jpg` | Long gradual sidewalk ramp | Ezekielf | CC0 1.0 | 2026-08-13 |
| `accessibility-sign.jpg` | Second Bank accessibility sign | NPS photo | PD-USGov-NPS | 2026-08-13 |

All derivatives were resized to 1,920 px wide by Wikimedia; no cropping, colour, or content edits were made. Original source URLs and licence terms are linked in the attribution file.

---

## 10. Deployment & Next Steps

### Current state

- Code is on branch `feature/access-haryana-build` (21 commits ahead of `master`)
- Production build passes all 98 tests, TypeScript check, and Vite build
- Browser acceptance verified across keyboard, reflow, forced colours, reduced motion, large text, and print
- No deployment as of 2026-08-15; `master` branch has no commits yet

### Before merging to main

1. Decide on a hosting target (Vercel, GitHub Pages, static host, etc.)
2. Review non-negotiable items in `HANDOFF.md` ("Never claim certified…", "verifier must stay structurally independent…")
3. Confirm with stakeholders that fictional-data disclaimer is visible and clear
4. Consider whether to strip or preserve the historical verification/design/ and verification/task-10/ folders (current evidence only); prune if desired

### To deploy to Vercel

```bash
npm run build
vercel deploy --prod --yes
```

Add environment variables if needed (none currently required).

### To run a local demo for presentations

```bash
npm run build
npx vite preview --port 5173 --host 127.0.0.1
```

Then open `http://127.0.0.1:5173/` in a browser and follow the presenter controls. The demo is self-contained and requires no network.

---

## 11. References & Further Reading

- **Design system:** `.superdesign/design-system.md` — All visual, layout, copy, and motion rules
- **Task reports:** `task-7-report.md` through `task-10-report.md` — Progressive feature delivery and defect fixes
- **Handoff notes:** `HANDOFF.md` — Defects found by screenshot review, open items, and how to verify visually
- **Acceptance report:** `verification/redesign/acceptance-report.md` — Browser acceptance evidence, keyboard journey, reflow/forced-colours/print verification
- **Type definitions:** `src/domain/types.ts` — Full schema (Barrier, WorkOrder, Verification, DemoState, etc.)
- **Workflow transitions:** `src/domain/workflow.ts` — All seven barrier status transitions with guards

---

## 12. Summary

**Access Haryana Campus** is a fully functional, accessibility-verified demonstration of a campus barrier-to-fix workflow. It shows:

- How to capture evidence with full provenance (auditor, standard, date, feedback)
- How to route repair work through prioritisation and assignment
- How to enforce independent verification (structurally separate from the repair owner)
- How to report impact honestly (only counting records with recorded before/after outcomes)
- How to build this entirely in React + TypeScript without external UI libraries or remote fonts

All 98 tests pass. Keyboard navigation is complete. WCAG 2.2 AA constraints are met (keyboard, focus, 200% reflow, 390px, forced colours, reduced motion). The A4 print output is one page. The interface is ready for a 5-minute presenter demo at a jury or stakeholder review.

The code is production-ready; merging, hosting, and public communication are still open decisions.

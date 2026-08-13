# Access Haryana Campus Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a polished, frontend-only Ideathon demo that traces one fictional campus accessibility barrier from field observation through validated repair and bounded user verification.

**Architecture:** React, TypeScript and Vite will render six routes inside one accessible shell. A typed reducer owns a versioned fictional fixture; pure domain functions enforce transitions, priority and impact calculations, while a defensive local-storage adapter preserves the demo session.

**Tech Stack:** React 19, TypeScript, Vite, React Router, Vitest, Testing Library, native CSS, locally frozen reusable images.

## Global Constraints

- Every standard-related check displays its source, edition/year and clause/section; the prototype never claims certification or legal compliance.
- Canonical states are `observed`, `validated`, `prioritised`, `assigned`, `awaiting_verification`, `verified`, and `rework_required`.
- All campus records, roles, dates, costs and outcomes are explicitly labelled fictional or illustrative demo data.
- Images are local files with source, creator, licence and retrieval date recorded in `public/media/ATTRIBUTION.md`.
- Target WCAG 2.2 AA with keyboard operation, skip link, visible focus, focus management, semantic status, 200% reflow, forced colours and reduced motion.
- No backend, authentication, real upload, GIS, AI compliance decision, statutory certification or real personal data.
- Production functions are written only after their focused test has failed for the expected missing-behaviour reason.

## File map

- `src/domain/`: types, workflow transitions, validation, calculations and reducer.
- `src/data/`: immutable versioned fixture and defensive storage adapter.
- `src/app/`: router, shell composition and persisted state ownership.
- `src/components/`: only reused accessible presentation primitives.
- `src/screens/`: six route-level experiences.
- `src/styles/`: tokens, base, component, responsive and print rules.
- `public/media/`: locally frozen illustrative evidence and attribution ledger.

---

### Task 1: Scaffold and fixture contract

**Files:** Create `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`, `src/main.tsx`, `src/test/setup.ts`, `src/domain/types.ts`, `src/data/demo-fixture.v1.ts`, `src/data/demo-fixture.v1.test.ts`.

**Interfaces:** Produces `DemoState`, domain entity types, `fixtureIds`, and `createDemoFixture(): DemoState` returning an isolated clone.

- [ ] Write tests proving two fixture results share no mutable references, contain the primary gate-to-admissions journey, use stable IDs, label all data illustrative, and give every evidence item decision-relevant alt text.
- [ ] Run `npm test -- src/data/demo-fixture.v1.test.ts` and confirm failure because the fixture module does not exist.
- [ ] Add minimal Vite/Vitest configuration, domain types and a deterministic fixture with one primary obstructed-landing case plus ramp and signage backlog records.
- [ ] Run the focused test and confirm all assertions pass without warnings.
- [ ] Commit with `git commit -m "feat: establish fictional demo fixture"`.

### Task 2: Lifecycle and safety rules

**Files:** Create `src/domain/workflow.ts`, `src/domain/workflow.test.ts`.

**Interfaces:** Produces `transitionBarrier(state, command): TransitionResult`, typed commands for validate, prioritise, assign, submit evidence, accept, reject and request inspection, and immutable `ActivityEvent` output.

- [ ] Write a table-driven failing test for every allowed edge and representative forbidden skips, plus immediate-hazard escalation, rework preservation and independent-verifier prerequisites.
- [ ] Run `npm test -- src/domain/workflow.test.ts` and confirm the missing-module failure.
- [ ] Implement a typed transition table that never exposes arbitrary status assignment, changes nothing on failure, and appends exactly one event on success.
- [ ] Run the focused test and confirm allowed, forbidden, rework and escalation cases pass.
- [ ] Commit with `git commit -m "feat: enforce barrier evidence lifecycle"`.

### Task 3: Validation, priority and impact calculations

**Files:** Create `src/domain/validation.ts`, `src/domain/validation.test.ts`, `src/domain/calculations.ts`, `src/domain/calculations.test.ts`.

**Interfaces:** Produces `validateAudit`, `validateWorkOrder`, `validateVerification`, `calculatePriority` and `calculateImpact`.

- [ ] Write failing tests for missing audit evidence, unable-to-measure handling, implausible rise/run confirmation, work-order prerequisites, bounded acceptance, rejection reason, priority override reason, verified-only metrics and zero-denominator behavior.
- [ ] Run both focused test files and confirm they fail because functions are absent.
- [ ] Implement deterministic validation; calculate priority from severity, essential-service impact, alternative-route quality, affected journeys and urgency while reporting fixability separately for sequencing.
- [ ] Implement traceable impact output containing source record IDs and excluding awaiting/rework records.
- [ ] Run the focused tests and commit with `git commit -m "feat: add qualified priority and impact logic"`.

### Task 4: Reducer and versioned persistence

**Files:** Create `src/domain/demoReducer.ts`, `src/domain/demoReducer.test.ts`, `src/data/storage.ts`, `src/data/storage.test.ts`.

**Interfaces:** Produces `demoReducer(state, action)`, `loadDemoState`, `saveDemoState`, `resetDemoState`; storage key `access-haryana-campus.demo` and envelope `{schemaVersion:1,savedAt,state}`.

- [ ] Write failing reducer tests for atomic entity/event updates, failed-action no-op, reset and separate preference persistence.
- [ ] Write failing storage tests for valid v1 round trip, missing key, corrupt JSON, unsupported version, write exception and reset.
- [ ] Run focused tests and verify expected failures.
- [ ] Implement the reducer and handwritten envelope guard; storage failures fall back without breaking the in-memory session.
- [ ] Run tests and commit with `git commit -m "feat: persist resilient demo state"`.

### Task 5: Licensed illustrative media

**Files:** Create `public/media/ATTRIBUTION.md` and selected local image files under `public/media/`.

**Interfaces:** Fixture evidence paths resolve locally; attribution entries contain source page, creator, licence URL, modifications and retrieval date.

- [ ] Select five environment-focused assets from the verified Wikimedia shortlist: obstructed tactile paving, shattered tactile tile, accessible entrance ramp, accessible signage and gradual ramp/pathway.
- [ ] Download originals or appropriately sized derivatives, recording exact asset-page terms before use; label unmatched before/after assets illustrative rather than the same location.
- [ ] Add a test assertion that every fixture media path exists through the Vite public convention and every ID appears in the attribution ledger.
- [ ] Run the fixture test, correct missing media/ledger entries, and commit with `git commit -m "assets: add attributed accessibility evidence"`.

### Task 6: Accessible shell and lifecycle rail

**Files:** Create `src/app/App.tsx`, `src/app/routes.tsx`, `src/components/AppShell.tsx`, `src/components/LifecycleRail.tsx`, `src/components/StatusBadge.tsx`, `src/app/App.test.tsx`, `src/styles/tokens.css`, `src/styles/base.css`, `src/styles/components.css`.

**Interfaces:** Shell consumes `DemoState`, dispatch and route content; exposes simulated role, current stage, next action, demo banner, preferences and reset.

- [ ] Write failing component tests for skip navigation, semantic landmarks, demo-mode text, role switcher, current-step semantics, text-independent status, focusable stage links, reduced-motion preference and reset confirmation.
- [ ] Run `npm test -- src/app/App.test.tsx` and confirm missing UI failure.
- [ ] Implement the shell using semantic HTML and CSS tokens from the approved Superdesign direction; no inaccessible hover-only controls.
- [ ] Run the focused test and commit with `git commit -m "feat: add accessible ideathon demo shell"`.

### Task 7: Overview and guided audit

**Files:** Create `src/screens/OverviewScreen.tsx`, `src/screens/AuditScreen.tsx`, `src/components/ErrorSummary.tsx`, `src/components/EvidenceImage.tsx`, `src/screens/overview-audit.test.tsx`.

**Interfaces:** Overview derives fictional metrics and filters; Audit dispatches `SUBMIT_AUDIT` then navigates to the created barrier.

- [ ] Write failing tests for status/severity filtering, accessible empty recovery, labelled illustrative metrics, standards provenance, error-summary focus, unable-to-measure path, seeded evidence selection and valid keyboard submission.
- [ ] Run the focused test and confirm missing-screen failure.
- [ ] Implement prefilled guided interactions with one decisive action per demo stage and accessible supporting-evidence descriptions.
- [ ] Run tests and commit with `git commit -m "feat: guide barrier audit from overview"`.

### Task 8: Barrier validation and work order

**Files:** Create `src/screens/BarrierScreen.tsx`, `src/screens/WorkOrderScreen.tsx`, `src/components/ActivityTimeline.tsx`, `src/screens/barrier-work-order.test.tsx`.

**Interfaces:** Barrier screen invokes validate/prioritise; work-order screen creates assignment and submits repair evidence.

- [ ] Write failing tests for reviewer provenance, qualified terminology, immediate-hazard controls, priority explanation/override, alternative-route status, illegal-action messaging, work-order validation and “awaiting verification” copy.
- [ ] Run focused tests and confirm failure.
- [ ] Implement role-aware demo handoff, immutable timeline presentation and structured before/after evidence without a visual-only slider.
- [ ] Run tests and commit with `git commit -m "feat: turn validated barrier into repair work"`.

### Task 9: Independent verification and impact report

**Files:** Create `src/screens/VerificationScreen.tsx`, `src/screens/ImpactScreen.tsx`, `src/components/MetricCard.tsx`, `src/screens/verification-impact.test.tsx`, `src/styles/print.css`.

**Interfaces:** Verification accepts/rejects/requests inspection; Impact renders verified-only, source-linked fictional outcomes and calls `window.print`.

- [ ] Write failing tests for voluntary consent copy, no diagnosis request, verifier/repair-owner separation, bounded acceptance, required rejection reason, inspection event, rework preservation, verified-only impact traceability and print summary disclaimer.
- [ ] Run focused tests and confirm failure.
- [ ] Implement the final two screens and print-safe one-page evidence report.
- [ ] Run tests and commit with `git commit -m "feat: verify repairs and report traceable impact"`.

### Task 10: End-to-end demo and verification

**Files:** Create `src/app/presenter-journey.test.tsx`, modify responsive/forced-colours/reduced-motion styles as evidence requires, create `README.md`.

**Interfaces:** A fresh fictional fixture completes audit → validate → prioritise → assign → evidence → accept → impact through visible controls.

- [ ] Write the failing presenter-journey test using deterministic fixture time and user-visible assertions.
- [ ] Run it and fix only missing integration behavior until it passes.
- [ ] Run `npm test`, `npm run build`, and `git diff --check`; require zero failures and exit code 0.
- [ ] Run fresh desktop and 390-pixel browser inspections covering keyboard-only navigation, 200% zoom/reflow, visible focus, reduced motion, forced colours, missing-image fallback and print preview.
- [ ] Time the guided path; require under five minutes and no ambiguous simulated-role transition.
- [ ] Document local commands, fictional-data caveat, media attribution location and demo reset in `README.md`.
- [ ] Commit with `git commit -m "test: verify complete ideathon presenter journey"`.


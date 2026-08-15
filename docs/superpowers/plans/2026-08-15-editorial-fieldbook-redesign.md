# Editorial Fieldbook Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the generic dashboard presentation with a cohesive editorial-fieldbook interface while preserving the complete fictional accessibility workflow and its accessibility guarantees.

**Architecture:** Keep the React route, reducer, fixture, persistence, and calculation layers unchanged. Recompose the existing shell and screen markup around a revised native-CSS token system; shared primitives provide consistent evidence, status, chronology, and metric treatments across all routes.

**Tech Stack:** React 19, TypeScript, Vite 8, Vitest, Testing Library, native CSS, locally bundled media; no added dependencies.

## Global Constraints

- Preserve all six routes, domain transitions, fixture semantics, persistence behavior, verified-only impact calculations, and presenter flow.
- Use the warm paper / dark ink / burnt orange editorial-fieldbook direction from `docs/superpowers/specs/2026-08-15-editorial-fieldbook-redesign.md`.
- Use 22–24px radii for feature regions, 14–18px for standard sections/evidence, and 8–12px for controls. Reserve full pills for compact status and filter controls.
- No purple or blue-white gradients, glass effects, neon accents, generic equal-card feature rows, remote fonts, CDN assets, new dependencies, or external network calls.
- Never claim certified, universally accessible, professionally assessed, or legally compliant.
- Preserve guideline source, edition year, and clause/section wherever a standards-related check appears.
- Preserve verifier independence, fictional/illustrative labels, measurement honesty, and unmatched before/after evidence qualification.
- Maintain keyboard operation, semantic landmarks, visible focus, text-independent state, large text, reduced motion, high contrast, forced colours, 200% reflow, and 390px layout without document-level horizontal overflow.
- Production behavior or markup changes require a focused failing test before implementation.
- Print output must remain exactly one legible A4 page.

## File map

- `src/styles/tokens.css`: editorial palette, type, spacing, radius, elevation, motion, and layout tokens.
- `src/styles/base.css`: document typography, focus, controls, reduced motion, and forced-colour foundations.
- `src/styles/components.css`: shell, progress strip, shared primitives, route compositions, and responsive rules.
- `src/styles/print.css`: one-page impact report; visual changes only when browser PDF evidence proves the result.
- `src/components/AppShell.tsx`: masthead, route index, utility cluster, perspective, reset dialog, and page frame.
- `src/components/LifecycleRail.tsx`: horizontal numbered case-progress strip with narrow-screen internal scrolling.
- `src/components/{StatusBadge,EvidenceImage,MetricCard,ActivityTimeline,ErrorSummary}.tsx`: shared editorial primitives.
- `src/screens/*.tsx`: route-specific semantic wrappers and compositions; domain dispatch behavior remains unchanged.
- `src/app/App.test.tsx`, `src/screens/*.test.tsx`, `src/app/presenter-journey.test.tsx`: accessible behavior and integration regression coverage.
- `verification/redesign/`: one current desktop/mobile tour plus accessibility and print artifacts.

---

### Task 1: Editorial tokens and document foundation

**Files:**
- Modify: `src/styles/tokens.css`
- Modify: `src/styles/base.css`
- Modify: `src/app/App.test.tsx`

**Interfaces:**
- Consumes: existing root datasets `data-text-size`, `data-high-contrast`, and `data-reduced-motion` from `App`.
- Produces: stable CSS custom properties used by every later task, including `--paper`, `--paper-raised`, `--ink`, `--ink-muted`, `--accent`, `--rule`, `--radius-feature`, `--radius-panel`, and `--radius-control`.

- [ ] **Step 1: Add a failing preference-foundation assertion**

Add to `src/app/App.test.tsx`:

```tsx
test('keeps editorial preferences on the document root', async () => {
  const user = userEvent.setup()
  render(<App />)
  await user.click(screen.getByRole('button', { name: /increase text size/i }))
  await user.click(screen.getByRole('checkbox', { name: /reduce motion/i }))
  expect(document.documentElement).toHaveAttribute('data-text-size', 'large')
  expect(document.documentElement).toHaveAttribute('data-reduced-motion', 'true')
  expect(document.documentElement).toHaveStyle({ colorScheme: 'light' })
})
```

- [ ] **Step 2: Run the focused test and verify red**

Run: `npx vitest run src/app/App.test.tsx`

Expected: FAIL because `color-scheme: light` is not exposed on the root computed style.

- [ ] **Step 3: Implement the editorial token system**

Replace the visual token values in `tokens.css` with the approved warm-paper palette and hierarchical radii. Update `base.css` so `html` declares `color-scheme: light`, Georgia leads the display-serif stack through a `--font-display` token, body/interface text uses `--font-interface`, paragraphs retain readable line length, headings balance wrapping, and all native controls inherit the interface font.

Keep the existing high-contrast variable override and reduced-motion rules, mapped to the new token names.

- [ ] **Step 4: Run foundation tests and verify green**

Run: `npx vitest run src/app/App.test.tsx`

Expected: all shell tests PASS with no warnings.

- [ ] **Step 5: Commit**

```bash
git add src/styles/tokens.css src/styles/base.css src/app/App.test.tsx
git commit -m "style: establish editorial fieldbook foundation"
```

---

### Task 2: Masthead and horizontal case progress

**Files:**
- Modify: `src/components/AppShell.tsx`
- Modify: `src/components/LifecycleRail.tsx`
- Modify: `src/styles/components.css`
- Modify: `src/app/App.test.tsx`

**Interfaces:**
- Consumes: existing `AppShell` props and lifecycle state derivation.
- Produces: semantic `.app-masthead`, `.route-index`, `.utility-cluster`, `.case-progress`, and `.case-progress__track` structures without changing the component props.

- [ ] **Step 1: Write failing navigation and progress tests**

Add focused assertions to `src/app/App.test.tsx`:

```tsx
test('marks the current route and exposes a numbered case progress strip', () => {
  history.replaceState({}, '', '/audit')
  render(<App />)
  expect(screen.getByRole('link', { name: 'Guided audit' })).toHaveAttribute('aria-current', 'page')
  const progress = screen.getByRole('navigation', { name: /case progress/i })
  expect(within(progress).getAllByRole('listitem')).toHaveLength(6)
  expect(within(progress).getByText('01')).toBeInTheDocument()
  expect(within(progress).getByText('06')).toBeInTheDocument()
})
```

Retain existing assertions for skip navigation, role controls, reset confirmation, current lifecycle semantics, and focusable stage links.

- [ ] **Step 2: Run the focused test and verify red**

Run: `npx vitest run src/app/App.test.tsx`

Expected: FAIL because the current route has no `aria-current="page"`, the navigation is named “Demo journey,” and stages do not expose two-digit numbers.

- [ ] **Step 3: Recompose the shell markup**

In `AppShell.tsx`:

- Build a masthead with brand/qualification, route index, and visible utility cluster.
- Determine the current path from `window.location.pathname` during render and set `aria-current="page"` on the matching route link.
- Keep role, text size, contrast, motion, and reset controls visible without adding a disclosure menu.
- Preserve reset-dialog focus restoration and `#main-content` focus behavior.

In `LifecycleRail.tsx`:

- Rename the navigation label to `Case progress`.
- Render stage numbers with `String(index + 1).padStart(2, '0')`.
- Preserve textual stage, actor, and current/complete/upcoming states.

- [ ] **Step 4: Implement wide and narrow shell layout**

In `components.css`, replace the sticky sidebar grid with:

- a restrained masthead and wrapping route index;
- a full-width horizontal progress region below the masthead;
- an asymmetric but centered content frame;
- internal horizontal scrolling only on `.case-progress` below 900px;
- visible scroll continuation through clipped next-stage spacing, without document-level overflow.

- [ ] **Step 5: Run focused and presenter tests**

Run: `npx vitest run src/app/App.test.tsx src/app/presenter-journey.test.tsx`

Expected: both files PASS; route focus and furthest-case tracking remain intact.

- [ ] **Step 6: Commit**

```bash
git add src/components/AppShell.tsx src/components/LifecycleRail.tsx src/styles/components.css src/app/App.test.tsx
git commit -m "style: replace dashboard shell with editorial masthead"
```

---

### Task 3: Shared evidence and status primitives

**Files:**
- Modify: `src/components/StatusBadge.tsx`
- Modify: `src/components/EvidenceImage.tsx`
- Modify: `src/components/MetricCard.tsx`
- Modify: `src/components/ActivityTimeline.tsx`
- Modify: `src/components/ErrorSummary.tsx`
- Modify: `src/styles/components.css`
- Modify: `src/screens/verification-impact.test.tsx`
- Modify: `src/screens/overview-audit.test.tsx`

**Interfaces:**
- Consumes: existing primitive props; no calling screen receives a new required prop.
- Produces: `.record-status`, `.evidence-plate`, `.report-metric`, `.case-chronology`, and `.error-brief` editorial structures.

- [ ] **Step 1: Write failing semantic primitive assertions**

Extend existing screen tests:

```tsx
expect(screen.getByText(/illustrative demo evidence/i).closest('figure')).toHaveClass('evidence-plate')
expect(screen.getByRole('alert')).toHaveClass('error-brief')
expect(screen.getByText('5 min', { selector: '.metric-value' }).closest('article')).toHaveClass('report-metric')
```

Add an activity assertion that the timeline remains an ordered list and each event still exposes status, reason, actor, and localized time.

- [ ] **Step 2: Run focused tests and verify red**

Run: `npx vitest run src/screens/overview-audit.test.tsx src/screens/verification-impact.test.tsx`

Expected: FAIL because the new editorial class contracts do not exist.

- [ ] **Step 3: Recompose primitives without changing data behavior**

- `StatusBadge`: keep visible text and add the `record-status` class; do not add icon-only meaning.
- `EvidenceImage`: use `evidence-plate`; retain the real `<figure>`, decision-relevant alt text, recorded date, ID, and accessible missing-image fallback.
- `MetricCard`: render an `<article className="report-metric">` while retaining `.metric-value` for existing calculations/tests.
- `ActivityTimeline`: retain `<ol>` chronology and introduce editorial event-number/metadata wrappers.
- `ErrorSummary`: retain `role="alert"`, focus target, heading, and linked messages; add `error-brief`.

- [ ] **Step 4: Style the primitives**

Use warm hairlines, asymmetric metadata, annotated evidence captions, variable metric scale, and a ruled chronology. Avoid equal white cards with identical border/shadow treatment.

- [ ] **Step 5: Run focused tests and verify green**

Run: `npx vitest run src/screens/overview-audit.test.tsx src/screens/verification-impact.test.tsx`

Expected: all focused tests PASS.

- [ ] **Step 6: Commit**

```bash
git add src/components src/styles/components.css src/screens/overview-audit.test.tsx src/screens/verification-impact.test.tsx
git commit -m "style: create editorial evidence primitives"
```

---

### Task 4: Overview and guided audit compositions

**Files:**
- Modify: `src/screens/OverviewScreen.tsx`
- Modify: `src/screens/AuditScreen.tsx`
- Modify: `src/styles/components.css`
- Modify: `src/screens/overview-audit.test.tsx`

**Interfaces:**
- Consumes: unchanged `OverviewScreen` and `AuditScreen` props, fixture IDs, validation, and reducer action.
- Produces: `.overview-ledger`, `.finding-register`, `.audit-worksheet`, and `.worksheet-action` route compositions.

- [ ] **Step 1: Add failing composition assertions**

Add to `overview-audit.test.tsx`:

```tsx
expect(screen.getByRole('heading', { name: /saraswati campus access pulse/i }).closest('section')).toHaveClass('overview-ledger')
expect(screen.getByRole('heading', { name: /barrier records/i }).closest('section')).toHaveClass('finding-register')
expect(screen.getByRole('heading', { name: /guided field audit/i }).closest('form')).toHaveClass('audit-worksheet')
```

- [ ] **Step 2: Run the focused test and verify red**

Run: `npx vitest run src/screens/overview-audit.test.tsx`

Expected: FAIL because the route compositions retain the previous dashboard classes.

- [ ] **Step 3: Recompose Overview markup**

- Create one dominant editorial lead with journey context, a compact evidence index, and the existing audit CTA.
- Render findings as a numbered semantic register; preserve filter labels, status/severity text, links, and empty recovery.
- Keep illustrative qualification adjacent to metrics and records.

- [ ] **Step 4: Recompose Audit markup**

- Group journey context, evidence, measurements, provenance, and submission into a field worksheet reading order.
- Keep every label/control association, seeded evidence selection, unable-to-measure path, validation error focus, and dispatch payload unchanged.
- Anchor the one decisive submit action in `.worksheet-action`.

- [ ] **Step 5: Style both routes across breakpoints**

Use an asymmetric two-column lead on desktop, a numbered register rather than a card grid, and a single-column worksheet below 700px. Avoid fixed heights and preserve large-text reflow.

- [ ] **Step 6: Run focused and shell regression tests**

Run: `npx vitest run src/screens/overview-audit.test.tsx src/app/App.test.tsx`

Expected: all tests PASS.

- [ ] **Step 7: Commit**

```bash
git add src/screens/OverviewScreen.tsx src/screens/AuditScreen.tsx src/styles/components.css src/screens/overview-audit.test.tsx
git commit -m "style: redesign overview and audit as field records"
```

---

### Task 5: Barrier case file and repair brief

**Files:**
- Modify: `src/screens/BarrierScreen.tsx`
- Modify: `src/screens/WorkOrderScreen.tsx`
- Modify: `src/styles/components.css`
- Modify: `src/screens/barrier-work-order.test.tsx`

**Interfaces:**
- Consumes: unchanged transition commands, validation functions, priority calculations, and controlled work-order fields.
- Produces: `.case-file`, `.decision-annotation`, `.repair-brief`, and `.handoff-notice` compositions.

- [ ] **Step 1: Write failing case-file assertions**

Add to `barrier-work-order.test.tsx`:

```tsx
expect(screen.getByRole('heading', { name: /landing narrowed/i }).closest('article')).toHaveClass('case-file')
expect(screen.getByText(/priority calculated/i).closest('section')).toHaveClass('decision-annotation')
expect(screen.getByRole('heading', { name: /repair work order/i }).closest('form')).toHaveClass('repair-brief')
```

- [ ] **Step 2: Run the focused test and verify red**

Run: `npx vitest run src/screens/barrier-work-order.test.tsx`

Expected: FAIL because the editorial case-file contracts do not exist.

- [ ] **Step 3: Recompose Barrier as a case file**

- Lead with record ID, title, textual status, bounded qualification, and standards provenance.
- Pair evidence with the annotated priority/alternative-route decision block.
- Keep validation, prioritisation, override reason, and hazard escalation controls distinct and legally gated by the existing workflow.
- Preserve the immutable activity chronology.

- [ ] **Step 4: Recompose Work Order as a repair brief**

- Pair responsibility/remedy fields with cost/due date fields using semantic groups.
- Present before/after evidence as annotated, explicitly unmatched frames.
- Preserve controlled values, validation behavior, owner/verifier separation, repair evidence dispatch, and awaiting-verification continuation.
- Style the transition to verification as a formal handoff, not a universal success message.

- [ ] **Step 5: Run focused and workflow regressions**

Run: `npx vitest run src/screens/barrier-work-order.test.tsx src/domain/workflow.test.ts src/domain/demoReducer.test.ts`

Expected: all tests PASS.

- [ ] **Step 6: Commit**

```bash
git add src/screens/BarrierScreen.tsx src/screens/WorkOrderScreen.tsx src/styles/components.css src/screens/barrier-work-order.test.tsx
git commit -m "style: turn barrier and work order into case files"
```

---

### Task 6: Verification charter and impact report

**Files:**
- Modify: `src/screens/VerificationScreen.tsx`
- Modify: `src/screens/ImpactScreen.tsx`
- Modify: `src/styles/components.css`
- Modify: `src/styles/print.css` only if regenerated PDF exceeds one page or loses legibility
- Modify: `src/screens/verification-impact.test.tsx`

**Interfaces:**
- Consumes: injectable `now`, verification validation, accepted/rejected/inspection transitions, and verified-only impact records.
- Produces: `.verification-charter`, `.journey-comparison`, `.impact-cover`, `.metric-composition`, and `.source-ledger` structures.

- [ ] **Step 1: Write failing verification/report composition tests**

Add to `verification-impact.test.tsx`:

```tsx
expect(screen.getByRole('heading', { name: /voluntary consent and independence/i }).closest('section')).toHaveClass('verification-charter')
expect(screen.getByLabelText(/recorded journey time before repair/i).closest('div')).toHaveClass('journey-comparison')
expect(screen.getByRole('heading', { name: /bounded verified outcomes/i }).closest('section')).toHaveClass('impact-cover')
expect(screen.getByRole('heading', { name: /traceable outcomes/i }).closest('section')).toHaveClass('source-ledger')
```

- [ ] **Step 2: Run the focused test and verify red**

Run: `npx vitest run src/screens/verification-impact.test.tsx`

Expected: FAIL because the editorial verification/report classes do not exist.

- [ ] **Step 3: Recompose Verification**

- Move voluntary consent, no-diagnosis language, and repair-owner independence into a visible charter.
- Present before/retest time and success inputs as one labeled comparison region.
- Keep bounded acceptance copy, reason-gated rejection, inspection behavior, actual timestamp injection, preserved evidence, and chronology unchanged.

- [ ] **Step 4: Recompose Impact**

- Create an editorial cover with bounded scope and illustrative qualification.
- Arrange metrics at mixed visual scale without changing values or `.metric-value` hooks.
- Present traceability as a source ledger with barrier, work order, evidence, verification, and timeline IDs.
- Retain verified-only exclusions, missing-outcome exclusions, pilot spend parsing, print button, and disclaimer.

- [ ] **Step 5: Run focused and calculation regressions**

Run: `npx vitest run src/screens/verification-impact.test.tsx src/domain/calculations.test.ts`

Expected: all tests PASS.

- [ ] **Step 6: Commit**

```bash
git add src/screens/VerificationScreen.tsx src/screens/ImpactScreen.tsx src/styles/components.css src/styles/print.css src/screens/verification-impact.test.tsx
git commit -m "style: redesign verification and impact evidence report"
```

---

### Task 7: End-to-end visual and accessibility acceptance

**Files:**
- Modify: `src/app/presenter-journey.test.tsx` only if intentional accessible names changed
- Modify: `README.md`
- Create: `verification/redesign/tour-01-overview.png` through `verification/redesign/tour-09-impact.png`
- Create: `verification/redesign/large-text-390.png`
- Create: `verification/redesign/reduced-motion-390.png`
- Create: `verification/redesign/forced-colours-390.png`
- Create: `verification/redesign/impact-print.pdf`
- Create: `verification/redesign/impact-print-preview.png`
- Create: `verification/redesign/acceptance-report.md`

**Interfaces:**
- Consumes: the completed redesign and existing local Vite preview workflow.
- Produces: verified production build and one unambiguous current redesign evidence set.

- [ ] **Step 1: Run the full automated suite**

Run:

```bash
npx vitest run
npx tsc -b
npx vite build
git diff --check
```

Expected: 11 test files and at least 80 tests PASS; TypeScript, Vite, and whitespace checks exit 0.

- [ ] **Step 2: Start the production preview**

Run from the worktree:

```powershell
Start-Process -FilePath "npx.cmd" -ArgumentList "vite preview --port 4173 --host 127.0.0.1" -WorkingDirectory (Get-Location) -WindowStyle Hidden
```

Confirm `Invoke-WebRequest -UseBasicParsing http://127.0.0.1:4173/` returns status 200.

- [ ] **Step 3: Drive the real presenter journey with keyboard controls**

Use a fresh `agent-browser` session. Complete audit → validate → prioritise → assign → submit repair evidence → independently accept → impact using Tab, Enter, Space, and arrow keys. Capture the nine named tour frames and confirm route focus lands on `#main-content` after each navigation.

- [ ] **Step 4: Verify responsive and preference states**

At a 390×844 viewport:

- enable large text and confirm root font is 19px;
- confirm `document.documentElement.scrollWidth === document.documentElement.clientWidth` after layout settles;
- confirm only `.case-progress` has intentional internal horizontal overflow;
- enable reduced motion and confirm route-entry `animation-name` is `none`;
- run forced colours and confirm state, borders, focus, and controls remain visible.

Save the named preference artifacts.

- [ ] **Step 5: Verify 200% reflow and missing evidence fallback**

Set CSS page zoom to `2` at a 780px viewport and confirm no document-level overflow. Replace one evidence image URL with a deliberate missing local path and confirm the descriptive `role="img"` fallback remains visible and labeled.

- [ ] **Step 6: Re-export and inspect print output**

From the completed impact state, generate `verification/redesign/impact-print.pdf`, open it in Chromium, and capture `impact-print-preview.png`. Confirm the viewer reports `1 / 1` and the cover, metrics, source ledger, and disclaimer are legible and unclipped. If it exceeds one page, adjust only `print.css`, regenerate, and repeat until it reports `1 / 1`.

- [ ] **Step 7: Document the acceptance evidence**

Write `acceptance-report.md` with exact commands, viewport measurements, overflow results, preference results, PDF page count, test counts, and known prototype boundaries. Update `README.md` to identify `verification/redesign/` as the current evidence set.

- [ ] **Step 8: Run final verification**

Run:

```bash
npx vitest run
npx tsc -b
npx vite build
git diff --check
```

Expected: all commands exit 0 with no test failures.

- [ ] **Step 9: Commit**

```bash
git add README.md src verification/redesign
git commit -m "test: verify editorial fieldbook redesign"
```

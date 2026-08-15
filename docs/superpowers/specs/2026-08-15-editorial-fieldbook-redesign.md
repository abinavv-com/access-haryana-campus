# Access Haryana Campus — Editorial Fieldbook Redesign

## Objective

Completely redesign the existing frontend without changing its accessibility workflow, domain rules, stored data, or presenter journey. The result should feel intentionally designed by a civic-service product team rather than assembled from generic dashboard patterns.

The chosen direction is **Editorial Fieldbook with measured rounding**: documentary precision, warm tactile surfaces, asymmetric editorial hierarchy, restrained burnt-orange emphasis, and rounded containers used according to hierarchy.

## Design principles

1. **Evidence before decoration.** Evidence, provenance, decisions, and the next action dominate every screen.
2. **Rounded containers, not pills everywhere.** Outer feature surfaces use 18–24px radii, ordinary panels use 12–16px, inputs and buttons use 8–12px, and pills are reserved for compact status or filter controls.
3. **One accent with a job.** Burnt orange identifies the principal action and active journey position. It is not scattered decoratively.
4. **Warm paper, dark ink.** The base palette resembles a carefully printed field report rather than a software dashboard.
5. **Editorial hierarchy over card grids.** Large serif statements, annotations, rules, and asymmetric columns replace repetitive equal-sized cards.
6. **Specific language over interface slogans.** Copy remains factual, bounded, and free of promotional clichés.
7. **Accessibility is structural.** Keyboard operation, visible focus, semantic status, large text, reduced motion, forced colours, 200% reflow, and 390px layouts remain non-negotiable.

## Visual system

### Colour

- Paper canvas: warm stone `#EEEAE1`
- Primary surface: soft ivory `#F8F5EE`
- Raised evidence surface: near-white `#FFFDF8`
- Ink: blue-black `#182123`
- Secondary ink: muted slate `#59605E`
- Hairline: warm grey `#C9C2B6`
- Accent: burnt orange around `#C95732`
- Verified: deep moss around `#2F6654`
- Warning and danger remain distinct, accessible semantic colours and do not become decorative accents.

No purple, blue-white AI gradients, glass effects, neon accents, or decorative status rainbow.

### Typography

- Display headings use a locally available editorial serif stack headed by Georgia. The serif is used sparingly for route titles, key outcome statements, and report headings.
- Interface text uses the existing local/system-safe humanist sans stack. No remote font requests or new font dependency.
- Body copy remains approximately 60–68 characters wide.
- Labels use sentence case or compact tracked metadata. All-caps is restricted to short record identifiers and evidence annotations.
- Numeric metrics use tabular figures.

### Shape and surface

- Hero/feature regions: 22–24px radius.
- Standard sections and evidence frames: 14–18px radius.
- Inputs, buttons, filters, and compact controls: 8–12px radius.
- Status lozenges may use a full pill when the compact silhouette aids recognition.
- Borders are fine warm-grey rules. Shadows are rare, warm-tinted, and reserved for genuinely raised surfaces.
- Subtle paper texture may be created with CSS-only radial/noise-like patterns, provided it does not reduce contrast or print quality.

### Motion

- One restrained route-entry sequence using opacity and a 4–8px vertical shift.
- Progress changes may use a short transform/opacity transition.
- Buttons receive tactile hover and pressed feedback.
- All motion is removed by the existing in-app reduced-motion preference and the operating-system preference.

## Information architecture and shell

The six existing routes and their URLs remain unchanged.

### Header

- Replace the dense application header with a calm two-tier editorial masthead.
- Brand and fictional-demo qualification remain immediately visible.
- Primary navigation becomes a compact, wrapping route index with a clear current-route treatment.
- Simulated role and accessibility preferences move into a visually distinct utility cluster without hiding them in a menu.

### Journey progress

- Replace the dashboard-like side rail with a horizontal case-progress strip below the masthead on wide screens.
- The strip shows all six lifecycle stages using number, name, actor, and textual state.
- On narrow screens it becomes an intentionally scrollable stage ribbon with visible continuation cues and preserved keyboard access.
- The strip continues to follow the furthest-advanced case away from entity routes.

### Page frame

- Content uses a maximum width around 1240px with generous responsive gutters.
- Pages use asymmetric editorial grids rather than a repeated sidebar/content template.
- The main landmark retains focus management and sticky-header scroll offset behavior.

## Route compositions

### Overview

- Lead with a large editorial statement about the active campus journey, paired with a compact case summary.
- Replace the equal metric-card row with a mixed-scale evidence index: one dominant count, two quieter supporting measures, and a direct audit action.
- Present barrier records as a numbered field register, not a conventional card grid.
- Filters sit on one composed line/region and retain accessible empty-state recovery.

### Guided audit

- Structure the screen like a field worksheet: journey context, evidence, measurements, and review provenance in a deliberate reading sequence.
- Keep the single decisive submission action visually anchored.
- Error summary remains prominent and receives focus.
- Unable-to-measure and evidence selection remain explicit controls, never hidden progressive disclosure.

### Barrier record

- Use a case-file composition with a strong record identifier, status, standards provenance, evidence plate, and activity chronology.
- Priority calculation becomes an annotated decision block rather than a generic form card.
- Validation, prioritisation, and hazard escalation remain distinct actions with hierarchy matching workflow legality.

### Work order

- Treat assignment as a repair brief: responsibility and remedy on one side, cost/due date and evidence on the other.
- Before/after evidence uses paired annotated frames with clear unmatched-location qualifications.
- The awaiting-verification handoff reads as a formal transfer, not a success-state celebration.

### Verification

- Present consent and independence as a visible verification charter near the top.
- The journey-time comparison becomes a clear before/retest table or paired field group.
- Decision controls remain plainly differentiated and bounded; acceptance cannot visually imply certification.
- Rework and inspection outcomes preserve prior evidence in the chronology.

### Impact

- Use an editorial report cover, a mixed-scale metric composition, and a source ledger.
- Preserve verified-only calculations and source IDs.
- Screen styling may be expressive, while print output remains one legible A4 page with no application chrome.

## Components and implementation boundaries

The redesign works within the existing React, TypeScript, Vite, and native CSS stack.

- Recompose `AppShell` and `LifecycleRail`; keep their behavior contracts stable where practical.
- Restyle shared primitives (`StatusBadge`, `EvidenceImage`, `MetricCard`, `ActivityTimeline`, `ErrorSummary`) and only alter markup where semantics or composition require it.
- Refactor CSS tokens and component rules rather than adding a UI library.
- Route screens may receive targeted wrapper/section markup changes for editorial layout.
- Domain modules, fixture semantics, reducer transitions, persistence envelope, and verified-only impact rules remain out of scope unless a visual change exposes an existing defect.
- No new dependencies, remote fonts, CDN assets, external network calls, backend, authentication, or certification claims.

## Responsive behavior

- At 901px and above, use the full masthead, horizontal progress strip, and asymmetric multi-column compositions.
- Between 701px and 900px, reduce column complexity while preserving visual hierarchy.
- At 700px and below, use a single reading column, scrollable progress ribbon, full-width primary actions, and stacked evidence comparisons.
- At 390px with large text enabled, no document-level horizontal overflow is permitted. Only the intentionally scrollable lifecycle ribbon may overflow internally.
- At 200% zoom, content reflows without clipping, overlap, or lost controls.

## Accessibility and error states

- Preserve skip navigation, landmarks, heading hierarchy, focus management, visible 3px focus treatment, and minimum target sizes.
- Current status and progress use text/symbols in addition to colour.
- Forced-colour mode retains borders, focus, state, and control legibility.
- High contrast, large text, and reduced motion remain persisted separately from demo reset.
- Validation errors remain inline and summarized; focus moves to the error summary.
- Missing evidence images retain their descriptive accessible fallback.
- Empty and unavailable states receive deliberately composed recovery content rather than blank panels.

## Testing and acceptance

Implementation follows test-driven development for behavior or markup changes.

Automated requirements:

- Existing 80-test suite remains green.
- Update focused shell/screen tests only where intentional markup or accessible names change.
- Add regression coverage for current-route navigation treatment and any new progress-strip behavior.
- TypeScript build, Vite production build, and `git diff --check` pass.

Browser requirements:

- Inspect every route at desktop and 390px after driving the real presenter journey.
- Verify keyboard-only completion, focus order, route focus, large text, reduced motion, high contrast, forced colours, missing-image fallback, and 200% reflow.
- Confirm no document-level horizontal overflow at 390px.
- Re-export and visually inspect the impact PDF; it must remain exactly one A4 page.
- Replace obsolete redesign screenshots with one clearly named current end-to-end evidence set.

## Success criteria

The redesign is successful when:

- It is immediately distinguishable from a generic card-dashboard or AI-generated landing page.
- The editorial fieldbook character is consistent across all six routes.
- Rounded geometry feels intentional and hierarchical rather than universally pill-shaped.
- A presenter can still complete the fictional workflow in under five minutes without ambiguity.
- All qualification, provenance, independence, measurement-honesty, accessibility, and print requirements remain intact.

# Task 10 report — end-to-end demo verification

## Result

The fresh fictional case completes audit → validate → prioritise → assign → repair evidence → independent acceptance → impact through keyboard activation of visible controls. The lifecycle rail follows the active case, route changes move focus to `<main>`, the work-order screen visibly continues to verification, and the impact report prints on one A4 page.

## TDD and defects fixed

1. The original presenter test failed because the lifecycle rail followed the first seeded barrier. Route-aware status fixed it.
2. The connected test exposed the missing work-order continuation. A visible verification continuation fixed it.
3. Round-one keyboard inspection showed focus falling to `<body>` after navigation. A presenter-test assertion failed with `<body>` focused; route navigation now schedules focus on `#main-content`, and the test passes.
4. Fresh print inspection showed `1 / 2` pages. Print-only typography and spacing were reduced; regenerated preview shows `1 / 1` with the heading, metrics, traceability table, and disclaimer legible.

## Browser acceptance evidence

All browser commands used `agent-browser` against `http://127.0.0.1:5173` from a fresh local Vite server.

- **Keyboard-only core journey:** each visible control was focused and activated with `press Enter` or `press Space`; role selects were changed using arrow keys. Final evaluation was `{"url":"/impact","heading":"Bounded verified outcomes","verified":"1","role":"verifier"}`. Agent-run elapsed time: **7.34 seconds**, under five minutes. Artifact: `verification/task-10/keyboard-impact.png`.
- **Focus visibility/order:** initial Tab reached the skip link with a 3px computed outline. The new automated route assertion verifies that focus moves to the main landmark after navigation. Core actions are native buttons, checkbox, and select controls and completed without pointer activation.
- **200%-equivalent reflow:** the audit was rendered with CSS page zoom `2` at a 780px viewport, producing `zoom: "2"`, `clientWidth: 765`, `scrollWidth: 765`, `overflow: false`; artifact: `verification/task-10/audit-200-percent.png`. Key-screen narrow reflow was separately checked at 390px: impact `clientWidth: 390`, `scrollWidth: 390`, `overflow: false`; artifact: `verification/task-10/impact-390-reflow.png`.
- **Forced colours:** Chromium launched with `--force-high-contrast`; `matchMedia('(forced-colors: active)').matches` returned `true`. At 390px, three buttons remained present, current-stage text was `1ObservedAuditorCurrent`, and document overflow was false. Artifact: `verification/task-10/forced-colors-audit.png`.
- **Missing-image fallback:** the audit evidence image URL was replaced with `/media/deliberately-missing-task10.jpg`. Evaluation returned `fallback: "Illustrative evidence unavailable"`, preserved the descriptive `aria-label`, and reported `imageCount: 0`. Artifact: `verification/task-10/missing-image-fallback.png`.
- **Print:** `agent-browser pdf verification/task-10/impact-print.pdf` generated the final PDF. It was reopened in Chromium's PDF viewer and visually inspected at original detail. The viewer reports `1 / 1`; heading, three metrics, traceability content, and disclaimer are visible without clipping. Artifacts: `verification/task-10/impact-print.pdf` and `verification/task-10/impact-print-preview.png`.
- **Large text and reduced motion:** at 390px, the in-app text-size control raised the root font from 16px to 19px and settled at `clientWidth: 390`, `scrollWidth: 390`, `overflow: false`. The reduced-motion control changed the screen-entry animation from `stage-in` to `none`. Artifact: `verification/task-10/large-text-reduced-motion-390.png`.

Representative commands (all exited 0):

```powershell
agent-browser --session keyboard press Enter
agent-browser --session keyboard press Space
agent-browser --session zoom eval "document.documentElement.style.zoom='2'"
agent-browser --session forced --args "--force-high-contrast" open http://127.0.0.1:5173/audit
agent-browser --session fallback eval "document.querySelector('.evidence-card img').src='/media/deliberately-missing-task10.jpg'"
agent-browser --session printsource pdf verification/task-10/impact-print.pdf
```

## Final command evidence

Recorded immediately before commit:

- `npm test` — exit 0; 11 test files and 80 tests passed.
- `npm run build` — exit 0; TypeScript and Vite production build completed, 40 modules transformed.
- `git diff --check` — exit 0.

## Post-plan verification (2026-08-15)

After implementation of defect fixes listed in `HANDOFF.md`:

1. **Fabricated measurements eliminated.** Verifications without before/after outcomes no longer generate default records. The impact report now skips such records entirely, ensuring all reported metrics are grounded in recorded data.
2. **Verifier can enter journey times.** The VerificationScreen now has two `<input type="number">` fields for before and after minutes, plus a checkbox for whether the pre-repair journey was successful. Values no longer default to 12/7.
3. **Demo state persists.** `App.tsx` calls `saveDemoState(state)` in a `useEffect` after every reducer dispatch. The presenter-journey test asserts this by reading localStorage and confirming a verified barrier exists.
4. **Pilot spend no longer reads zero.** Cost bands like `₹10,000–₹25,000` are parsed by extracting digit groups and taking their midpoint, yielding `17500`.
5. **Lifecycle rail follows current case.** The LifecycleRail reads `barrier.status` and maps it to a progress index. It no longer resets to barriers[0].
6. **Text breaks fixed in rail.** StatusBadges in the lifecycle rail sit on `grid-column: 2` (their own row) to prevent mid-word breaks in the 280px rail content area.
7. **Sticky header no longer clips headings.** Route navigation focuses `#main-content` (the main element), which now has `scroll-margin-top: var(--space-3)` so the sticky navigation bar does not overlap the page top. Headings retain their own `scroll-margin-top` (140px in base.css) for when they are individually linked or focused.

## Scope and remaining concerns

The implementation changes remain integration/accessibility focused: route-aware lifecycle state, one continuation control, route focus management, and print-only layout. Domain transitions and qualification language are unchanged. Timing is an agent-driven keyboard run, not an unfamiliar human-presenter study. The 200% check uses standards-supported CSS page zoom plus a separate 390px reflow check because the installed headless CLI does not expose browser zoom level directly.

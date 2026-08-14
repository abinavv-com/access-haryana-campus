# Handoff — Access Haryana Campus

Written 2026-08-14. Read this before touching the code.

## Where the work lives

- **Branch:** `feature/access-haryana-build`, currently **21 commits ahead of `master`**.
- **Worktree:** `D:\HMC work\011-access-haryana-campus\.worktrees\access-haryana-build`.
  `.worktrees/` is gitignored from `master`'s tree — the code is only on the branch, not in the main checkout.
- **`master` is still at `2c7b7a2`** (docs and scaffold only). Nothing has been merged. There is no deployment.

## State: green

Verified immediately before this handoff, from the worktree:

```sh
npx vitest run    # 11 files, 78 tests, all passing
npx tsc -b        # exit 0
npx vite build    # exit 0
git diff --check  # exit 0
```

All ten tasks in `docs/superpowers/plans/2026-08-13-access-haryana-campus-implementation.md` are complete, plus four blocks added afterwards (see below). Do not restart from the plan — it is finished.

## What landed after the plan

| Commit | Contents |
|---|---|
| `11b7b89` | Guideline provenance on every barrier; before/after journey outcomes feeding four new impact metrics; app hydration, recoverable-storage notice, real entity routes in the primary nav |
| `75a6a64` | Full Superdesign visual pass over `src/styles/*`; demo-state persistence; cost-band parser fix |
| `f37f97d` | Rail follows the furthest-advanced case off entity routes; sticky-header scroll offset on `<main>` |

Design direction is locked in `.superdesign/design-system.md`. It is the source of truth for palette, type scale, layout metrics and the "do not" list. The `.superdesign/tmp/run-flow.mjs` draft flow was **not** re-run; the design system doc is the durable artifact from it.

## Defects fixed during review — do not reintroduce

These were all found by looking at rendered screenshots, not by reading code. Several passed tests while being wrong.

1. **Fabricated measurements.** Missing journey outcomes were defaulted to `{succeeded: false, completionMinutes: 0}`, which silently polluted the impact metrics. Outcomes are now optional (`JourneyOutcome` in `src/domain/types.ts`) and `ImpactScreen` skips records lacking them. Never default a measurement nobody recorded.
2. **Verifier could not enter journey times.** `beforeMinutes`/`afterMinutes` were hardcoded 12/7 with no inputs, so "5 min saved" was invented. `VerificationScreen` now has both number fields plus a before-success checkbox.
3. **Demo state never persisted.** `loadDemoState` was called but `saveDemoState` was imported nowhere; a mid-presentation refresh dropped the case to its seed. `App.tsx` now saves on every state change, asserted at the end of `presenter-journey.test.tsx`.
4. **Pilot spend read zero.** The cost-band regex could not handle `₹` before the second figure, so `₹10,000–₹25,000` matched nothing. Replaced with a digit-group midpoint; now renders `₹17,500`.
5. **Rail reset to "Observed" on `/impact`.** It fell back to `barriers[0]` — a seeded case still at observed — while the presenter's case is a newly created barrier. The final screen contradicted its own report.
6. **Mid-word text breaks in the rail** ("Obser ved", "Design ated review er") from `overflow-wrap: break-word` on a grid column squeezed by the status pill. Fixed by moving the pill to its own row, not by fighting for width.
7. **Sticky header clipped every heading after navigation.** `scroll-margin-top` was on headings, but route changes focus `#main-content`. It belongs on `.app-layout main`.

## Open items, in priority order

1. **`print.css` uses `!important` throughout.** It is imported from `ImpactScreen.tsx`, so it lands earlier in the cascade than `components.css` and loses ties at equal specificity. The clean fix is moving the import to `main.tsx` after the other stylesheets, then stripping the `!important`s. The one-page A4 output is verified working as-is (`verification/design/impact-print.pdf`) — do not change this without re-exporting a PDF and looking at the page count.
2. **Hardcoded verification timestamp.** `VerificationScreen` dispatches `timestamp: '2026-08-15T10:00:00.000Z'`. This keeps tests deterministic but means "Days to verification" is a fixed artifact of the fixture rather than elapsed demo time — the live run reports `2 days` where the unit test expects `5 days`. Decide whether the metric should be honest about this or whether the timestamp should be injected.
3. **Two accessibility preferences are code-verified only.** `data-text-size=large` and `prefers-reduced-motion` have rules in `base.css` but were never driven in a browser. Forced colours and high contrast were both checked visually. Close this gap before presenting.
4. **`verification/design/` mixes iterations.** It contains pre-fix screenshots alongside current ones; `tour-1` … `tour-9` are the current end-to-end pass. Prune the stale ones so nobody reviews an obsolete image.
5. **README is behind.** It does not mention the journey-outcome metrics, state persistence, or the design pass. `task-7`…`task-10-report.md` are likewise stale.
6. **Nothing is merged or deployed.** Merging to `master` and choosing a hosting target are both still open decisions.

## How to verify visually

`agent-browser` is the working CLI (see `task-10-report.md` for exact syntax). Note two gotchas found the hard way:

- `vite preview` must be bound explicitly: `npx vite preview --port <n> --host 127.0.0.1`. Without `--host` the CLI gets `ERR_CONNECTION_REFUSED`.
- `agent-browser find role button "<name>"` and `click "text=…"` both failed against this app. Clicking via `eval` works:
  `agent-browser --session x eval "[...document.querySelectorAll('button')].find(b=>b.textContent.includes('…')).click()"`

Drive the real journey rather than loading screens cold — most of the defects above are only visible in a state the app reached itself.

## Non-negotiables

From the spec and design system, both of which override convenience:

- Never claim certified, universally accessible, or legally compliant. Acceptance is bounded to one journey, access requirement and set of test conditions.
- Every standards-related check shows source, edition year and clause/section. Every record is labelled illustrative demo data.
- The verifier must stay structurally independent of the repair owner.
- State is never communicated by colour alone.
- WCAG 2.2 AA: keyboard operation, visible focus, 200% reflow, 390px with no horizontal overflow, forced colours, reduced motion.
- No new dependencies, no remote fonts, no CDN, no external network requests.
- Production code is written only after a focused test has failed for the expected reason.

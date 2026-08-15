# Editorial fieldbook redesign acceptance report

Date: 15 August 2026 (Asia/Calcutta)

## Scope and environment

Acceptance was run against the production Vite preview at `http://127.0.0.1:4173/` with the globally installed `agent-browser` Chromium CLI. The preview was started hidden with:

```powershell
npx vite preview --port 4173 --host 127.0.0.1
```

`Invoke-WebRequest -UseBasicParsing http://127.0.0.1:4173/` returned HTTP `200` with a 406-character shell response.

## Baseline automated verification

The required baseline was run before browser acceptance:

| Command | Exact result |
| --- | --- |
| `npx vitest run` | Exit 0; 11 test files passed; 97 tests passed; 0 failed; Vitest duration 18.38s. |
| `npx tsc -b` | Exit 0; no diagnostics. |
| `npx vite build` | Exit 0; 40 modules transformed; `dist/index.html` 0.40 kB, CSS 41.71 kB, JS 255.15 kB. |
| `git diff --check` | Exit 0; no output. |

The browser-discovered reflow fix added one regression. Its focused red-green run was:

- RED: `npx vitest run src/screens/verification-impact.test.tsx` — 1 expected failure and 9 passes because the container-width reflow contract was absent.
- GREEN: the same command — 1 file passed, 10 tests passed, 0 failed.
- Rebuilt preview after the fix — exit 0; 40 modules transformed; CSS 41.84 kB and JS 255.15 kB.

The complete post-documentation verification then returned:

| Command | Exact result |
| --- | --- |
| `npx vitest run` | Exit 0; 11 test files passed; 98 tests passed; 0 failed; Vitest duration 7.72s. |
| `npx tsc -b` | Exit 0; no diagnostics. |
| `npx vite build` | Exit 0; 40 modules transformed; `dist/index.html` 0.40 kB, CSS 41.84 kB, JS 255.15 kB; built in 151ms. |
| `git diff --check` | Exit 0; no whitespace errors. Git emitted only its existing LF-to-CRLF working-copy notices for three text files. |

## Keyboard presenter journey

A fresh `task7-acceptance` browser session completed the persisted audit → validate → prioritise → assign → repair evidence → independent acceptance → impact journey. Navigation and actions used Tab, Shift+Tab, Enter, Space, ArrowDown, and ArrowUp. Route transitions to `/audit`, `/barriers/audit-obstruction-2026`, `/work-orders/audit-obstruction-2026`, `/verification/audit-obstruction-2026`, and `/impact` each placed focus on `<main id="main-content">`.

The current tour artifacts are:

1. `tour-01-overview.png` — seeded overview and fictional evidence register.
2. `tour-02-audit.png` — guided field audit with selected illustrative evidence.
3. `tour-03-barrier-observed.png` — submitted screening record in Observed state.
4. `tour-04-barrier-validated.png` — designated review recorded without a compliance claim.
5. `tour-05-barrier-prioritised.png` — calculated priority and repair-work-order handoff.
6. `tour-06-work-order-assigned.png` — assigned owner, remedy, cost band, due date, and unmatched illustrative before/after evidence.
7. `tour-07-repair-evidence.png` — evidence submitted and explicitly awaiting independent verification.
8. `tour-08-independent-acceptance.png` — voluntary, independent bounded retest accepted for the recorded journey and conditions.
9. `tour-09-impact.png` — one qualifying verified record with metrics and a traceable source ledger.

All nine full-page captures were opened and visually inspected. Headings, controls, lifecycle words/glyphs, evidence qualifications, provenance, actor-attributed chronology, and the distinction between submitted repair evidence and accepted verification remain visible.

## 390px preferences and overflow

At a `390 × 844` viewport after layout settled:

- Large text: root computed font size was `19px`; `documentElement.scrollWidth` and `clientWidth` were both `375px` (the vertical scrollbar consumed the remaining viewport width), so document overflow was false. The only internally overflowing element was `nav.case-progress.lifecycle`, `1977 / 375px`, with computed `overflow-x: auto`. Artifact: `large-text-390.png`.
- Reduced motion: the Reduce motion control was checked and every rendered element reported `animation-name: none`; the prior impact sections had reported `stage-in`. Artifact: `reduced-motion-390.png`.
- Forced colours: Chromium launched with `--force-high-contrast`; `matchMedia('(forced-colors: active)').matches` was `true`. Document width was `390 / 390px`; document overflow was false. Three buttons, five inputs, explicit current-state text (`01 Observed Auditor Current`), borders, and controls remained visible. Keyboard focus on Increase text size had computed outline `rgb(0, 120, 215) solid 3px`. Artifact: `forced-colours-390.png`.

The three preference artifacts were opened at original detail and visually inspected.

## 200%-equivalent reflow

The first impact check at a 780px viewport with `document.documentElement.style.zoom = '2'` reproduced document overflow (`818 / 765px`). Investigation found that viewport media queries still saw 780px while the rendered impact container was about 351px wide, so desktop cover and 12-column metric geometry remained active.

A focused failing regression was added before production CSS changed. The impact report now establishes an inline-size container and activates wide cover/metric geometry from the rendered container width. The repeated browser check measured:

- viewport: `780 × 844`;
- CSS zoom: `2`;
- root font: `16px`;
- document width: `765 / 765px` — no document overflow;
- impact inline size: `351px`;
- cover grid: one `348.5px` column;
- metric grid: one `286.109px` column;
- only intentional internal overflow: `nav.case-progress.lifecycle`, `1665 / 383px`.

The corrected rendered frame was inspected and all impact content reflowed as one legible column.

## Missing-image fallback

On the completed work order, the first evidence image URL was replaced at runtime with `/media/deliberately-missing-task7.jpg`. The failed image was replaced by a visible `role="img"` fallback measuring `527 × 395.25px`, with the original descriptive accessible label:

> Illustrative example of tactile paving obstructed by street furniture and other objects.

The fallback displayed `Illustrative evidence unavailable` and preserved the evidence caption and provenance. It was inspected in a temporary browser capture; no extra acceptance artifact was retained.

## Print acceptance

From the completed impact state, `agent-browser --session task7-acceptance pdf verification/redesign/impact-print.pdf` generated the current PDF. It was reopened through Chromium's PDF viewer, fitted to page, and captured as `impact-print-preview.png`.

- Viewer page indicator: `1 / 1`.
- PDF size: 102,991 bytes.
- Preview viewport: `1440 × 1000`; fitted zoom shown by Chromium: `89%`.
- Visual inspection: the evidence-chain cover, inclusion rule, all seven metric blocks, source ledger IDs, and bounded fictional-demo disclaimer are legible and unclipped.

## Prototype boundaries

- This is a frontend-only, local-storage demonstration; it has no backend, live records, account authentication, or authorization.
- Simulated role selection changes presentation perspective only.
- Campuses, records, dates, costs, roles, evidence, and outcomes are fictional or illustrative.
- Local images show unrelated locations and are not a matched real-world before/after pair.
- Screening and prioritisation are bounded workflow demonstrations, not professional assessments, diagnoses, statutory certifications, accessibility conformance claims, or determinations of legal compliance.
- A verified record reports only one defined journey, access requirement, test conditions, repair evidence, and voluntary independent retest. It does not establish universal usability.

# Task 3 — Shared evidence and status primitives

## RED evidence

Added focused screen assertions before production changes, then ran:

```text
npx vitest run src/screens/overview-audit.test.tsx src/screens/verification-impact.test.tsx
```

Result: 4 failed, 8 passed. The expected failures were the absent `evidence-plate`, `error-brief`, `case-chronology`, and `report-metric` classes.

## Implementation

- Reworked the five shared primitives around the requested editorial structures while retaining their prop contracts and existing compatibility classes.
- Kept evidence `figure`, image/fallback accessible name, captured date, and evidence ID; added semantic `time` provenance.
- Kept `role="alert"`, focus behavior, heading, and message list; linked the heading and messages through generated IDs.
- Retained the ordered timeline and added numbered status, reason, actor, and localized-time metadata.
- Applied warm ruled evidence, chronology, error, and varied metric styling using the established tokens.

## GREEN results

```text
npx vitest run src/screens/overview-audit.test.tsx src/screens/verification-impact.test.tsx
Test Files  2 passed (2)
Tests  12 passed (12)
```

```text
npm run build
tsc -b && vite build
✓ built in 384ms
```

`git diff --check` completed with exit code 0.

## Commit

`style: create editorial evidence primitives`

## Self-review

- Confirmed no routes, domain data, reducer, storage, calculations, or presenter flow changed.
- Confirmed `.record-status`, `.evidence-plate`, `.report-metric`, `.case-chronology`, and `.error-brief` are present.
- Confirmed `.metric-value`, existing class compatibility, text status, keyboard focus, reduced-motion behavior, forced-colour border handling, and narrow layout contracts remain intact.

## Concerns

None.

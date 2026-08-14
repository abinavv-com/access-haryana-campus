# Access Haryana Campus

A frontend-only Haryana Ideathon demonstration of a fictional campus accessibility workflow: audit, designated review, prioritisation, repair assignment, repair evidence, independent bounded retest, and traceable impact. The demo persists its case state in local storage so a refresh does not interrupt the presenter journey.

All campuses, records, dates, costs, people/roles, and outcomes in the app are fictional or illustrative demo data. The screening workflow is not a professional assessment, statutory certification, or determination of legal compliance.

## Run locally

Requires a current Node.js installation.

```sh
npm install
npm run dev
```

Vite prints the local URL. Open it in a browser and choose **Continue guided audit** to begin the presenter journey.

## Verify

```sh
npm test
npm run build
git diff --check
```

The production output is written to `dist/`.

Task 10 browser acceptance evidence is retained in `verification/task-10/`. It includes the completed keyboard journey, 200%-equivalent reflow, large-text and reduced-motion preferences, forced-colours rendering, missing-image fallback, and the one-page print PDF plus its inspected preview. The current end-to-end design sequence is `verification/design/tour-1-*.png` through `tour-9-*.png`; obsolete iterations have been removed.

The impact report includes only accepted, verified records with recorded before/after journey outcomes. It derives journey success rates, time saved, elapsed days, illustrative pilot spend, and source record IDs; missing outcomes are excluded rather than inferred.

## Demo controls

Use the **Simulated role** selector when the journey moves from Auditor to Facilities and then Verifier. This changes presentation context only; it is not authentication or an access-control mechanism.

**Reset demo** opens a confirmation dialog and restores the original fictional fixture. Text size, high contrast, and reduced-motion preferences are stored separately and remain after the case reset.

Verification timestamps use the instant at which the demo action occurs. Tests inject a fixed clock so automated expectations remain deterministic.

## Media

Illustrative images are stored locally in `public/media/`. Source pages, creators, licences, modifications, and retrieval dates are recorded in [`public/media/ATTRIBUTION.md`](public/media/ATTRIBUTION.md). The images show unrelated locations and must not be interpreted as the fictional campus or as a matched real-world before/after pair.

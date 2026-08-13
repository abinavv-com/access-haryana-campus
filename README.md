# Access Haryana Campus

A frontend-only Haryana Ideathon demonstration of a fictional campus accessibility workflow: audit, designated review, prioritisation, repair assignment, repair evidence, independent bounded retest, and traceable impact.

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

## Demo controls

Use the **Simulated role** selector when the journey moves from Auditor to Facilities and then Verifier. This changes presentation context only; it is not authentication or an access-control mechanism.

**Reset demo** opens a confirmation dialog and restores the original fictional fixture. Text size, high contrast, and reduced-motion preferences are stored separately and remain after the case reset.

## Media

Illustrative images are stored locally in `public/media/`. Source pages, creators, licences, modifications, and retrieval dates are recorded in [`public/media/ATTRIBUTION.md`](public/media/ATTRIBUTION.md). The images show unrelated locations and must not be interpreted as the fictional campus or as a matched real-world before/after pair.

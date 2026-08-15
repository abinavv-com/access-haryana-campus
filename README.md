# Access Haryana Campus

A frontend-only Haryana Ideathon demonstration of a fictional campus accessibility workflow: audit, designated review, prioritisation, repair assignment, repair evidence, independent bounded retest, and traceable impact. The demo persists its case state in local storage so a refresh does not interrupt the presenter journey.

All campuses, records, dates, costs, people/roles, and outcomes in the app are fictional or illustrative demo data. The screening workflow is not a professional assessment, statutory certification, or determination of legal compliance.

## Visual design

The interface passed a Superdesign visual review. All typography, spacing, colour, and component rules are locked in [`.superdesign/design-system.md`](.superdesign/design-system.md).

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

The current end-to-end browser acceptance evidence is in `verification/redesign/`. It contains the nine-frame keyboard journey, 390px large-text/reduced-motion/forced-colours captures, the one-page impact PDF and its inspected Chromium preview, and `acceptance-report.md` with exact measurements and prototype boundaries. Earlier Task 10 and design-tour evidence is retained in `verification/task-10/` and `verification/design/` as historical reference.

The impact report includes only accepted, verified records with recorded before/after journey outcomes. Metrics reported are: verified repair count, successful journey tests, baseline success rate, verified success rate, average time saved, elapsed days to verification, illustrative pilot spend (midpoint of cost-band range), and cost per verified repair. Records lacking before/after journey outcomes are excluded rather than inferred; this keeps all reported metrics grounded in observed data.

## Demo controls

Use the **Simulated role** selector when the journey moves from Auditor to Facilities and then Verifier. This changes presentation context only; it is not authentication or an access-control mechanism.

**Reset demo** opens a confirmation dialog and restores the original fictional fixture. Text size, high contrast, and reduced-motion preferences are stored separately and remain after the case reset.

All case state (barriers, work orders, verifications, activity) is saved to localStorage on every change. Closing and reopening the browser tab, or refreshing the page, resumes from the saved state. Text size, high contrast, and reduced-motion preferences are stored under a separate key so they survive a case reset.

Verification timestamps use the instant at which the demo action occurs. Tests inject a fixed clock so automated expectations remain deterministic.

## Media

Illustrative images are stored locally in `public/media/`. Source pages, creators, licences, modifications, and retrieval dates are recorded in [`public/media/ATTRIBUTION.md`](public/media/ATTRIBUTION.md). The images show unrelated locations and must not be interpreted as the fictional campus or as a matched real-world before/after pair.

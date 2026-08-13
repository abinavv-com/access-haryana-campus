# Access Haryana Campus Design System

## Product and audience

Access Haryana Campus is a fictional-data Ideathon demonstration of an auditable barrier-to-fix workflow for higher-education campuses. It must work for a jury presentation while remaining credible to student auditors, facilities officers and accessibility testers. The product is operational software, not a marketing landing page and not a legal compliance authority.

## Architecture and key journey

One responsive application contains Overview, Guided Audit, Barrier Record, Work Order, Verification and Impact Report. A persistent demo rail connects the six stages: Observed, Validated, Prioritised, Assigned, Fixed/Awaiting Verification and User Verified. A visible simulated-role switcher hands the story between Auditor, Facilities and Verifier.

## Visual direction

Use a high-contrast Swiss public-service language inspired by the selected High Contrast design reference, adapted for dense operational UI rather than a landing page. The memorable device is the evidence-chain rail, not decorative typography.

- Canvas: warm off-white `#F3F1EA`.
- Ink: near-black navy `#101820`.
- Surface: white `#FFFFFF`; muted surface `#E8E5DC`.
- Primary action accent: Haryana saffron `#D85A1A`; hover `#B94710`; focus outline `#1261A0`.
- Verified: `#176B45`; warning: `#9A6700`; danger/escalation: `#B42318`; informational: `#1261A0`.
- Never communicate state through colour alone.
- Do not introduce purple, neon gradients, glassmorphism or decorative AI imagery.

## Typography

Use a single accessible geometric sans family throughout. Prefer Satoshi if available in the design environment, falling back to Arial/sans-serif for implementation reliability. Display headings use 700 weight with tight but readable tracking; body copy uses 400–500. Do not use serif italics or the reference’s echo-stack effect because they reduce clarity in this public-service product.

- Page title: 48–64 px desktop, 36–44 px mobile, line-height 1.0–1.1.
- Section heading: 24–32 px, line-height 1.15.
- Body: 16–18 px, line-height 1.5.
- Labels/meta: 13–14 px, uppercase only for short stage labels.
- Numeric evidence may use tabular figures.

## Layout

- Desktop viewport target: 1440 × 1000.
- Sticky 72 px header, persistent left demo rail around 280 px, main content max width around 1040 px.
- Use an asymmetrical 12-column grid for the overview: dominant next-action/evidence panel plus narrow traceability/status column.
- On mobile, header and role controls wrap; rail becomes a horizontal ordered stage navigator; all content is single column.
- Minimum interactive target 44 × 44 px.
- Use 1 px ink/15% borders and 4–10 px corner radii; reserve pills for compact statuses only.
- Shadows are minimal and functional; separation comes from borders, spacing and contrast.

## Core components

### Demo banner and role handoff

Persistent banner: “Demo mode — fictional records and illustrative images.” Role switcher clearly says it simulates perspective and is not authentication. Each role change updates the current task and next-action copy.

### Evidence lifecycle rail

An ordered six-stage vertical rail with numbered square markers, textual state, actor, and current/complete/upcoming semantics. Rework maps back to Assigned with an explicit “Action required” tag. The rail must have an equivalent ordered text structure.

### Evidence cards

Images are supporting evidence and paired with structured measurements, source/standard reference, descriptive alt text and provenance. Never use a before/after slider. Use side-by-side panels on desktop and stacked panels on mobile.

### Forms

Labels always precede fields. Help and units are adjacent. Invalid submission creates an error summary and field messages. Focus rings are 3 px blue with 2 px offset. One decisive prefilled action per demo stage keeps the guided story under five minutes.

### Metrics and traceability

Every metric says “Illustrative demo data” and links to source barrier, work order, evidence and verification records. Prefer number + plain-language explanation + small tabular breakdown. No decorative chart library.

## Motion

Use restrained 140–220 ms opacity/translate transitions only for stage handoff and status updates. Respect reduced motion and forced colours. No continuous animation, parallax, hover-only disclosure or scale effects on evidence images.

## Copy and safeguards

- Use “barrier report” or “screening finding” before validation.
- Use “verified repair for this journey and test conditions” after acceptance.
- Never use “certified,” “universally accessible,” or “legally compliant.”
- Display standard source, year and clause/section beside every standards-related check.
- A potential immediate hazard visibly triggers interim controls and urgent escalation.
- Verification is voluntary, requests no diagnosis, and is independent of the repair owner.

## Required first draft

Design the Overview / Command Centre at the start of the guided demo while visibly previewing the full end-to-end story. Show one primary “Main gate → Admissions” journey, the obstructed-landing screening finding as the next action, two backlog findings, illustrative campus evidence, priority and hazard cues, recent activity, the six-stage rail, role switcher, accessibility controls and a dominant “Continue guided audit” action. The screen must feel implementation-ready and contain realistic fictional content rather than placeholders.

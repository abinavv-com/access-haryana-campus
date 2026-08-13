# Access Haryana Campus — Ideathon Demo Design

## Objective

Build a polished, frontend-only Ideathon demonstration showing how a college can move from a reported accessibility barrier to a completed, user-verified repair. The prototype must tell one coherent story while exposing three perspectives: student field auditor, facilities command centre, and student verifier.

## Audience and presentation context

The primary audience is the Haryana State Ideathon 2026 jury. Secondary audiences are college administrators, facilities officers, students with disabilities, student audit volunteers, and accessibility experts.

The application is designed for a short live presentation. A presenter must be able to complete the main journey without explaining hidden setup, switching applications, or entering large amounts of data.

## Product principle

The product is a barrier-to-fix workflow, not a complaint map. A barrier only counts as resolved after repair evidence is submitted and an affected user retests the journey.

Simplified presentation lifecycle:

`Observed → Validated → Prioritised → Assigned → Fixed → User verified`

Canonical system states are `observed`, `validated`, `prioritised`, `assigned`, `awaiting_verification`, `verified`, and `rework_required`. “Fixed” in the presentation rail means repair evidence has been submitted and is awaiting independent verification; it never means completed or compliant. Potential immediate hazards also carry an escalation flag and interim-control record without bypassing the canonical state.

## Scope

The prototype will be one responsive React application with six connected screens:

1. Overview
2. Guided audit
3. Barrier record
4. Repair work order
5. User verification
6. Impact report

It will use realistic sample data and local browser persistence. It will not include authentication, a server, real uploads, statutory certification, public floor plans, or real personal data.

## Demo narrative

The seeded scenario follows a fictional mobility-access requirement on the journey from the main gate to the admissions office. One obstructed landing is the primary case taken through the full lifecycle. A ramp-gradient screening finding and missing directional signage remain visible as backlog items.

During the demo:

1. A student auditor selects the route and performs a standards-aligned screening.
2. The auditor records structured measurements and supporting photographic evidence. An observation is never labelled non-compliant.
3. A fictional designated reviewer validates or corrects the screening finding. Validation records reviewer role, date, disposition and measurement changes.
4. The command centre prioritises the barrier using severity, essential-service impact, absence of a safe dignified alternative, affected journeys and urgency. Fixability informs delivery sequencing only and cannot lower rights or safety urgency.
5. A facilities officer assigns a repair, owner, cost band and deadline.
6. Repair evidence changes the item to awaiting verification, not completed.
7. A consenting independent tester retests the defined journey and conditions and either accepts it for that bounded test or sends it to rework.
8. The impact report compares illustrative baseline and bounded verified outcomes and links each claim to its evidence chain.

## Information architecture

### Persistent application shell

- Product identity and Haryana Ideathon demo label
- Current campus selector
- Primary navigation
- Accessibility controls: text size, contrast and reduced motion
- Demo Journey rail showing the six stages and current progress
- Persistent “Demo mode — fictional records” banner and simulated perspective switcher for Auditor, Facilities and Verifier; this is presentation context, not authentication or access control
- “Reset demo” control with confirmation

### Overview

- Campus accessibility health summary
- Priority journeys and their completion status
- Barrier counts by lifecycle state and severity
- Recent work orders
- Primary action to continue the guided demonstration
- A concise explanation that maps/findings are outputs while verified repairs are outcomes

### Guided audit

- Route selection and step-by-step field checklist
- Applicable guideline reference beside each check
- Exact standard source, edition/year, clause or section and check type beside every standards-related prompt
- Measurement inputs with units and acceptable range guidance
- Evidence-photo selection using seeded local images
- Draft preservation and clear validation errors
- Submission creates a barrier record in the Observed state

### Barrier record

- Before photograph, location at coarse campus-zone level, description and measurement
- Standards reference and validation status
- Priority calculation explained in plain language
- Timeline of every state transition
- Action to validate and create a work order
- Immediate-hazard flag and interim-control record for warning, obstruction removal, alternate route, restricted use or urgent escalation

### Repair work order

- Owner, repair type, cost band, due date and notes
- Before/after evidence comparison
- Explicit distinction between “repair evidence submitted” and “verified complete”
- Submission moves the item to Awaiting verification

### User verification

- Journey retest checklist
- Before/after task completion and time comparison
- Accept for the defined journey/test conditions, reject to rework, or request another inspection
- Optional accessibility feedback without recording disability identity
- Rejection returns the work order to action required with a reason

### Impact report

- Verified repairs for defined journeys and test conditions
- Defined journey tests completed successfully
- Median repair time
- Estimated pilot spend and cost per verified fix
- Before/after journey success and completion time, each traceable to source records
- Print-friendly one-page evidence summary for an Ideathon pitch

All dashboard values, dates, users, costs and outcomes are conspicuously labelled “illustrative demo data.” The primary story does not use a median or cost-per-fix calculation unless the seeded fixture contains enough records for that aggregate to be meaningful. No bounded retest is described as universal usability, professional assessment, certification or legal compliance.

## Visual direction

The interface will use a trust-first public-service design language with a field-operations character.

- Warm off-white background and ink/navy text
- One saffron-orange action accent, with semantic green, amber and red reserved for status
- Strong typographic hierarchy using an accessible sans-serif family
- Square-to-soft rectangular geometry rather than excessive pill-shaped containers
- Visible focus states, generous targets and high contrast
- Restrained transitions that respect reduced-motion settings
- No decorative AI gradients, glassmorphism, inaccessible map dependence or hover-only controls

The memorable visual device will be the barrier lifecycle: every screen shows the same six-stage evidence chain, making progress and accountability unmistakable.

## Image and media policy

- Source reusable campus and accessibility photographs from the web only where their licensing permits reuse.
- Prefer authoritative government media libraries, Wikimedia Commons, Unsplash or Pexels, subject to verifying the individual asset licence.
- Download selected files into the project; do not hotlink them.
- Record the source page, creator, licence and retrieval date in `public/media/ATTRIBUTION.md`.
- Avoid identifiable disability imagery used merely as decoration.
- Prefer environmental evidence: ramps, entrances, corridors, signage and pathways.
- Use alt text that describes the relevant barrier or repair evidence.
- Seed the audit with a coherent before/after set; if a genuine matched pair cannot be licensed, clearly label the images as illustrative demo evidence rather than representing an actual repair.
- Treat images as supporting evidence only. Post-repair measurements and structured retest results are required when the original finding involved dimensions, gradient or performance.

## State model

Primary entities:

- `Campus`: identity and summary metrics
- `Journey`: origin, destination, checkpoints and success measurements
- `Barrier`: category, severity, evidence, guideline reference and lifecycle status
- `WorkOrder`: owner, remedy, cost band, due date and repair evidence
- `Verification`: decision, retest measurements, feedback and timestamp
- `ActivityEvent`: immutable display timeline of state changes

Every transition records actor perspective, prerequisites, time and reason. Invalid transitions change nothing and explain the missing prerequisite. Failed verification preserves all earlier evidence and creates `rework_required`; resubmission can return it to `awaiting_verification`. An additional-inspection request stays `awaiting_verification` and appends an event. Overdue and immediate-hazard conditions are flags, not fabricated lifecycle completion states.

An observation becomes `validated` only after review by the designated fictional reviewer. A record becomes `verified` only when repair evidence exists and a consenting tester independent from the repair owner accepts the result for the explicitly defined journey, access requirement and test conditions. No diagnosis is requested, participation is voluntary, refusal has no consequence, and professional assessment is required when the selected check cannot be responsibly verified through the bounded retest.

State is seeded from a versioned fixture and persisted to `localStorage`. Reset restores the original fixture. The application will validate transitions so a barrier cannot become verified without repair evidence and a verification decision.

## Accessibility and privacy requirements

- Target WCAG 2.2 AA for the prototype interface, including semantic landmarks and headings, skip navigation, logical focus order, focus management after navigation and validation, accessible notifications, screen-reader names/descriptions, non-drag alternatives, 200% zoom/reflow, forced-colours support and minimum target sizing.
- All core interactions must work with keyboard navigation.
- Status must never be communicated through colour alone.
- Forms must have associated labels, instructions and error summaries.
- Charts must have textual equivalents.
- Motion and animation must respect `prefers-reduced-motion`.
- No names, Aadhaar numbers, disability diagnoses, faces or precise personal route histories are required.
- Campus locations use zones rather than publishing security-sensitive detailed floor plans.
- The prototype is a standards-aligned screening and workflow tool, not legal certification.
- Accessibility controls supplement rather than replace browser and operating-system preferences.
- Before/after media has separate structured descriptions and never depends on a visual comparison slider.
- All fictional case records can be cleared from the device; accessibility preferences persist separately from demo-case reset.

## Standards baseline and terminology

The primary screening source is the Government of India’s **Accessibility Guidelines and Standards for Higher Education Institutions and Universities (2024)** as listed by the Department of Empowerment of Persons with Disabilities. The **Harmonised Guidelines and Standards for Universal Accessibility in India (2021)** may be referenced for built-environment details when relevant. Every seeded check must name its actual source, year and clause/section in the fixture; no clause will be invented during implementation.

The UI uses “barrier report” or “screening finding” before validation and “verified repair for this journey and test conditions” after an accepted retest. It reserves “compliant,” “certified” and “universally accessible” for qualified assessment outside this prototype.

Measurements use explicit units, plausible input bounds and plain-language rise/run help. Implausible values request confirmation rather than asserting failure. “Unable to measure” is a valid report outcome. The workflow separately records whether a safe, signed, available and comparably dignified alternative route exists; temporary routing is an interim control, never a permanent verified fix.

## Error and empty states

- Invalid audit measurements show field-level guidance and an error summary.
- Attempting an invalid lifecycle transition explains the missing prerequisite.
- Empty filters provide a recovery action.
- Missing demo image data falls back to an accessible evidence placeholder.
- Local persistence failure leaves the current session usable and explains that reset-on-refresh may occur.
- Corrupt or unsupported stored data falls back to the versioned fictional fixture with a non-blocking warning.

## Testing strategy

Implementation will follow test-driven development.

Automated tests will cover:

- Allowed and rejected lifecycle transitions
- Priority calculation
- Impact metric calculation
- Audit validation
- Work-order creation prerequisites
- Verification acceptance and rejection
- Local persistence and reset behaviour
- Filtering by status and severity
- Critical keyboard-driven interaction paths
- Safety escalation, rework and invalid-transition paths
- Exact traceability between every illustrative outcome and its barrier, work order, evidence, retest and timeline

The final verification pass will include unit/component tests, production build, desktop and 390-pixel mobile browser inspection, keyboard navigation, visible focus, 200% zoom/reflow, forced colours, reduced motion, missing-image fallback, print output and UTF-8 content checks. The guided path uses prefilled inputs and one decisive interaction per stage so it can be completed in under five minutes.

## Success criteria

The prototype succeeds when a presenter can complete the seeded audit-to-verification story in under five minutes; an unfamiliar observer can identify the current simulated role, status and next action; no keyboard step is blocked; no invalid transition bypasses a prerequisite; all standards and impact language is visibly qualified; and every metric is traceable to fictional seeded evidence.

## Explicit exclusions

- Backend APIs or database
- Real user accounts or role permissions
- Live geolocation or detailed public maps
- Real image uploads
- AI-generated compliance decisions
- Automated statutory certification
- Procurement, payments or contractor marketplace
- Statewide analytics presented as real outcomes
- Statutory accessibility determinations or claims that an illustrative image represents a real Haryana campus repair

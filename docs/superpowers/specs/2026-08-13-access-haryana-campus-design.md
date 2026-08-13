# Access Haryana Campus — Ideathon Demo Design

## Objective

Build a polished, frontend-only Ideathon demonstration showing how a college can move from a reported accessibility barrier to a completed, user-verified repair. The prototype must tell one coherent story while exposing three perspectives: student field auditor, facilities command centre, and student verifier.

## Audience and presentation context

The primary audience is the Haryana State Ideathon 2026 jury. Secondary audiences are college administrators, facilities officers, students with disabilities, student audit volunteers, and accessibility experts.

The application is designed for a short live presentation. A presenter must be able to complete the main journey without explaining hidden setup, switching applications, or entering large amounts of data.

## Product principle

The product is a barrier-to-fix workflow, not a complaint map. A barrier only counts as resolved after repair evidence is submitted and an affected user retests the journey.

Core lifecycle:

`Observed → Validated → Prioritised → Assigned → Fixed → User verified`

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

The seeded scenario follows a wheelchair user travelling from the main gate to the admissions office. The route contains a steep entrance ramp, an obstructed landing, and missing directional signage.

During the demo:

1. A student auditor selects the route and performs a standards-aligned screening.
2. The auditor records the ramp gradient and adds photographic evidence.
3. The command centre ranks the barrier using safety, frequency and fixability.
4. A facilities officer assigns a repair, owner, cost band and deadline.
5. Repair evidence changes the item to awaiting verification, not completed.
6. A student verifier retests the route and either accepts or rejects the result.
7. The impact report compares the baseline and verified journey outcomes.

## Information architecture

### Persistent application shell

- Product identity and Haryana Ideathon demo label
- Current campus selector
- Primary navigation
- Accessibility controls: text size, contrast and reduced motion
- Demo Journey rail showing the six stages and current progress
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

### Repair work order

- Owner, repair type, cost band, due date and notes
- Before/after evidence comparison
- Explicit distinction between “repair evidence submitted” and “verified complete”
- Submission moves the item to Awaiting verification

### User verification

- Journey retest checklist
- Before/after task completion and time comparison
- Accept, reject or request another inspection
- Optional accessibility feedback without recording disability identity
- Rejection returns the work order to action required with a reason

### Impact report

- Verified barriers removed
- Essential journeys made usable
- Median repair time
- Estimated pilot spend and cost per verified fix
- Before/after journey success and completion time
- Print-friendly one-page evidence summary for an Ideathon pitch

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

## State model

Primary entities:

- `Campus`: identity and summary metrics
- `Journey`: origin, destination, checkpoints and success measurements
- `Barrier`: category, severity, evidence, guideline reference and lifecycle status
- `WorkOrder`: owner, remedy, cost band, due date and repair evidence
- `Verification`: decision, retest measurements, feedback and timestamp
- `ActivityEvent`: immutable display timeline of state changes

State is seeded from a versioned fixture and persisted to `localStorage`. Reset restores the original fixture. The application will validate transitions so a barrier cannot become verified without repair evidence and a verification decision.

## Accessibility and privacy requirements

- Target WCAG 2.2 AA for the prototype interface.
- All core interactions must work with keyboard navigation.
- Status must never be communicated through colour alone.
- Forms must have associated labels, instructions and error summaries.
- Charts must have textual equivalents.
- Motion and animation must respect `prefers-reduced-motion`.
- No names, Aadhaar numbers, disability diagnoses, faces or precise personal route histories are required.
- Campus locations use zones rather than publishing security-sensitive detailed floor plans.
- The prototype is a standards-aligned screening and workflow tool, not legal certification.

## Error and empty states

- Invalid audit measurements show field-level guidance and an error summary.
- Attempting an invalid lifecycle transition explains the missing prerequisite.
- Empty filters provide a recovery action.
- Missing demo image data falls back to an accessible evidence placeholder.
- Local persistence failure leaves the current session usable and explains that reset-on-refresh may occur.

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

The final verification pass will include unit/component tests, production build, desktop and mobile browser inspection, keyboard navigation, visible focus, reduced motion and contrast checks.

## Success criteria

The prototype succeeds when a presenter can complete the seeded audit-to-verification story in under five minutes, the state transitions are understandable without narration, and the final report demonstrates the difference between reporting barriers and verifying repairs.

## Explicit exclusions

- Backend APIs or database
- Real user accounts or role permissions
- Live geolocation or detailed public maps
- Real image uploads
- AI-generated compliance decisions
- Automated statutory certification
- Procurement, payments or contractor marketplace
- Statewide analytics presented as real outcomes


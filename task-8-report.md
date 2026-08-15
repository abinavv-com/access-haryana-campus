# Task 8 report — Barrier validation and work order

## Delivered

- Barrier validation with named designated-reviewer provenance, qualified screening language, hazard escalation/interim controls, alternative-route status and immutable activity history.
- Explainable priority calculation with a selectable override band, mandatory rationale, and persisted calculated-versus-overridden result.
- Fully controlled work-order owner, remedy, cost-band and due-date fields validated by the shared domain validator; errors receive focus and exact entered values are preserved in the assigned record.
- Structured before/after illustrative evidence and repair submission that ends at `awaiting_verification`, never verified completion.

## TDD evidence

- Initial RED: focused tests failed because Task 8 screens did not exist.
- Review RED: focused tests failed for the missing override-band selector and editable cost/due fields.
- GREEN: `npm test -- src/screens/barrier-work-order.test.tsx` passed 3/3 tests after the review fixes.

## Self-review

- Override selection is passed to `calculatePriority`; the activity reason records original band, selected band, score and rationale.
- Work-order creation calls `validateWorkOrder` once with current controlled values and dispatches those same trimmed values.
- Reviewer identity is explicit in the immutable validation event reason while retaining the existing broad `facilities` perspective type.
- No independent-verification or impact-report behavior from Task 9 is included.

## Post-plan updates (2026-08-14 to 2026-08-15)

- The assigned work order preserves the user's controlled owner, remedy, cost band and due date through the repair-evidence transition.
- Every barrier now displays the standards/guideline provenance that informed its screening check, citing source, year, and section.
- The Superdesign visual pass locked all styling. The lifecycle rail's status badges were moved to their own grid row to prevent text breaks (e.g. "Obser ved") in the narrow 280px space.
- App state persists to localStorage after each transition, so navigation away and back resumes from the saved point.

## Remaining schema constraint

- The current domain schema has no dedicated reviewer-role, priority-assessment or hazard-record entity. These details remain in immutable activity reasons; this is an explicit prototype boundary, not missing display content.

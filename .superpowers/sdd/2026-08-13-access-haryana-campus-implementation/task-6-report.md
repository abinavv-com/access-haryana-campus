# Task 6 report — Accessible shell and lifecycle rail

## Outcome

Implemented the production React application shell and responsive six-stage evidence lifecycle rail using local CSS and the approved high-contrast public-service design tokens.

## Delivered

- Skip navigation, banner/header/main/primary-navigation/demo-journey landmarks and visible keyboard focus.
- Persistent fictional-data demo banner and explicit simulated-perspective disclaimer.
- Auditor, Facilities and Verifier switcher with role-specific current-task copy.
- Ordered, focusable six-stage lifecycle links with textual Complete/Current/Upcoming badges, `aria-current="step"`, actor labels and rework mapping to Assigned with Action required.
- Accessibility preferences for larger text, high contrast and reduced motion, persisted separately from case reset.
- Reset confirmation dialog that states preferences are retained.
- Responsive desktop rail / mobile horizontal navigator, forced-colours and reduced-motion CSS support.
- Minimal route content only to host the shell; no screen implementation was added.

## TDD evidence

- Red: focused suite initially failed because `src/app/App.tsx` did not exist.
- Green: focused suite passed after shell implementation.
- Additional red/green cycle added for text-size and high-contrast preferences.

## Verification

- `npm test -- src/app/App.test.tsx`: 6/6 passed.
- `npm test`: 56/56 passed across 7 files.
- `npm run build`: production build passed.
- `git diff --check`: passed.

## Self-review

- Status is expressed in text as well as colour.
- Every rail destination and shell control is keyboard-focusable with a minimum 44px target for controls.
- “Fixed” remains explicitly qualified as awaiting verification.
- Reset affects demo records but not accessibility preferences.
- No external CDN, decorative imagery, authentication implication or out-of-scope screen work was introduced.

## Concerns

- Route destinations are intentionally shell-only placeholders for later screen tasks.
- Browser-level visual, zoom and forced-colours inspection remains part of the final application verification pass.

## Fix round 1

- Added modal focus lifecycle: Cancel receives initial focus, Tab and Shift+Tab remain contained, Escape cancels, and focus returns to the Reset demo trigger.
- Added user-event coverage for focus initialization, forward/reverse containment, Escape and restoration.
- Aligned the preference key to `access-haryana-campus.preferences`.
- Guarded preference reads and writes so blocked or unavailable web storage does not prevent the shell or controls from working during the current session.
- Focused suite after fixes: 8/8 passed.

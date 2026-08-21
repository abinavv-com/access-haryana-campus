# Access Haryana Campus - Product Documentation

## Executive Summary

**Access Haryana Campus** is a responsive web application demonstrating an auditable barrier-to-fix workflow for higher-education campus accessibility. The platform enables auditors, facilities teams, and accessibility verifiers to collaborate on identifying, prioritizing, and resolving accessibility barriers through a structured, traceable process.

The application features a persistent evidence-chain workflow with six distinct stages: barrier discovery (Observed), validation, prioritization, work assignment, repair execution, and independent verification. Built with React and TypeScript, it provides a production-ready interface for managing accessibility compliance with comprehensive activity tracking, impact metrics, and role-based perspectives.

---

## Product Overview

### What It Does

Access Haryana Campus provides an end-to-end workflow for managing campus accessibility improvements:

1. **Barrier Discovery & Audit** - Guided discovery process identifying accessibility barriers on campus
2. **Validation & Prioritization** - Systematic review and priority assignment based on impact
3. **Work Assignment** - Facilities team receives and manages repair work orders
4. **Evidence Collection** - Before/after documentation with structured measurements and standards references
5. **Independent Verification** - Bounded retest by independent accessibility verifiers
6. **Impact Reporting** - Comprehensive metrics on verified repairs and success outcomes

### Key Features

- **Persistent Demo State** - LocalStorage-based state management preserves user progress across sessions
- **Role-Based Perspectives** - Simulated role switching (Auditor → Facilities → Verifier) shows different workflow stages
- **Evidence Tracking** - Structured evidence collection with images, measurements, and standards compliance
- **Activity Timeline** - Complete audit trail of all actions and decisions
- **Impact Metrics** - Real-time calculation of verified repairs, cost savings, and journey success rates
- **Accessibility First** - Supports text sizing, high contrast, reduced motion preferences
- **Responsive Design** - Fully responsive from mobile (320px) to desktop (1440px+)
- **Guided Journey** - 5-minute presenter journey with pre-filled demo data

### Design Philosophy

The interface follows a Swiss public-service design language emphasizing clarity, operational reliability, and evidence traceability:

- **High contrast** color palette with Haryana saffron accent (#D85A1A)
- **Dense operational UI** focused on data and decision-making, not marketing
- **Evidence-chain visualization** as the memorable design device
- **Restrained motion** with 140-220ms transitions only for state changes
- **Accessibility compliance** built-in: WCAG 2.1 AA standards, keyboard navigation, screen reader support

---

## User Journey

### 1. Overview (Command Centre)

The entry point displays:
- Current active journey (e.g., "Main gate → Admissions")
- Next action with priority and hazard indicators
- Backlog of identified barriers
- Illustrative campus evidence images
- Six-stage evidence lifecycle rail
- Recent activity timeline
- Role switcher and demo controls

**Role**: Auditor/Facilities Manager
**Primary Action**: "Continue guided audit" or "View all findings"

### 2. Guided Audit Screen

Progressive discovery of accessibility barriers:
- Structured questionnaire based on WCAG standards
- Evidence capture with photos and measurements
- Barrier description and immediate impact assessment
- Link to campus location
- Standard references (WCAG 2.1, campus safety guidelines)

**Role**: Auditor
**Actions**: Record finding, mark complete, move to validation

### 3. Barrier Record Screen

Detailed record of a single identified barrier:
- Full barrier description
- Measurement data and evidence images
- Standards compliance references
- Priority assignment (Low/Medium/High)
- Hazard indicators (if applicable)
- Previous activity and comments

**Role**: Facilities Team Lead
**Actions**: Estimate costs, assign resources, create work order

### 4. Work Order Management

Facilities team coordinates repairs:
- Work order details (scope, estimated cost, timeline)
- Resource assignment
- Before/after photo documentation requirements
- Completion status tracking
- Integration with campus systems

**Role**: Facilities Manager
**Actions**: Update status, log completion, upload evidence

### 5. Verification Screen

Independent accessibility retest:
- Guided verification journey following original audit criteria
- Before/after evidence comparison
- Journey success/failure recording
- Bounded retest scope documentation

**Role**: Accessibility Verifier
**Actions**: Conduct retest, record outcomes, verify completion

### 6. Impact Report

Comprehensive impact metrics and reporting:
- Verified repair count
- Successful journey tests
- Baseline vs. verified success rates
- Average time saved per journey
- Elapsed days to verification
- Cost analysis (illustrative)
- Exportable impact PDF

**Role**: Program Manager/Executive Sponsor
**Features**: 
- One-page summary for executives
- Detailed metrics with data sourcing
- Campus-wide comparison
- Trend analysis

---

## Technical Architecture

### Stack

- **Frontend**: React 19.2 + TypeScript 7.0
- **Build Tool**: Vite 8.2
- **Testing**: Vitest 4.1 + React Testing Library 16.3
- **State Management**: React Context + Hooks + LocalStorage
- **Styling**: CSS + BEM methodology
- **Accessibility**: WCAG 2.1 AA compliance

### Key Components

```
App
├── AppShell (header, sidebar, layout)
├── LifecycleRail (six-stage evidence chain)
├── Routes (screen navigation)
├── OverviewScreen
├── AuditScreen
├── BarrierScreen
├── WorkOrderScreen
├── VerificationScreen
├── ImpactScreen
├── ActivityTimeline
├── StatusBadge
├── ErrorSummary
├── MetricCard
└── EvidenceImage
```

### Data Flow

1. **Initialization**: Load fixture data or restore from LocalStorage
2. **State Management**: Central reducer (`demoReducer`) handles all state changes
3. **Persistence**: Every action automatically saves to LocalStorage
4. **Calculation**: Derived metrics computed from barrier records and verifications
5. **Navigation**: Route changes update state and trigger screen-specific logic

### Storage

- **LocalStorage Keys**:
  - `access-haryana-campus:case` - Main case state
  - `access-haryana-campus:preferences` - User text size, contrast, motion settings
  
- **Data Retention**: Case state persists until "Reset demo" is activated; preferences survive reset

### Verification & Testing

- Unit tests for calculations, validation, and storage
- Integration tests for complete user journeys
- End-to-end browser acceptance tests
- Lighthouse performance and accessibility audits
- A11y snapshot testing for keyboard navigation and screen readers

---

## Workflow States

### Barrier Lifecycle

```
Observed → Validated → Prioritised → Assigned → Fixed/Awaiting Verification → User Verified
```

### Role-Based Actions

| Role | Can Do | Sees |
|------|--------|------|
| **Auditor** | Create barriers, validate findings, assign priority | Audit screens, discovery workflow |
| **Facilities** | Create work orders, update status, log completion | Work orders, resource management |
| **Verifier** | Conduct retests, verify repairs, record outcomes | Verification screens, evidence comparison |

### Demo Controls

- **Simulated Role Selector**: Switch perspective without re-entering data
- **Reset Demo**: Clear all case state and restore fictional fixture
- **Accessibility Preferences**: Persist across resets (text size, high contrast, reduced motion)

---

## Data Model

### Barrier

```typescript
{
  id: string
  journey: string              // e.g., "Main gate → Admissions"
  location: string            // Campus location
  description: string
  standard: string            // WCAG 2.1 reference
  immediateHazard: boolean
  priority: "low" | "medium" | "high"
  evidence: Evidence[]
  createdDate: Date
  validatedDate?: Date
}
```

### Evidence

```typescript
{
  id: string
  type: "image" | "measurement" | "note"
  value: string               // URL or text
  unit?: string              // For measurements
  alt?: string               // For images
}
```

### Work Order

```typescript
{
  id: string
  barrierId: string
  status: "pending" | "in_progress" | "completed"
  estimatedCost: number
  actualCost?: number
  assignedTo: string
  timeline: string
  completionDate?: Date
}
```

### Verification

```typescript
{
  id: string
  barrierId: string
  workOrderId: string
  retestDate: Date
  testConditions: string
  beforeJourney: JourneyTest
  afterJourney: JourneyTest
  verified: boolean
  notes: string
}
```

---

## Metrics & Reporting

### Calculated Metrics

- **Verified Repair Count**: Barriers with successful verifications
- **Successful Journey Tests**: Routes that pass accessibility criteria
- **Baseline Success Rate**: Initial journey success percentage
- **Verified Success Rate**: Post-repair journey success percentage
- **Average Time Saved**: Hours saved per accessible route
- **Elapsed Days to Verification**: Time from barrier identification to verification
- **Cost per Verified Repair**: Illustrative cost analysis

### Data Sourcing

All metrics are traceable to underlying barrier records, work orders, and verification results. Metrics only include records with complete before/after journey outcomes—partial or inferred data is excluded to maintain data integrity.

### Impact PDF

One-page exportable PDF containing:
- Campus name and audit period
- Key metrics summary
- Barrier breakdown by type
- Cost analysis
- Executive summary
- Verification evidence

---

## Accessibility Compliance

### WCAG 2.1 AA Compliance

- ✓ Perceivable: High contrast, clear text, alt text for images
- ✓ Operable: Full keyboard navigation, no time limits, resizable text
- ✓ Understandable: Clear language, predictable interaction, form validation
- ✓ Robust: Semantic HTML, ARIA labels, screen reader optimization

### Built-In Features

- **Text Sizing**: 100% → 150% adjustable
- **High Contrast Mode**: Enhanced colors and borders
- **Reduced Motion**: Disable transitions and animations
- **Keyboard Navigation**: Tab through all elements, Enter/Space to activate
- **Screen Reader Support**: ARIA labels, live regions, semantic structure

### Testing

- Automated a11y testing via Axe
- Manual keyboard navigation testing
- Screen reader testing (NVDA, JAWS)
- Forced colors mode testing
- Zoom and text sizing validation

---

## Deployment & Operations

### Development

```bash
npm install                    # Install dependencies
npm run dev                    # Start dev server (http://localhost:5173)
npm test                       # Run test suite
npm run build                  # Build for production
```

### Production Build

- Minified JS and CSS
- Optimized asset hashing
- Source map generation
- Performance budget validation
- Lighthouse audit (mobile: 90+, desktop: 95+)

### Vercel Deployment

```bash
vercel deploy --prod           # Deploy to production
```

**Configuration**:
- SPA routing via `vercel.json` rewrites
- Node.js 18+ runtime
- 12-month cache on versioned assets
- Edge middleware support

### Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- iOS Safari 14.4+
- Mobile Chrome 90+

---

## Demo Data & Fiction Notice

**All records in this application are fictional and illustrative:**

- Campus names, locations, and layouts are not real
- Student and staff identities are completely fictional
- Dates, timelines, and historical records are for demo purposes
- Cost estimates are illustrative and based on fictional scenarios
- Images show unrelated locations and are not matched before/after pairs

**This application is NOT**:
- A professional accessibility assessment tool
- A statutory certification or compliance determination
- A legal opinion or guidance document
- A replacement for professional accessibility consulting

---

## Feature Roadmap

### Phase 2 (Future)

- [ ] Backend API integration for persistent data
- [ ] Multi-campus support with comparative analytics
- [ ] Real user authentication and role-based access control
- [ ] Email notifications and task assignments
- [ ] Integration with facilities management systems
- [ ] Advanced reporting and trend analysis
- [ ] Mobile app (iOS/Android)
- [ ] Offline support with sync

### Optimization Opportunities

- [ ] Implement virtual scrolling for large barrier lists
- [ ] Add progressive image loading
- [ ] Service Worker for offline capability
- [ ] GraphQL API for efficient data fetching
- [ ] Real-time collaboration features
- [ ] Advanced filtering and search

---

## Support & Feedback

This is a demonstration application created for the Haryana Ideathon competition. For technical questions, design feedback, or accessibility concerns, please refer to the accompanying documentation and verification evidence.

### Key Resources

- **Design System**: `.superdesign/design-system.md`
- **Verification Evidence**: `verification/redesign/` (screenshots, journey maps, Lighthouse audit)
- **Test Suite**: `npm test` - run to verify all functionality
- **Build Output**: `dist/` - production-ready bundle

---

## Colophon

**Version**: 0.0.0
**Last Updated**: 2026-08-21
**Build Tool**: Vite 8.2
**Framework**: React 19.2
**Deployment**: Vercel

All typography, spacing, color, and component rules are locked in the design system. Visual design passed Superdesign review and is optimized for both presentation and production use.

# Access Haryana Campus

A responsive web application demonstrating an auditable barrier-to-fix workflow for higher-education campus accessibility. Built for the Haryana Ideathon competition, this demo showcases how auditors, facilities teams, and accessibility verifiers collaborate on identifying, prioritizing, and resolving accessibility barriers through a structured, traceable process.

**Live Application**: https://011-access-haryana-campus.vercel.app

---

## 🎯 What This Is

Access Haryana Campus is **operational software, not a legal compliance tool**. It demonstrates:

- **Evidence-chain workflow**: 6-stage lifecycle (Observed → Validated → Prioritised → Assigned → Fixed/Awaiting Verification → User Verified)
- **Role-based perspectives**: Auditor, Facilities Manager, Accessibility Verifier
- **Persistent state management**: LocalStorage-based, survives page refresh
- **WCAG 2.1 AA compliance**: Full accessibility support (text sizing, high contrast, reduced motion)
- **Responsive design**: Mobile-first, works on 320px to 1440px+ viewports

**All data is fictional**. Campus names, staff identities, dates, costs, and scenarios are illustrative only.

---

## ✨ Key Features

| Feature | Description |
|---------|-------------|
| **Barrier Discovery** | Guided audit workflow identifying accessibility barriers |
| **Validation & Prioritization** | Systematic review and priority assignment |
| **Work Order Management** | Facilities team coordination with resource tracking |
| **Evidence Collection** | Before/after documentation with measurements |
| **Independent Verification** | Bounded retest by accessibility verifiers |
| **Impact Reporting** | Metrics dashboard with verified repairs and cost analysis |
| **Role Switcher** | Simulated perspective switching (not authentication) |
| **Accessibility First** | Text sizing, high contrast, reduced motion support |
| **Demo Reset** | Restore original fixture while preserving preferences |
| **Activity Timeline** | Complete audit trail of all actions |

---

## 🚀 Quick Start

### Online (No Installation)

Visit **https://011-access-haryana-campus.vercel.app** and click "Continue guided audit" to start the 5-minute presenter journey.

### Local Development

**Requirements**: Node.js 18+ (current LTS recommended)

```bash
# Clone the repository
git clone https://github.com/abinavv-com/access-haryana-campus.git
cd access-haryana-campus

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

The dev server hot-reloads on file changes.

---

## 📖 Documentation

| Document | Purpose |
|----------|---------|
| [`PRODUCT_DOCUMENTATION.md`](./PRODUCT_DOCUMENTATION.md) | Complete product specification (features, user journey, data model) |
| [`TECHNICAL.md`](./TECHNICAL.md) | Architecture, stack, and deployment details |
| [`DESIGN.md`](./DESIGN.md) | Visual design system and component specifications |
| [`GETTING_STARTED.md`](./GETTING_STARTED.md) | Detailed onboarding guide for new users |
| [`product-export/README.md`](./product-export/README.md) | PDF export instructions and showcase |

---

## 🏗️ Project Structure

```
access-haryana-campus/
├── src/
│   ├── app/                    # Root app component + routes
│   ├── screens/                # Screen components (Overview, Audit, etc.)
│   ├── components/             # Reusable UI components
│   ├── domain/                 # Business logic (reducer, types, validation)
│   ├── data/                   # Demo fixture and storage management
│   └── test/                   # Test setup and utilities
├── public/
│   └── media/                  # Illustrative images with attribution
├── verification/               # Browser acceptance evidence
│   ├── redesign/               # Latest verification (keyboard, HUD, Lighthouse)
│   ├── task-10/                # Historical Task 10 evidence
│   └── design/                 # Historical design tour evidence
├── product-export/             # Product documentation + screenshots
├── docs/                       # Superpowers specs and plans
├── .superdesign/               # Design system locked specification
├── package.json                # Dependencies and scripts
├── tsconfig.json               # TypeScript configuration
├── vite.config.ts              # Vite build configuration
├── vercel.json                 # Vercel deployment config (SPA routing)
└── README.md                   # This file
```

---

## 🧪 Testing & Verification

### Run Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm test -- --watch

# Run specific test file
npm test -- app/App.test.tsx
```

### Build & Verify

```bash
# Type check
npm run build  # (includes tsc -b)

# Lint/format check
git diff --check

# Clean build from scratch
rm -rf dist && npm run build
```

### Browser Acceptance Testing

See [`verification/redesign/`](./verification/redesign/) for:
- 9-frame keyboard journey screenshots
- 390px large-text and reduced-motion snapshots
- One-page impact PDF with Chromium inspection
- Lighthouse audit results
- Full acceptance report

---

## 📊 Workflow Stages

The application follows a **6-stage evidence chain**:

```
01 OBSERVED       02 VALIDATED      03 PRIORITISED    04 ASSIGNED
   (Auditor)         (Reviewer)         (Manager)        (Facilities)
        ↓                 ↓                  ↓                 ↓
                                                           
05 FIXED / AWAITING      ← REWORK (Action Required)      06 USER VERIFIED
   (Repair Owner)                                            (Verifier)
        ↓                                                      ↓
     [Audit Trail Logs Progress]  ←──────────────────────────┘
```

Each stage is visible in the persistent **Evidence Chain Rail** (left sidebar on desktop, horizontal nav on mobile).

---

## ♿ Accessibility

Full **WCAG 2.1 AA** compliance:

- ✅ **Perceivable**: High contrast, alt text for images, clear typography
- ✅ **Operable**: Full keyboard navigation, no time limits, resizable text
- ✅ **Understandable**: Clear language, predictable interaction, form validation
- ✅ **Robust**: Semantic HTML, ARIA labels, screen reader optimization

**Built-in Accessibility Features**:
- Text sizing: 100% → 150% adjustment
- High contrast mode: Enhanced colors and borders
- Reduced motion: Disable transitions and animations
- Keyboard navigation: Tab through all elements
- Screen reader support: ARIA labels and live regions

Test these features using the controls in the top navigation bar.

---

## 🎨 Design System

All typography, spacing, color, and component rules are locked in [`.superdesign/design-system.md`](./.superdesign/design-system.md).

**Visual Direction**: Swiss public-service design language inspired by high-contrast government UIs, adapted for dense operational software.

**Color Palette**:
- Canvas: `#F3F1EA` (warm off-white)
- Ink: `#101820` (near-black navy)
- Surface: `#FFFFFF` (white) / `#E8E5DC` (muted)
- Primary Accent: `#D85A1A` (Haryana saffron)
- States: Green `#176B45` (verified), Amber `#9A6700` (warning), Red `#B42318` (danger)

---

## 🚀 Deployment

### Live URL

**Production**: https://011-access-haryana-campus.vercel.app

Deployed on **Vercel** with:
- SPA routing via `vercel.json` rewrites
- Node.js 18+ runtime
- 12-month cache on versioned assets
- Edge middleware support
- ~30 second deploy time

### Deploy Your Own

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy to production
vercel deploy --prod --yes

# View deployment logs
vercel logs [URL]
```

See [`TECHNICAL.md`](./TECHNICAL.md) for detailed deployment notes.

---

## 📦 Bundle Size

| Asset | Size | Gzipped |
|-------|------|---------|
| JavaScript | 255.15 kB | 75.64 kB |
| CSS | 41.84 kB | 8.08 kB |
| **Total** | **297 kB** | **84 kB** |

Built with **Vite 8.2** for optimized output.

---

## 🔄 Demo Controls

**Simulated Role Selector**
- Choose perspective: Auditor, Facilities Manager, or Verifier
- Updates context and next-action copy
- *Not* authentication or access control

**Reset Demo**
- Restores original fictional fixture
- Preserves accessibility preferences (text size, contrast, motion)
- Opens confirmation dialog

**Accessibility Preferences**
- Persist in localStorage under separate key
- Survive demo reset
- Stored as user preferences, not case data

---

## 📝 Demo Data Notice

⚠️ **All records in this application are fictional and illustrative**:

- Campus names, locations, and layouts are not real
- Student and staff identities are completely fictional
- Dates, timelines, and historical records are for demo purposes
- Cost estimates are illustrative based on fictional scenarios
- Images show unrelated locations and are **not** matched before/after pairs
- Barrier descriptions and remediation scenarios are fictional

**This is NOT**:
- A professional accessibility assessment tool
- A statutory certification or compliance determination
- A legal opinion or guidance document
- A replacement for professional accessibility consulting

---

## 📄 Product Documentation

For comprehensive product information, see:

- **[PRODUCT_DOCUMENTATION.md](./PRODUCT_DOCUMENTATION.md)** — Full product spec, user journey, data model, metrics
- **[GETTING_STARTED.md](./GETTING_STARTED.md)** — Step-by-step user guide
- **[DESIGN.md](./DESIGN.md)** — Visual design and component specifications

For PDF export with screenshots, see [`product-export/README.md`](./product-export/README.md).

---

## 🛠️ Development

### Scripts

```bash
npm run dev        # Start dev server (http://localhost:5173)
npm run build      # Build for production (dist/)
npm test           # Run test suite
npm test -- --ui   # Open test UI dashboard
```

### Stack

- **React 19.2** with TypeScript 7.0
- **Vite 8.2** for fast builds
- **Vitest 4.1** + React Testing Library for testing
- **CSS** + **BEM** methodology for styling
- **LocalStorage** for state persistence

### Code Quality

- Type-safe with TypeScript
- Unit and integration tests (see `npm test`)
- Keyboard navigation verified
- Screen reader tested
- Lighthouse audit: 90+ mobile, 95+ desktop (target)

---

## 📞 Support & Feedback

**Live Demo**: https://011-access-haryana-campus.vercel.app

**GitHub Issues**: Report bugs or request features via GitHub issues.

**Documentation**: Start with [`GETTING_STARTED.md`](./GETTING_STARTED.md) for guided setup.

---

## 📜 License

This project is provided as-is for Haryana Ideathon demonstration purposes. All fictional data, designs, and code samples are included for educational and showcase use.

---

## 🎓 Colophon

- **Built for**: Haryana Ideathon 2026
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite 8.2
- **Deployed on**: Vercel
- **Accessibility**: WCAG 2.1 AA
- **Design System**: `.superdesign/design-system.md` (locked)
- **Last Updated**: August 21, 2026

---

**Made with attention to accessibility, clarity, and operational design.** 

Visit the live application: https://011-access-haryana-campus.vercel.app

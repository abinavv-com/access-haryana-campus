# Getting Started — Access Haryana Campus

A step-by-step guide to understand and run the Access Haryana Campus application.

---

## 🌐 View Live (Fastest)

**No installation needed.** Visit the live application:

👉 **https://011-access-haryana-campus.vercel.app**

Click **"Continue guided audit"** to start the 5-minute demo journey.

---

## 💻 Run Locally

### Prerequisites

- **Node.js 18+** (check with `node --version`)
- **npm** or **yarn** (comes with Node.js)
- A code editor (VS Code recommended)
- A modern web browser

### Setup

**1. Clone the repository:**
```bash
git clone https://github.com/abinavv-com/access-haryana-campus.git
cd access-haryana-campus
```

**2. Install dependencies:**
```bash
npm install
```

**3. Start the development server:**
```bash
npm run dev
```

**4. Open in browser:**
Your terminal will print a local URL, typically:
```
http://localhost:5173
```

Copy and paste into your browser, or click the link.

---

## 🎮 Using the Application

### The Five-Minute Journey

When you open the app, the home page shows:
- **Evidence Chain Rail** (left/top): 6-stage workflow visualization
- **Simulated Role** selector (top right): Switch between Auditor, Facilities, Verifier
- **Accessibility Controls** (top right): Text size, high contrast, reduced motion
- **Next Action** button: "Continue guided audit"

Click **"Continue guided audit"** to walk through the workflow.

### Screen-by-Screen Walkthrough

#### 1. Overview (Command Centre)
- Current journey: "Main gate → Admissions"
- Next action with priority indicators
- Backlog of identified barriers
- Campus evidence images
- Activity timeline
- Evidence chain rail showing current stage

**Your role**: Auditor/Manager. Review the situation.

#### 2. Guided Audit
- Structured questionnaire discovering barriers
- Evidence capture interface
- Barrier description and impact assessment
- Standard references (WCAG 2.1)

**Your role**: Auditor. Record a new barrier. Fill in the form, click "Submit".

#### 3. Barrier Record
- Full barrier details with measurements
- Before/after evidence images
- Standards compliance references
- Priority assignment (Low/Medium/High)
- Hazard indicators (if applicable)

**Your role**: Facilities Team Lead. Review the barrier and estimate costs. Click "Create Work Order".

#### 4. Work Order
- Scope of work and cost estimate
- Resource assignment
- Repair timeline
- Completion status tracking

**Your role**: Facilities Manager. Update status to "Completed" or add evidence. Click "Complete Work".

#### 5. Verification
- Independent accessibility retest
- Before/after journey comparison
- Success/failure recording

**Your role**: Verifier. Confirm the repair meets original criteria. Click "Verify Repair".

#### 6. Impact Report
- Metrics dashboard
- Verified repair count
- Cost analysis
- Success rate improvements

**Your role**: Program Manager. Review outcomes and export report.

### Using the Simulated Role Selector

1. Look for **"Simulated role"** dropdown in the top right
2. Select: **Auditor**, **Facilities**, or **Verifier**
3. The screen updates to show that role's perspective
4. **Note**: This is *not* login/authentication—it's just a perspective switch for the demo

### Resetting the Demo

1. Click the **"Reset demo"** button (top right)
2. Confirm the action in the dialog
3. Original fixture is restored
4. **Your accessibility preferences are preserved** (text size, contrast, motion settings)

### Testing Accessibility

1. In top right, find **accessibility controls**:
   - **"Increase text size"** → Try 120%, 130%, 150%
   - **"High contrast"** → Toggle on/off
   - **"Reduce motion"** → Toggle on/off

2. Observe how the interface adapts
3. Use keyboard to navigate (Tab, Enter, Escape)
4. Open browser's DevTools (F12) and use screen reader on Windows/Mac

---

## 🧪 Running Tests

### Quick Test

```bash
npm test
```

This runs the full test suite once and exits.

### Watch Mode (Development)

```bash
npm test -- --watch
```

Tests re-run when you save files. Press `q` to quit.

### Test Coverage

```bash
npm test -- --coverage
```

Shows which lines of code are covered by tests.

### Specific Test File

```bash
npm test -- app/App.test.tsx
```

Run only tests matching that pattern.

---

## 🔧 Building for Production

```bash
npm run build
```

This creates an optimized bundle in the `dist/` folder (~300 KB total, ~84 KB gzipped).

**Verify the build**:
```bash
npm run preview
```

Opens a local server serving the production build at `http://localhost:4173`.

---

## 📁 File Structure Basics

```
access-haryana-campus/
├── src/
│   ├── app/
│   │   ├── App.tsx              # Main app component
│   │   ├── routes.tsx           # Screen routing logic
│   │   └── App.test.tsx         # App tests
│   │
│   ├── screens/                 # One component per screen
│   │   ├── OverviewScreen.tsx
│   │   ├── AuditScreen.tsx
│   │   ├── BarrierScreen.tsx
│   │   ├── WorkOrderScreen.tsx
│   │   ├── VerificationScreen.tsx
│   │   └── ImpactScreen.tsx
│   │
│   ├── components/              # Reusable UI components
│   │   ├── AppShell.tsx         # Header, sidebar, layout
│   │   ├── LifecycleRail.tsx    # 6-stage evidence chain
│   │   ├── StatusBadge.tsx
│   │   ├── MetricCard.tsx
│   │   ├── EvidenceImage.tsx
│   │   └── ...
│   │
│   ├── domain/                  # Business logic
│   │   ├── types.ts             # TypeScript interfaces
│   │   ├── demoReducer.ts       # State management
│   │   ├── workflow.ts          # Workflow rules
│   │   ├── calculations.ts      # Metric calculations
│   │   └── validation.ts        # Form validation
│   │
│   ├── data/
│   │   ├── demo-fixture.v1.ts   # Fictional demo data
│   │   └── storage.ts           # LocalStorage management
│   │
│   └── test/
│       └── setup.ts             # Test utilities
│
├── public/
│   └── media/                   # Illustrative images
│
├── dist/                        # Build output (after npm run build)
├── verification/                # Test evidence
├── product-export/              # Documentation + screenshots
├── package.json
├── tsconfig.json
├── vite.config.ts
└── vercel.json                  # Deployment config
```

---

## 🐛 Troubleshooting

### "Port 5173 already in use"

Another app is using that port. Either:
```bash
# Kill the process
lsof -i :5173  # (macOS/Linux)
netstat -ano | findstr :5173  # (Windows)

# Or use a different port
npm run dev -- --port 3000
```

### "Module not found" error

Clear dependencies and reinstall:
```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Tests failing

Ensure Node.js 18+:
```bash
node --version  # Should be v18.0.0 or higher
```

Run tests in watch mode to see detailed errors:
```bash
npm test -- --watch
```

### Build errors

Type-check first:
```bash
npx tsc --noEmit
```

Then try a clean build:
```bash
rm -rf dist node_modules
npm install
npm run build
```

---

## 📚 Learning the Codebase

### Start Here

1. **`src/app/App.tsx`** — The root component and routing logic
2. **`src/domain/types.ts`** — Data types (Barrier, WorkOrder, Verification, etc.)
3. **`src/domain/demoReducer.ts`** — How state changes happen
4. **`src/screens/OverviewScreen.tsx`** — A simple screen component to understand the pattern

### Key Concepts

**State Management**: Uses React Context + useReducer (no Redux). State lives in `<AppShell>` and is passed down via context.

**Data Persistence**: Every state change auto-saves to `localStorage` under the key `access-haryana-campus:case`. On page refresh, state is restored.

**Routing**: Manual screen routing in `routes.tsx` based on current `screen` state. No React Router.

**Accessibility**: Semantic HTML + ARIA labels throughout. Test with keyboard (Tab, Enter, Escape) and screen readers.

---

## 🚀 Next Steps

### To Understand the Product

Read [`PRODUCT_DOCUMENTATION.md`](./PRODUCT_DOCUMENTATION.md) for:
- Complete feature breakdown
- User journey details
- Data model specifications
- Metrics and reporting

### To Understand the Design

Read [`DESIGN.md`](./DESIGN.md) for:
- Visual design system
- Component specifications
- Color palette and typography
- Accessibility guidelines

### To Understand the Technical Stack

Read [`TECHNICAL.md`](./TECHNICAL.md) for:
- Architecture overview
- Deployment on Vercel
- Build configuration (Vite + TypeScript)
- Performance considerations

### To Contribute

1. Create a branch: `git checkout -b feature/my-feature`
2. Make changes and test: `npm test`
3. Build and verify: `npm run build`
4. Commit with clear message: `git commit -m "feat: describe your change"`
5. Push: `git push origin feature/my-feature`
6. Open a pull request on GitHub

---

## ❓ Questions?

- **How do I deploy my own version?** → See [`TECHNICAL.md`](./TECHNICAL.md) Deployment section
- **How do I customize the demo data?** → Edit `src/data/demo-fixture.v1.ts`
- **How do I add a new screen?** → Create `src/screens/MyScreen.tsx`, add to routing in `src/app/routes.tsx`
- **Is this production-ready?** → This is a demo. For production, add real authentication, database, and compliance measures.

---

## 📞 Support

- **Live Demo**: https://011-access-haryana-campus.vercel.app
- **GitHub**: https://github.com/abinavv-com/access-haryana-campus
- **Issues**: Report bugs or ask questions via GitHub Issues

Happy exploring! 🎉

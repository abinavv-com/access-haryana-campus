# Design System — Access Haryana Campus

Complete visual design specification and component guidelines.

---

## 🎨 Design Philosophy

Access Haryana Campus follows a **Swiss public-service design language** emphasizing:
- **Clarity**: Information hierarchy is obvious at a glance
- **Reliability**: Trustworthy visual signals for operational software
- **Accessibility**: WCAG 2.1 AA compliance built-in
- **Efficiency**: Dense information without clutter

**The memorable device is the evidence-chain rail, not decorative typography.**

---

## 🎭 Color Palette

### Primary Colors

| Color | Hex | RGB | Use | Notes |
|-------|-----|-----|-----|-------|
| Canvas | `#F3F1EA` | rgb(243, 241, 234) | Main background | Warm off-white, reduces eye strain |
| Ink | `#101820` | rgb(16, 24, 32) | Primary text | Near-black navy, high contrast |
| Surface | `#FFFFFF` | rgb(255, 255, 255) | Cards, panels | Pure white for elevation |
| Surface Muted | `#E8E5DC` | rgb(232, 229, 220) | Dividers, subtle background | Slightly darker than canvas |
| Accent (Saffron) | `#D85A1A` | rgb(216, 90, 26) | CTAs, highlights, evidence chain | Haryana saffron, high saturation |

### Status Colors

| Status | Hex | Use | Notes |
|--------|-----|-----|-------|
| Verified | `#176B45` | Checkmarks, success states | Forest green |
| Warning | `#9A6700` | Cautions, pending actions | Amber/gold |
| Danger | `#B42318` | Errors, immediate hazards | Deep red |
| Info | `#1261A0` | Links, additional info | Deep blue |

### Accessibility

- **Minimum Contrast Ratio**: 4.5:1 for body text (WCAG AA)
- **No Color-Only Communication**: Always pair color with icon/text
- **High Contrast Mode**: Border emphasis, increased saturation

---

## 🔤 Typography

### Font Stack

| Role | Font | Fallback | Use Case |
|------|------|----------|----------|
| **Display** | Georgia, Times New Roman, serif | system-serif | Page titles, section headings |
| **Body** | -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif | system-sans | Paragraphs, body copy |
| **Mono** | Monaco, Courier New, monospace | system-mono | Data, metrics, code snippets |

### Type Scale

| Element | Size (Desktop) | Size (Mobile) | Weight | Line Height | Letter Spacing |
|---------|----------------|---------------|--------|-------------|----------------| 
| **H1 (Page Title)** | 48-64px | 36-44px | 700 | 1.0-1.1 | -0.02em |
| **H2 (Section)** | 32-40px | 24-32px | 700 | 1.15 | -0.01em |
| **H3 (Subsection)** | 24-28px | 20-24px | 600 | 1.2 | 0 |
| **Body (16-18px)** | 16-18px | 15-16px | 400 | 1.5-1.8 | 0 |
| **Labels** | 13-14px | 12-13px | 600 | 1.4 | 0.05-0.1em |
| **Metadata** | 11-13px | 11-12px | 500 | 1.4 | 0.05-0.1em |
| **Mono (Data)** | 14-16px | 12-14px | 500 | 1.5 | 0 |

### Usage Rules

- **Page titles**: 48-64px desktop, strict leading 1.0 (tight)
- **Section headings**: 32-40px, slightly relaxed 1.15
- **Body paragraphs**: Always max-width 720px for readability
- **Metric values**: Monospace, bold, accent color
- **Uppercase labels**: Reserved for short stage labels only, never extended copy

---

## 📐 Layout & Grid

### Container

- **Max Width**: 1200px for desktop content
- **Padding**: 40px left/right on desktop, 24px on mobile
- **Breakpoints**:
  - Mobile: 0-640px
  - Tablet: 641px-1024px
  - Desktop: 1025px+

### Grid System

- **12-column symmetrical grid** for standard layouts
- **Flexible grid** with CSS Grid for complex arrangements
- **Avoid floats** — use Grid or Flexbox exclusively

### Spacing Scale

```
4px  → Base unit
8px  → 2x
12px → 3x
16px → 4x (standard gap)
24px → 6x
32px → 8x (section spacing)
48px → 12x
60px → 15x (major section gap)
80px → 20x (section padding)
```

### Sticky Header

- **Height**: 72px
- **Background**: White with 1px bottom border
- **z-index**: 100
- **Content**: Logo/title (left), role selector + accessibility controls (right)

### Sidebar (Desktop Only)

- **Width**: ~280px
- **Sticky**: Yes, position: fixed or sticky
- **Content**: Evidence chain rail (6-stage workflow)
- **Mobile**: Converts to horizontal top navigation

---

## 🎯 Component Specifications

### 1. Evidence Chain Rail (Hero Component)

**Purpose**: Show current workflow stage and progress

**Desktop Layout**:
- Vertical sidebar, left edge
- 6 numbered stages (01-06)
- Current stage highlighted (accent color, bold border)
- Stage labels, roles, status badges
- Height: Full viewport, scrolls with content

**Mobile Layout**:
- Horizontal scrolling top strip
- Same 6 stages, arranged left-to-right
- Sticky horizontal scroll
- Height: 80px

**Visual Treatment**:
```
┌──────────────────┐
│ 01               │
│ Observed         │
│ Auditor          │
│ ✓ Current        │
└──────────────────┘
    ↓ (connected line)
┌──────────────────┐
│ 02               │
│ Validated        │
│ Reviewer         │
│ ● Upcoming       │
└──────────────────┘
```

**Styling**:
- Current stage: `border: 2px solid #D85A1A; background: rgba(216, 90, 26, 0.05)`
- Other stages: `border: 2px solid #E8E5DC; color: #666`
- Stage number: Monospace, accent color, size 24px

### 2. Metric Cards

**Purpose**: Display key numbers with labels

**Composition**:
- Label (uppercase, 12px, gray)
- Value (monospace, accent color, 28px bold)
- Description (13px, gray, optional)

**Styling**:
```
┌─────────────────┐
│ VERIFIED REPAIRS│  ← Label (uppercase)
│      24         │  ← Value (mono, accent)
│ In this journey │  ← Description
└─────────────────┘
```

**Container**: White background, 1px border, 4px radius, 28px padding

### 3. Status Badge

**Purpose**: Quick status indicator

**Variants**:
- `success`: Green background, checkmark
- `warning`: Amber background, warning icon
- `danger`: Red background, alert icon
- `info`: Blue background, info icon

**Size**: 28px height, compact padding, rounded corners

### 4. Button (CTA)

**Primary Button**:
- Background: Accent (#D85A1A)
- Text: White, 14px, bold
- Padding: 14px 32px
- Border radius: 4px
- Hover: Transparent background, accent border
- Active: Slight downward translate

**Secondary Button**:
- Background: Transparent
- Border: 1px solid #101820
- Text: Ink color
- Padding: 14px 32px

### 5. Form Elements

**Labels**: Always above input, 13px, bold
**Inputs**: 
- Border: 1px solid #E8E5DC
- Padding: 12px 16px
- Focus: 3px blue outline with 2px offset
- Error state: Red border, error message below
- Height: 44px (touch-friendly)

**Text Area**:
- Same styling as input
- Min-height: 120px
- Resizable: yes

**Select Dropdown**:
- Same styling as input
- Arrow icon on right

---

## 🎥 Motion & Interaction

### Transition Timing

- **Standard**: 0.3s ease (fade, color change)
- **Bounce**: 0.4s cubic-bezier(0.16, 1, 0.3, 1) (stage reveal)
- **Snap**: Instant (0ms) for discrete state changes

### Micro-Interactions

**Hover States**:
- Cards: `scale(1.02)` or subtle shadow increase
- Buttons: Color shift or border highlight
- Links: Underline appears

**Focus States**:
- All interactive elements: 3px blue outline
- Offset: 2px from element edge

**Active/Pressed States**:
- Buttons: `scale(0.98)` or `-1px translate-y` (press effect)
- Toggles: State change with 0.3s transition

### Accessibility Motion

**Respect `prefers-reduced-motion`**:

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

All transitions disabled when user has accessibility setting enabled.

---

## ♿ Accessibility Guidelines

### WCAG 2.1 AA Compliance

| Principle | Implementation |
|-----------|-----------------|
| **Perceivable** | High contrast, alt text, clear typography |
| **Operable** | Keyboard navigation, no time limits |
| **Understandable** | Clear language, predictable interaction |
| **Robust** | Semantic HTML, ARIA labels |

### Keyboard Navigation

- **Tab**: Move to next interactive element
- **Shift+Tab**: Move to previous
- **Enter**: Activate button, submit form
- **Space**: Toggle checkbox/radio
- **Escape**: Close modal/dropdown
- **Arrow keys**: Navigate within radio/select options

### Screen Reader Support

- All interactive elements labeled: `<label>` for form inputs
- Images with `alt` text (descriptive, not "image of")
- ARIA roles for custom components: `role="progressbar"`, `role="status"`
- Live regions for dynamic content: `aria-live="polite"`
- Status announcements: "Barrier verified" → screen reader announces

### Color Contrast

- **Text on background**: Minimum 4.5:1 (AA)
- **Large text** (18px+): Minimum 3:1
- **UI components**: 3:1 for focus indicators

**Checking Contrast**:
- Use WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- Or DevTools: Right-click element → Inspect → Accessibility panel

---

## 📱 Responsive Design

### Mobile Strategy

**Breakpoint Logic**:
```css
/* Mobile-first (default for < 641px) */
.container { width: 100%; padding: 0 16px; }

@media (min-width: 641px) {
  /* Tablet layout */
  .container { padding: 0 24px; }
}

@media (min-width: 1025px) {
  /* Desktop layout */
  .container { max-width: 1200px; margin: 0 auto; padding: 0 40px; }
}
```

### Navigation

**Desktop**: 
- Sticky header (72px) + left sidebar (280px)
- Content area: full width minus sidebar

**Tablet** (641-1024px):
- Sticky header (72px)
- Sidebar becomes horizontal drawer (slide-in)
- Full-width content

**Mobile** (< 641px):
- Sticky header (64px)
- Navigation: Hamburger menu or bottom tab bar
- Sidebar: Slides in from left/bottom
- Content: Full width

### Touch Targets

- **Minimum size**: 44×44 px
- **Spacing**: 8px minimum between touch targets
- **Buttons**: 48×48 px preferred on mobile

---

## 🖼️ Imagery & Media

### Screenshot Styling

**When displaying app screenshots**:
- Border: 1px solid #E8E5DC
- Border radius: 4px
- Shadow: subtle (shadow-lg at 0.05 opacity)
- Caption: Italics, 13px gray, below image

**Evidence Images** (before/after):
```
Layout: Side-by-side desktop, stacked mobile
Before | After
  ↓      ↓
Before
  ↓
After
```

### Illustrative Images

- **Attribution**: All images credited in [`public/media/ATTRIBUTION.md`](./public/media/ATTRIBUTION.md)
- **License**: Creative Commons or Public Domain only
- **Modifications**: Noted alongside attribution
- **Styling**: Subtle darkening overlay, max-width 100%

---

## 🌙 Dark Mode (Optional Future)

No dark mode implemented currently. If adding:

1. **Color Override**: Use CSS custom properties (var--)
2. **Preference Detection**: `@media (prefers-color-scheme: dark)`
3. **Toggle Control**: Settings or quick access

Example:
```css
:root {
  --color-bg: #F3F1EA;
  --color-ink: #101820;
}

@media (prefers-color-scheme: dark) {
  :root {
    --color-bg: #1a1a1a;
    --color-ink: #f0f0f0;
  }
}
```

---

## 🧪 Design Verification

### Lighthouse Audit

**Targets**:
- Performance: 90+ 
- Accessibility: 90+
- Best Practices: 85+
- SEO: 85+

**Tools**:
```bash
# Run Lighthouse in Chrome DevTools (F12)
# Or via CLI: npm install -g lighthouse
lighthouse https://011-access-haryana-campus.vercel.app --view
```

### Accessibility Audit

**Tools**:
- **axe DevTools**: Chrome/Firefox extension
- **WAVE**: https://wave.webaim.org/
- **Keyboard Testing**: Tab through all pages
- **Screen Reader**: NVDA (Windows) or VoiceOver (Mac)

### Browser Testing

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Fully supported |
| Firefox | 88+ | ✅ Fully supported |
| Safari | 14+ | ✅ Fully supported |
| Edge | 90+ | ✅ Fully supported |

---

## 📋 Component Checklist

Before shipping a new component:

- [ ] Responsive (mobile, tablet, desktop)
- [ ] Keyboard navigable (Tab, Enter, Escape)
- [ ] Screen reader compatible (ARIA labels)
- [ ] Color contrast ≥ 4.5:1
- [ ] Touch targets ≥ 44×44 px
- [ ] Respects `prefers-reduced-motion`
- [ ] Visually tested in light & high-contrast modes
- [ ] Unit tests written
- [ ] TypeScript types defined
- [ ] Documentation added

---

## 🎯 Visual Hierarchy (Information Architecture)

### Page Level

1. **Hero/Title**: H1, largest, focal point
2. **Sections**: H2, clear breaks, substantial spacing
3. **Subsections**: H3, logical grouping
4. **Details**: Body text, supporting info

### Card Level

1. **Primary Content**: Metric value, large and bold
2. **Supporting Label**: Smaller, above metric
3. **Metadata**: Smallest, auxiliary info

### Interaction Level

1. **Primary CTA**: Accent color, prominent
2. **Secondary Action**: Border-only style
3. **Tertiary**: Text link, minimal styling

---

## 🚀 Design Asset Exports

### Screenshots for Documentation

1. **Overview Screen**: Wide, showing full layout
2. **Form Screen**: Showing validation states
3. **Results Screen**: Showing metrics and data
4. **Mobile**: 390px viewport for each screen

**Export format**: PNG, 2x pixel density (e.g., 1560×1440px for 780px screen)

### Component Storybook (Optional Future)

If documenting component library:
- Document each component variant
- Provide code snippets
- Show accessibility features
- Include usage guidelines

---

## 📚 Resources

- **Design System Reference**: [`.superdesign/design-system.md`](./.superdesign/design-system.md) (locked, read-only)
- **Accessibility Guide**: [WebAIM](https://webaim.org/)
- **WCAG 2.1 Standard**: [W3C](https://www.w3.org/WAI/WCAG21/quickref/)
- **Typography**: [Typography.com](https://www.typography.com/)

---

Last Updated: **August 21, 2026**

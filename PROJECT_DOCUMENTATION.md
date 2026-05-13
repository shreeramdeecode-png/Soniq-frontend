# Soniq UI — Project Documentation

## Project Overview

**Soniq** is an Employee Productivity Monitoring Dashboard built as a single-page React application. It provides organizations with real-time visibility into employee work activity, attendance, screenshots, productivity scores, and team performance. The UI is a pixel-perfect React translation of a high-fidelity HTML/CSS design, featuring a premium glassmorphism aesthetic with a teal-and-neutral color palette.

### Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Framework | React | 19.2.6 |
| Routing | React Router DOM | 7.15.0 |
| Build Tool | Vite | 8.0.12 |
| Styling | Tailwind CSS (v4, CSS-first) | 4.3.0 |
| Icons | Lucide React | 1.14.0 |
| HTTP Client | Axios (installed, ready for API integration) | 1.16.0 |
| Utility | clsx (class merging) | 2.1.1 |
| Font | Poppins (Google Fonts, loaded via HTML) | — |

---

## Architecture & Folder Structure

```
src/
├── main.jsx                    # App entry point — mounts React into #root with BrowserRouter
├── App.jsx                     # Root component — renders AppRoutes
├── index.css                   # Global styles: Tailwind @theme tokens, base resets, component classes
│
├── config/
│   └── theme.js                # JS design token object (colors, fonts, radius, shadows, z-index)
│
├── constants/
│   ├── routes.js               # All route path constants (ROUTES enum)
│   └── navigation.js           # Top nav item labels and paths (NAV_ITEMS array)
│
├── utils/
│   └── cn.js                   # Class name merge utility (thin wrapper around clsx)
│
├── layouts/
│   └── DashboardLayout.jsx     # Shell layout — page-bg + shell container + TopNav + <Outlet />
│
├── routes/
│   └── index.jsx               # Central route definitions — lazy imports all pages, wraps in Suspense
│
├── pages/                      # One file per route — page-level composition
│   ├── DashboardPage.jsx
│   ├── TeamsListPage.jsx
│   ├── TeamDetailPage.jsx
│   ├── EmployeeProfilePage.jsx
│   ├── ScreenshotsPage.jsx
│   ├── ScreenshotDetailPage.jsx
│   ├── AttendancePage.jsx
│   ├── ReportsPage.jsx
│   ├── SettingsPage.jsx
│   └── NotFoundPage.jsx
│
├── components/
│   ├── common/                 # App-wide shared components
│   │   ├── TopNav.jsx
│   │   └── PageHeader.jsx
│   │
│   ├── ui/                     # Primitive, reusable UI building blocks
│   │   ├── GlossyCard.jsx
│   │   ├── DarkCard.jsx
│   │   ├── Badge.jsx
│   │   ├── Button.jsx
│   │   ├── TabSwitcher.jsx
│   │   ├── StatCard.jsx
│   │   └── FilterBar.jsx
│   │
│   ├── cards/                  # Domain-specific composite components
│   │   ├── StatsRow.jsx
│   │   ├── OrgProductivityScore.jsx
│   │   ├── OrgHealthCard.jsx
│   │   ├── WorkSummaryCard.jsx
│   │   ├── AppUsageCard.jsx
│   │   ├── ScreenshotFeedCard.jsx
│   │   ├── TopProductiveCard.jsx
│   │   ├── AttendanceCard.jsx
│   │   ├── LiveActivityCard.jsx
│   │   ├── TeamCard.jsx
│   │   ├── CalendarHeatmap.jsx
│   │   ├── TopAppsPanel.jsx
│   │   ├── WeeklyPerformancePanel.jsx
│   │   ├── IdleAlertsPanel.jsx
│   │   ├── QuickActionsPanel.jsx
│   │   ├── ProfileCard.jsx
│   │   ├── ActivityTimeline.jsx
│   │   ├── AppUsageTable.jsx
│   │   ├── AttendanceSummary.jsx
│   │   ├── DailyRecordsTable.jsx
│   │   ├── ScreenshotSidebar.jsx
│   │   ├── ScreenshotPersonHeader.jsx
│   │   ├── ScreenshotGrid.jsx
│   │   ├── ScreenshotViewer.jsx
│   │   ├── FilmStrip.jsx
│   │   ├── ScreenshotDetailPanel.jsx
│   │   ├── AttendanceListTable.jsx
│   │   └── AttendanceGantt.jsx
│   │
│   ├── tables/
│   │   └── EmployeeTable.jsx
│   │
│   ├── reports/                # Report visualization components (lazy-loaded)
│   │   ├── WorkPulseViz.jsx
│   │   ├── BurnoutViz.jsx
│   │   ├── FocusViz.jsx
│   │   ├── ToolsViz.jsx
│   │   ├── AttendanceViz.jsx
│   │   └── LeaderboardViz.jsx
│   │
│   └── settings/              # Settings drawer components (lazy-loaded)
│       ├── TeamsDrawer.jsx
│       ├── PeopleDrawer.jsx
│       ├── WorkPolicyDrawer.jsx
│       ├── MonitoringDrawer.jsx
│       ├── StealthDrawer.jsx
│       ├── DefaultsDrawer.jsx
│       └── PermissionsDrawer.jsx
│
└── mock/                       # Static mock data files (simulating API responses)
    ├── dashboard.js
    ├── teams.js
    ├── teamDetail.js
    ├── employeeProfile.js
    ├── screenshots.js
    ├── screenshotDetail.js
    ├── attendance.js
    ├── reports.js
    └── settings.js
```

---

## Theme System

The theme is maintained via a **dual-layer approach**: CSS custom properties for Tailwind consumption and a parallel JS object for programmatic access.

### CSS Custom Properties (`src/index.css`)

Defined inside Tailwind v4's `@theme` directive, these tokens are natively available as Tailwind utility classes (e.g., `text-primary`, `bg-surface-muted`, `rounded-card`, `z-nav`):

```css
@theme {
  --font-poppins: 'Poppins', sans-serif;
  --color-primary: #0F6E56;
  --color-surface-shell: #ECF0EE;
  --radius-card: 18px;
  --z-nav: 10;
  /* ... */
}
```

### JS Theme Object (`src/config/theme.js`)

Mirrors the CSS tokens for use in inline styles, dynamic calculations, or future theme-switching logic.

### Color Palette

| Token Group | Key Colors | Purpose |
|---|---|---|
| **Primary** | `#0F6E56` (teal), `#1D9E75` (light), `#0A5040` (dark), `#162E24` (darker) | Brand accents, active states, CTAs |
| **Surface** | `#ECF0EE` (shell), `#F0F0EC` (muted), `#F5F5F0` (subtle) | Page/card backgrounds |
| **Ink** | `#1A1A1A`, `#111111`, `#2D2D2D`, `#1D2D28` | Dark cards, dark pills, dark UI |
| **Text** | `#1A1A1A` (primary), `#555` (secondary), `#888` (muted), `#AAA` (light), `#BBB` (lighter) | Text hierarchy |
| **Neutral** | `#D8D8D0` (warm), `#C8C8C0` (cool), `#E5E5DC` (pale), `#B8B8B0` (bone) | Borders, bars, separators |
| **Status** | `#1D9E75` (success), `#F5C518` (warning), `#E53E3E` (danger), `#3B82F6` (info) | Alerts, indicators |

### Font Size Scale

| Token | Size | Token | Size |
|---|---|---|---|
| `text-2xs` | 9px | `text-xl` | 15px |
| `text-2xs-plus` | 9.5px | `text-2xl` | 18px |
| `text-xs` | 10px | `text-3xl` | 20px |
| `text-xs-plus` | 10.5px | `text-4xl` | 26px |
| `text-sm` | 13px | `text-5xl` | 30px |
| `text-sm-plus` | 12px | `text-6xl` | 34px |
| `text-base` | 12.5px | `text-7xl` | 42px |
| `text-md` | 13px | | |
| `text-lg` | 14px | | |

### Design Tokens

| Category | Tokens |
|---|---|
| **Radii** | `shell: 28px`, `card: 18px`, `tile: 12px`, `pill: 50px`, `icon: 7px` |
| **Shadows** | `shell` (deep elevation), `card` (subtle float), `cardDark` (dark card glow), `pillGlass` (glass inset) |
| **Z-Index** | `shell: 0`, `content: 2`, `nav: 10`, `overlay: 20`, `modal: 30`, `toast: 40` |
| **Transitions** | `fast: 150ms`, `DEFAULT: 200ms`, `slow: 300ms` |

---

## Routing

### Route Definitions

| Constant | Path | Page |
|---|---|---|
| `DASHBOARD` | `/` | DashboardPage |
| `TEAMS` | `/teams` | TeamsListPage |
| `TEAMS_DETAIL` | `/teams/:teamId` | TeamDetailPage |
| `TEAMS_EMPLOYEE` | `/teams/:teamId/employee/:employeeId` | EmployeeProfilePage |
| `SCREENSHOTS` | `/screenshots` | ScreenshotsPage |
| `SCREENSHOTS_DETAIL` | `/screenshots/:id` | ScreenshotDetailPage |
| `ATTENDANCE` | `/attendance` | AttendancePage |
| `REPORTS` | `/reports` | ReportsPage |
| `SETTINGS` | `/settings` | SettingsPage |

### Lazy Loading

All pages are lazy-loaded via `React.lazy()` with a shared `<Suspense>` fallback spinner. Report visualizations and settings drawers are additionally lazy-loaded within their pages (two-tier lazy loading).

### Layout Wrapper

All routes (except 404) are nested under `<DashboardLayout />`, which provides the page background gradient, shell container, and TopNav.

---

## Pages Built

### 1. Dashboard (`/`)
- Organization-wide productivity overview
- Date range picker, 4-column grid of summary cards
- Components: `StatsRow`, `OrgProductivityScore`, `OrgHealthCard`, `WorkSummaryCard`, `AppUsageCard`, `ScreenshotFeedCard`, `TopProductiveCard`, `AttendanceCard`, `LiveActivityCard`
- Mock: `src/mock/dashboard.js`

### 2. Teams List (`/teams`)
- Grid of all teams with stat cards, filter/search bar, team cards
- Components: `PageHeader`, `StatCard`, `FilterBar`, `TeamCard`
- Mock: `src/mock/teams.js`

### 3. Team Detail (`/teams/:teamId`)
- Single team deep-dive with calendar heatmap, employee table, sidebar panels
- Components: `StatCard`, `CalendarHeatmap`, `EmployeeTable`, `TopAppsPanel`, `WeeklyPerformancePanel`, `IdleAlertsPanel`, `QuickActionsPanel`
- Mock: `src/mock/teamDetail.js`

### 4. Employee Profile (`/teams/:teamId/employee/:employeeId`)
- Individual employee profile with dark profile card, activity timeline, app usage, attendance
- Components: `ProfileCard`, `ActivityTimeline`, `AppUsageTable`, `AttendanceSummary`, `DailyRecordsTable`
- Mock: `src/mock/employeeProfile.js`

### 5. Screenshots (`/screenshots`)
- Screenshot monitoring with sidebar, filter chips, and thumbnail grid
- Components: `ScreenshotSidebar`, `ScreenshotPersonHeader`, `ScreenshotGrid`
- Mock: `src/mock/screenshots.js`

### 6. Screenshot Detail (`/screenshots/:id`)
- Full-size screenshot viewer with film strip and metadata panel
- Components: `ScreenshotViewer`, `FilmStrip`, `ScreenshotDetailPanel`
- Mock: `src/mock/screenshotDetail.js`

### 7. Attendance (`/attendance`)
- List View + Timeline Gantt View with toggle, stat cards, date navigation
- Components: `StatCard`, `AttendanceListTable`, `AttendanceGantt`
- Mock: `src/mock/attendance.js`

### 8. Reports (`/reports`)
- 6 intelligence reports with numbered strip selector, sidebar metrics, and lazy-loaded visualizations
- Components: `WorkPulseViz`, `BurnoutViz`, `FocusViz`, `ToolsViz`, `AttendanceViz`, `LeaderboardViz`
- Mock: `src/mock/reports.js`

### 9. Settings (`/settings`)
- Accordion-style configuration with 7 lazy-loaded drawer components across 3 groups
- Components: `TeamsDrawer`, `PeopleDrawer`, `WorkPolicyDrawer`, `MonitoringDrawer`, `StealthDrawer`, `DefaultsDrawer`, `PermissionsDrawer`
- Mock: `src/mock/settings.js`

---

## Styling Approach

### Tailwind CSS v4 — CSS-First Configuration

No `tailwind.config.js` — all design tokens declared directly in CSS via the `@theme` directive. The Vite plugin (`@tailwindcss/vite`) handles compilation.

### Custom Utility Classes

| Class | Description |
|---|---|
| `page-bg` | Full-viewport gradient background |
| `shell` | Main content shell with gradient + top light sheen |
| `glossy-card` | Semi-transparent white card with blur, inset shadow |
| `dark-card` | Dark teal gradient card |
| `task-dark-card` | Softer variant of dark-card |
| `glass-pill` | Frosted glass pill with blur and white border |
| `nav-active-pill` | Active nav button with teal gradient and glow |
| `dark-pill` | Dark ink gradient pill |
| `primary-pill` | Teal gradient pill for CTAs |
| `bar-dark`, `bar-gray`, `bar-primary` | Gradient bar fills for charts |
| `pblock-primary`, `pblock-dark`, `pblock-gray` | Productivity block fills |
| `hmap-excellent`, `hmap-good`, `hmap-avg`, `hmap-low` | Calendar heatmap levels |

### Glassmorphism Patterns

- Cards: `rgba(255,255,255,0.82)` + `backdrop-filter: blur(12px)` + white inset shadows
- Pills: `rgba(255,255,255,0.55)` + `backdrop-filter: blur(8px)` + white borders
- Shell: Subtle top-down white gradient overlay for depth
- Dark cards: Gradient fills with faint white inset lines for lit-edge effect

---

## Mock Data Strategy

All mock data lives in `src/mock/` and is imported directly by components. Each file exports named constants mirroring future API response shapes.

| File | Purpose |
|---|---|
| `dashboard.js` | All data for the Dashboard's 8 card components |
| `teams.js` | Stat cards, filter options, and team card data |
| `teamDetail.js` | Single team deep-dive data |
| `employeeProfile.js` | Individual employee profile data |
| `screenshots.js` | Screenshot page sidebar tree and thumbnail metadata |
| `screenshotDetail.js` | Single screenshot lightbox view data |
| `attendance.js` | Attendance stat cards, filter tabs, list and gantt data |
| `reports.js` | 6 report configs with metadata, stats, and viz data |
| `settings.js` | Accordion sections, employee config, permissions matrix |

---

## How to Run

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Development

```bash
# Install dependencies
npm install

# Start dev server (opens at http://localhost:3000)
npx vite
```

### Production Build

```bash
# Build for production
npx vite build

# Preview production build locally
npx vite preview
```

---

## Key Design Decisions

1. **No External Chart Libraries** — All visualizations built with pure CSS/HTML for full aesthetic control and minimal bundle size.

2. **Two-Tier Lazy Loading** — Pages are lazy-loaded at the route level; report visualizations and settings drawers are additionally lazy-loaded within their pages.

3. **Centralized Theme** — Dual CSS + JS token architecture supports future theme switching (dark mode, brand customization).

4. **Accordion + Drawer Pattern** (Settings) — Inline expansion keeps all 7 sections visible while allowing deep configuration without navigation.

5. **Numbered Strip + Sidebar + Viz Pattern** (Reports) — Quick switching between 6 report types without navigation, with contextual sidebar metrics.

6. **`@` Path Alias** — All imports use `@/` prefix mapped to `src/` via Vite's resolve alias.

7. **Mock-First Development** — All data is structured to mirror real API responses, making the swap to live APIs straightforward.

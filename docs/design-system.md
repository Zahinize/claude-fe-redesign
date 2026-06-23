# Governata Design System

Design system for the **Governata** data governance platform prototype, reverse-engineered
from the Figma assets in [`assets/`](../assets). All tokens, primitives, and patterns below
are derived directly from `assets/components/*.png` and `assets/features/*.png`.

> **Source of truth:** raw token values live in [`src/design/tokens.ts`](../src/design/tokens.ts)
> and are consumed by [`tailwind.config.ts`](../tailwind.config.ts). Components reference **only**
> Tailwind token classes (`bg-brand-600`, `text-fg-muted`, `rounded-card`, `shadow-card`,
> `p-card`) — never raw hex or arbitrary values. Charts/SVG that need concrete hex import from
> the same token module, so there is a single source of color truth.

---

## 1. Color tokens

| Token | Hex | Usage |
| --- | --- | --- |
| `brand-50/100/200` | `#EFF6FF` `#DBEAFE` `#BFDBFE` | Soft blue — info pills, "Marketing" tag, toggle track-off ring, active nav background |
| `brand-500/600/700` | `#3B82F6` `#2563EB` `#1D4ED8` | Primary blue — logo, links, toggle-on, active nav text, radio/checkbox |
| `primary` | `#2E3440` (hover `#1F232E`) | **Dark navy/ink** — filled primary buttons, segmented-control selected, Export |
| `success-50/500/600` | `#ECFDF3` `#12B76A` `#027A48` | Green — `Active`, `Consented`, positive toast/dialog |
| `warning-50/500/600` | `#FFFAEB` `#F79009` `#B54708` | Amber — `Pending`, Medium severity |
| `danger-50/500/600/700` | `#FEF3F2` `#F04438` `#D92D20` `#B42318` | Red — error, High/Critical severity, Record Withdrawal, `Withdrawn` |
| `neutral-50…900` | `#F9FAFB … #101828` | Text, borders, surfaces, zebra rows |
| `surface` / `surface-muted` / `surface-sunken` / `surface-zebra` | `#FFFFFF` `#F5F6F8` `#F2F4F7` `#F9FAFB` | Card / page bg / section-header band & hover / alternating rows |
| `border` / `border-strong` | `#EAECF0` `#D0D5DD` | Dividers, control borders |
| `fg` / `fg-strong` / `fg-muted` / `fg-subtle` | `#344054` `#101828` `#667085` `#98A2B3` | Body / headings / field labels / placeholders |

**Severity scale** (`assets/components/component-alert-colors.png`): Critical → solid `danger-700`;
High → soft `danger`; Medium → soft `warning`; Normal/Info → soft `brand`; Low → soft `neutral`.

## 2. Spacing, radii, type, shadow

- **Spacing tokens:** `sidebar` (16rem), `sidebar-collapsed` (4rem), `topbar` (4rem),
  `card` (1.5rem), `section-gap` (1.5rem), `field-gap` (1.25rem). Generic 4px-grid utilities
  (`gap-2`, `px-3`) are allowed; layout-level magic numbers are not.
- **Radii:** `card` 12px · `control` 8px (buttons) · `input` 10px · `chip` 6px (badges) · `pill` full.
- **Typography:** Inter. Sizes tuned for density — `2xs` 11px (badges), `sm` 13px (table/labels),
  `base` 14px (default), `xl` 20px (page/record headings). Numeric/date cells use `.tnum`
  (tabular figures).
- **Shadows:** `card`, `dropdown`, `topbar`, `modal`, `toggle`.

## 3. Primitives (`src/components/ui`)

Every primitive is **hand-built with Tailwind** (no shadcn/Radix/MUI/Chakra/Ant), takes typed
variant unions, and merges `className` via [`cn`](../src/lib/cn.ts).

| Component | Key props | Mirrors asset |
| --- | --- | --- |
| `Button` | `variant: primary\|secondary\|outline\|ghost\|danger\|danger-soft`, `size`, `leftIcon`, `loading` | `component-button.png` |
| `IconButton` | `icon`, `label` (a11y), `variant`, `active` | top-navbar / icons |
| `Badge` | `tone` (7), `variant: soft\|solid\|outline`, `dot` | `alert-buttons` / `alert-colors` |
| `StatusChip` · `PurposeChip` · `SeverityBadge` | status/state/severity → tone lookup (built on Badge) | feature statuses |
| `Breadcrumb` | trail w/ optional leading icon | data-classification header |
| `Card` · `SectionCard` | titled header band + body | detail sections |
| `Field` · `FieldGrid` | label→value pairs in a responsive grid | overview/evidence |
| `Toggle` | `checked`, `onChange` (`role="switch"`) | scope tab / tabs-radio |
| `Tabs` | underline, arrow-key nav | detail tab bar |
| `SegmentedControl` | pill No/Yes selector | tabs-radio |
| `Input` · `SearchInput` | label/hint/error/icon; debounced clearable search w/ shortcut | `component-input` / top-navbar |
| `Checkbox` · `Radio` | blue, `role` semantics | checkbox-radio |
| `Popover` · `MenuItem` · `FilterDropdown` · `Select` | click-outside + Escape; multi-select filter; compact select | `component-dropdown` / pagination |
| `Pagination` | page numbers + ellipses, results-per-page, "Page N" stepper | `component-pagination` |
| `Modal` | tone `positive\|warning\|negative`, footer actions (portal) | `component-dialogue-box` |
| `Toast` (`useToast`) | `success\|error\|warning` (auto-dismiss) | `component-toast` |
| `Tooltip` | dark bubble, hover/focus | `component-tooltip` |
| `EmptyState` · `Spinner`/`LoadingBlock` | icon + title + action; loaders | — |
| `ProgressBar` · `ProgressRing` | threshold tone (green/amber/red), `scoreTone()` | `component-progress-bars` |
| `Stepper` | completed/current/upcoming | `component-onboarding-stepper` |
| `BarChartCard` | rounded bars + track (Recharts, token colors) | `component-graph` |
| `DatePicker` | Monday-first calendar | `component-date-picker` |
| `Timeline`: `FieldTimeline` · `LogTimeline` | lifecycle field timeline; severity log w/ Read More + copy | `component-timeline` |

## 4. Layout & data

- **`AppShell`** = collapsible `Sidebar` (nested governance nav from `component-side-navbar.png`,
  with an icon-only collapsed rail matching the feature screens) + `Topbar` (global search w/
  `Alt+K`, notifications, user pill) + routed `<Outlet/>`.
- **`DataTable`** = TanStack Table (sorting / filtering / global search / pagination) +
  `@tanstack/react-virtual` row virtualization. Renders ~30–50 DOM rows out of **100,000**.
  Sortable sticky header, zebra rows (`component-table.png`).
- **Mock data** = deterministic seeded generators (`src/data/generators`), validated by **Zod**
  (`src/data/schemas.ts`). 100k consent rows + lazily-expanded per-record purposes/audit.

## 5. Rules enforced

- No hardcoded colors — all from tokens (`src/design/tokens.ts` → Tailwind).
- No hardcoded layout spacing — named spacing tokens + 4px grid.
- Reuse over duplication — cells, chips, fields, and timelines all compose primitives.
- Accessibility — `role`/`aria` on switches, tabs, dialogs, checkboxes; keyboard nav on tabs;
  focus-visible rings from tokens.

## 6. Screens

| Route | Screen | Asset |
| --- | --- | --- |
| `/consent` | Consent Management list (100k virtualized table, filters, search, export) | `consent-management-home-1` |
| `/consent/:id` | Consent record — tabs: Overview · Scope & Purposes · Evidence · Lifecycle · Audit Trails | `consent-management-overview/scope/evidence/lifecycle` |
| `/governance/data-classification` | Data Classification — 5 summary stat cards, filterable scheme cards (grid/list) | `data-classification-home-1` |
| other nav | Placeholder (EmptyState) — scopes the prototype to Consent Management | — |

# Governata — Data Governance Platform (Consent Management)

A high-fidelity prototype of a data-heavy B2B **data governance** platform, built to match the
Figma designs in [`assets/`](assets). The fully-built module is **Consent Management**; the
surrounding governance navigation is included as placeholders to show how it fits the wider product.

## Stack

React · TypeScript · Vite · Tailwind CSS · TanStack Table + Virtual · TanStack Query ·
React Hook Form · Zod · Recharts · Lucide React. **No** component library (shadcn/Radix/MUI/
Chakra/Ant) — every primitive is hand-built. See [`docs/design-system.md`](docs/design-system.md).

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build
npm run typecheck  # tsc --noEmit
```

## Highlights

- **100,000-row** Consent Management table with sorting, multi-select filters (Status / Type /
  Channel), debounced global search, pagination, CSV export, and **row virtualization** (~30–50
  DOM rows at any time). Deterministic seeded mock data, validated with Zod.
- **Consent record** detail with tabs — Overview · Scope & Purposes · Evidence · Lifecycle ·
  Audit Trails. Functional interactions: purpose toggles, and a **Record Withdrawal** flow
  (React Hook Form + Zod) that updates status, lifecycle, and the audit timeline (persisted in the
  session Query cache).
- **Design tokens** drive everything — no hardcoded colors or layout spacing.

## Structure

```
src/
  components/ui/        hand-built primitives (Button, Badge, Toggle, Tabs, Modal, …)
  components/layout/    AppShell, Sidebar (collapsible), Topbar
  components/table/     virtualized DataTable
  components/timeline/  Field & Log timelines
  features/consent/     list + detail + tabs + withdrawal modal + data hooks
  data/                 Zod schemas, deterministic generators, nav config
  design/tokens.ts      single source of color truth (shared with tailwind.config.ts)
  lib/                  cn, format, rng, csv, hooks
```

# CLAUDE.md

## Project Goal

Build a high-fidelity prototype of a data-heavy B2B data governance platform from supplied Figma design screenshots.

## Design Source of Truth

Use supplied Figma screenshots present in ./assets/ folder.
Refer to @assets/features/ to build app features.
Refer to @assets/components/ to build UI design.

Before implementing screens:

1. Analyze the screenshots.
2. Extract design tokens.
3. Create reusable primitives.
4. Document findings in docs/design-system.md.

## Forbidden Libraries

Do not use:

- shadcn/ui
- Radix UI
- Chakra UI
- Material UI
- Ant Design

## Allowed Stack

- React
- TypeScript
- Tailwind CSS
- TanStack Table
- TanStack Query
- Recharts
- React Hook Form
- Zod
- Lucide React

## Architecture Rules

- Reuse components.
- Avoid duplicated UI.
- Avoid hardcoded colors.
- Avoid hardcoded spacing.
- Follow extracted design tokens.

## Data Requirements

Support datasets up to 100,000 rows.

Large tables must support:

- Sorting
- Filtering
- Pagination
- Search

Use virtualization where appropriate.

## Required Screens

- Build functional web app that closely resembles figma screenshots.

## Deliverables

Create:

- docs/design-system.md
- reusable UI components
- realistic mock datasets
- Feature-rich web application

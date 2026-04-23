# Implementation Plan: Fix Admin Subcategory Display & Sidebar Layout

**Branch**: `019-fix-admin-categories-layout` | **Date**: 2026-04-23 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/019-fix-admin-categories-layout/spec.md`

## Summary

The goal of this feature is to fix two distinct issues in the admin panel:
1.  **Subcategory Display Bug**: Fix a frontend state bug where clicking the "Subcategories" button for any category displays the same subcategory data instead of filtering to the selected parent's children. This involves fixing state synchronization in `SortableDataTable`.
2.  **Sidebar and Layout**: Update the admin layout to keep the sidebar fixed and the admin header sticky. The sidebar should collapse into a hamburger menu on mobile viewports (<768px). The main content area should scroll independently from the sidebar.

## Technical Context

**Language/Version**: TypeScript / Next.js 16 (App Router) + React 19
**Primary Dependencies**: Tailwind CSS 4, React (`useState`, `useEffect`), Lucide React (for mobile hamburger icon)
**Storage**: N/A (Frontend only, data fetching works via Prisma but no changes needed)
**Testing**: Manual testing based on Acceptance Criteria
**Target Platform**: Modern web browsers (Desktop & Mobile)
**Project Type**: Next.js Web Application
**Performance Goals**: N/A (UI bugfix/layout)
**Constraints**: Ensure mobile sidebar is accessible and toggleable.
**Scale/Scope**: Impacts `app/admin/layout.tsx`, `components/admin/AdminSidebar.tsx`, `components/admin/AdminHeader.tsx` (if needed for sticky behavior), and `components/admin/SortableDataTable.tsx` or `CategoryListClient.tsx` for the subcategory bug.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

No constitution violations detected. The changes adhere to existing patterns and are simple UI/state fixes.

## Project Structure

### Documentation (this feature)

```text
specs/019-fix-admin-categories-layout/
├── plan.md              # This file
├── research.md          # Empty (no research needed)
├── data-model.md        # Empty (no new entities)
├── quickstart.md        # Feature overview
└── tasks.md             # Implementation tasks
```

### Source Code (repository root)

```text
src/
├── app/
│   └── admin/
│       └── layout.tsx
├── components/
│   └── admin/
│       ├── AdminSidebar.tsx
│       ├── AdminHeader.tsx
│       └── SortableDataTable.tsx
```

**Structure Decision**: Using existing Next.js App Router structure in `src/app` and `src/components/admin`.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

No complexity justifications required.

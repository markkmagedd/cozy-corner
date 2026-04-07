# Implementation Plan: Scalable Tabbed Navbar

**Branch**: `012-navbar-tabs-redesign` | **Date**: 2026-04-04 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/012-navbar-tabs-redesign/spec.md`

## Summary

The goal is to refactor the current single-button `Navbar` into a multi-tabbed layout containing "Categories", "New Arrivals", "Offers", and "Contact Us". The "Categories" tab will be specifically designed for scalability, using a dynamic mega-menu or dropdown that adapts to an increasing number of categories fetched from the existing backend API.

## Technical Context

**Language/Version**: TypeScript 5, React 19, Next.js 16.2.1  
**Primary Dependencies**: Tailwind CSS 4, Lucide React, Framer Motion  
**Storage**: N/A (Uses existing `/api/categories` endpoint)  
**Testing**: Manual visual and interaction testing  
**Target Platform**: Desktop and Mobile browsers
**Project Type**: Web application (storefront)  
**Performance Goals**: Instant tab transitions and smooth category menu expansion.  
**Constraints**: Must handle 20+ categories without layout breakage; Sticky behavior must be preserved.  
**Scale/Scope**: Refine `Navbar.tsx` and `MegaMenu.tsx` to support the new multi-tab architecture.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- [x] **Project Structure**: Modifying existing storefront components.
- [x] **Aesthetics**: Plan maintains high-end glassmorphism while improving structural usability.
- [x] **Scalability**: Explicitly addresses the requirement for dynamic category growth.

## Project Structure

### Documentation (this feature)

```text
specs/012-navbar-tabs-redesign/
├── plan.md              # This file
├── research.md          # Layout exploration for multi-tab setups
└── quickstart.md        # How to run dev server to see changes
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── storefront/
│   │   ├── Navbar.tsx      # Main layout change (Multi-tab)
│   │   ├── MegaMenu.tsx    # Refactored for Categories-only focus
│   │   ├── NavTab.tsx      # New sub-component for nav items (optional)
```

**Structure Decision**: Keep existing files but refactor their internal logic and props to strictly serve the new tabbed navigation model.

## Phase 0: Outline & Research

1. **Research Multi-Tab Layouts**: Review modern e-commerce navbars (e.g., Nordstrom, Nike) that balance static tabs with dynamic categories.
2. **Determine Scalability Pattern**: Decide between a multi-column mega-menu (current) or a "Category Drawer" if the list grows excessively large.
3. **Route Discovery**: Map "New Arrivals" and "Offers" to existing product filter queries (e.g., `/?search=new`).

## Phase 1: Design & Contracts

1. **Update Navbar Interface**: Shift from single MegaMenu trigger to a list of navigational items.
2. **Refine MegaMenu**: Adjust to focus purely on the dynamic categories list.
3. **Agent context update**: Run the update-agent-context script.

## Phase 2: Implementation

1. **Implement Multi-Tab Structure**: Update `Navbar.tsx` to render the specified tabs.
2. **Refactor MegaMenu logic**: Ensure it specifically serves the "Categories" tab and handles overflow.
3. **Responsive Mapping**: Ensure all 4+ tabs fit gracefully in the mobile drawer.
4. **Link Audit**: Ensure all paths (Contact Us, etc.) resolve correctly.

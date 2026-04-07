# Quickstart: Scalable Tabbed Navbar

## Setup

1. **Feature Check**: Verify the current branch is `012-navbar-tabs-redesign`.
2. **Environment**: `npm run dev` to see the new layout.

## Running Local Environment

1. **Desktop Flow**:
    - Observe multiple tabs: Categories, New Arrivals, Offers, Contact Us.
    - Hover over **Categories** to see the scalable grid.
2. **Mobile Flow**:
    - Toggle the hamburger menu.
    - Verify all tabs list clearly in the drawer.
3. **Admin Check**:
    - Add mock categories in the backend (optional) to see how the mega-menu handles scaling.

## Core Files

- `src/components/storefront/Navbar.tsx`: Refactor to tabbed list architecture.
- `src/components/storefront/MegaMenu.tsx`: Simplified dynamic category grid trigger.

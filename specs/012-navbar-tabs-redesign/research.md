# Technical Research: Scalable Tabbed Navbar

## Goal
Redesign the navbar for Cozy Corner to support high-growth (scalable categories) and a more traditional e-commerce tabbed structure (Categories, New Arrivals, etc.).

## Visual Inspiration & Design Decisions

### 1. Multi-Tab Layout Strategy
- **Categories (Trigger)**: Desktop users hover/click to expand a scalable Category MegaMenu.
- **New Arrivals (Link)**: Points to `/?search=new` or a dedicated category.
- **Offers (Link)**: Points to a filtered product view for discounted items.
- **Contact Us (Link)**: Points to a standard content page.

### 2. Category Scalability: "Grid of Grids"
- To ensure 20+ categories fit without layout breakage, the `MegaMenu` will transition into a **4-column responsive grid**.
- If a category has sub-categories, they will be listed underneath, otherwise, the top-level categories will occupy the grid cells.
- **Design Rule**: Max 12 main columns? (No, 4 columns with vertical list items is safer for growth).

### 3. Desktop Tab Transitions
- Tabs will use a "minimalist active" state (subtle underline or text color shift) to avoid visual clutter.
- Glassmorphism will be maintained on the top header bar but with refined spacing for 4+ items + Logo + Search.

### 4. Component Breakdown & Refinements

#### Navbar (src/components/storefront/Navbar.tsx)
- Reverting the "one button shop" concept into a map/list of navigational items.
- Maintain `sticky top-0` and `backdrop-blur`.

#### MegaMenu (src/components/storefront/MegaMenu.tsx)
- Exclusively triggered by the "Categories" tab now.
- Refactor the fetch logic and grid layout to maximize vertical screen usage for large category sets.

## Route Discovery for New Links

- **New Arrivals**: `/?search=new` (as a placeholder filter if dedicated category doesn't exist).
- **Offers**: `/?search=sale` (placeholder).
- **Contact Us**: `#footer` or `/contact` (placeholder until page created).

## Decision
Proceed with **Multi-Tab Design** focusing on the "Categories" tab being the primary dynamic trigger. Use a 4-column mega-menu for maximum scalability.

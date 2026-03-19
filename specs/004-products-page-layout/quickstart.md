# Quickstart: Products Page Layout

## Overview
This feature introduces a fully responsive products page with a category sidebar (which transforms into a mobile drawer) and a "Load More" style product grid.

## Development Verification
1. Open the project and run `npm run dev`.
2. Navigate to `/products` (or the configured products route).
3. Validate the sidebar is visible on desktop (>1024px).
4. Verify clicking a category filters the displayed products.
5. Resize the window to mobile (<768px) and ensure the sidebar hides and a hamburger menu appears.
6. Click the hamburger menu to ensure the `Framer Motion` powered drawer slides in smoothly.
7. Click the "Load More" button at the bottom of the grid to verify the Server Action appends new products smoothly.

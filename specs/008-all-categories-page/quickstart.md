# Quickstart: All Categories Page

## Prerequisites

- Local development server running: `npm run dev`
- Database seeded with at least 2 top-level categories.
- At least one of the categories should have an active product with a primary image to verify dynamic thumbnailing.
- At least one category should have zero products to verify empty state fallbacks.

## Verification Scenarios

### 1. View Top-Level Categories
1. Open browser to `http://localhost:3000/categories`.
2. Inspect the grid: You should ONLY see top-level categories (no subcategories).
3. The page title/header should clearly display "All Categories" or similar.
4. Categories should display name and description.

### 2. Verify Dynamic Thumbnails
1. Look at a category known to have an active product with a primary image (e.g., "Clothing").
2. Confirm the thumbnail matches that product's primary image seamlessly.
3. Look at an empty category (no products).
4. Confirm a graceful CSS dark/slate visual fallback or placeholder is applied instead of a broken image link.

### 3. Verify Routing
1. Click the "Clothing" category card.
2. Confirm the browser navigates to `/category/clothing` safely and renders the product list.

### 4. Verify Empty State (Optional test case if DB is wiped)
1. Delete or mark all categories inactive in the DB.
2. Visit `/categories`.
3. Confirm a user-friendly message is displayed ("No categories found at this time") preventing layout breakage.

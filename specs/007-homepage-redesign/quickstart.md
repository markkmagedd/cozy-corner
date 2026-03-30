# Quickstart: Homepage Redesign Verification

## Prerequisites

- Development server running: `npm run dev`
- At least one category in the database with `isFeatured = true`

## Verification Steps

### 1. Filter Sidebar Removed (US1)
1. Open `http://localhost:3000` in your browser.
2. Scroll to the "New Arrivals" section.
3. Confirm: No filter sidebar (Brand, Price Range) is visible on desktop or mobile.
4. Confirm: The product grid spans the full width of the container.
5. Resize the browser to mobile width — confirm no filter button or drawer appears.

### 2. Featured Categories Section (US2)
1. Scroll past the New Arrivals section.
2. Confirm: A "Shop by Category" (or similar) section is visible.
3. Confirm: Only categories marked as featured appear.
4. Click one of the category cards.
5. Confirm: You are navigated to `/category/{slug}` for that category.

### 3. Promotional Banner (US3)
1. Scroll past the Featured Categories section.
2. Confirm: A promotional banner with a headline, description, and CTA button is visible.
3. Click the CTA button.
4. Confirm: Navigation to the intended destination occurs.

### 4. Newsletter Signup (US4)
1. Scroll to the section above the footer.
2. Confirm: A newsletter signup form with an email input and submit button is visible.
3. Enter an invalid email (e.g., "test") and click submit.
4. Confirm: An inline validation error is shown.
5. Enter a valid email (e.g., "test@example.com") and click submit.
6. Confirm: A success message is displayed.

### 5. Responsive Check
1. Resize the browser through mobile → tablet → desktop widths.
2. Confirm: All new sections stack vertically on mobile and display correctly.
3. Confirm: No horizontal overflow or layout breaks at any viewport.

### 6. Page Order
Verify the complete section order from top to bottom:
Hero → New Arrivals → Featured Categories → Promotional Banner → Newsletter Signup → Footer

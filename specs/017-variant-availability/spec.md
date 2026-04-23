# Feature Specification: Dynamic Variant Availability Selection

**Feature Branch**: `017-variant-availability`  
**Created**: 2026-04-23  
**Status**: Draft  
**Input**: User description: "When the user tries to select a variant for a specific product, fetch the available variants for this product. For example, if there is a size 32 in the black color but no size 32 in the grey color, the grey color variant button should be disabled because it is not available in stock."

## Clarifications

### Session 2026-04-23

- Q: When a user changes one dimension to a value that conflicts with the other selected dimension, what should happen to the conflicting selection? → A: Auto-switch to the nearest available option in the conflicting dimension.
- Q: What does "nearest available" mean when auto-switching? → A: First available option in display order (top-left to bottom-right as rendered).
- Q: Should shared/bookmarked URLs with variant params pre-select those variants even if unavailable? → A: Validate URL params on load — use them if valid and available, otherwise fallback to default variant.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Select a Size and See Available Colors (Priority: P1)

A shopper visits a product page that offers multiple colors and sizes. They select a specific size (e.g., size 32). The system immediately updates the color options to reflect which colors are actually available for that size. Colors that do not have the selected size in stock appear as disabled buttons, preventing the shopper from choosing an unavailable combination.

**Why this priority**: This is the core feature — dynamically disabling unavailable variant combinations based on the user's current selection. It directly prevents shopper frustration from selecting a combination that cannot be fulfilled.

**Independent Test**: Can be fully tested by navigating to any product page with multiple color/size variants, selecting a size, and verifying that only colors with stock for that size remain selectable.

**Acceptance Scenarios**:

1. **Given** a product with variants (Black/Size 32, Black/Size 34, Grey/Size 34) and the shopper is on the product page, **When** the shopper selects size 32, **Then** the Black color button is enabled and the Grey color button is visually disabled.
2. **Given** a product with variants where all colors are available for a selected size, **When** the shopper selects that size, **Then** all color buttons remain enabled.
3. **Given** a product with variants (Black/Size 32, Grey/Size 32) and the shopper is on the product page, **When** the shopper selects size 32, **Then** both Black and Grey color buttons are enabled.

---

### User Story 2 - Select a Color and See Available Sizes (Priority: P1)

A shopper selects a color first (e.g., Grey). The system updates the size options to show which sizes are available for that color. Sizes that do not exist for the selected color appear as disabled buttons.

**Why this priority**: This is the inverse direction of Story 1 and equally essential — shoppers may choose color before size, and the system must handle both selection orders consistently.

**Independent Test**: Can be fully tested by navigating to any product page, selecting a color, and verifying that only sizes with stock for that color remain selectable.

**Acceptance Scenarios**:

1. **Given** a product with variants (Grey/Size 34, Grey/Size 36, Black/Size 32, Black/Size 34), **When** the shopper selects Grey, **Then** Size 34 and Size 36 are enabled, and Size 32 is disabled.
2. **Given** a product where the selected color has all sizes available, **When** the shopper selects that color, **Then** all size buttons remain enabled.

---

### User Story 3 - Visual Distinction Between Disabled and Out-of-Stock (Priority: P2)

When a variant option is disabled because of the current selection context, the shopper can visually distinguish it from a completely out-of-stock variant. Disabled-by-selection options appear greyed out but subtly indicate they may be available with a different selection. Truly out-of-stock variants (where `isAvailable` is false across all combinations) are marked with a strikethrough or "Out of Stock" label.

**Why this priority**: Improves clarity by helping shoppers understand why an option is unavailable — whether they can unlock it by changing another selection or if it is genuinely out of stock.

**Independent Test**: Can be tested by setting up a product where some variants have `isAvailable = false` and others are simply not matching the current selection, then verifying distinct visual treatments.

**Acceptance Scenarios**:

1. **Given** a product where Grey/Size 32 does not exist but Grey/Size 34 does, **When** the shopper selects Size 32, **Then** the Grey button appears disabled (greyed out) indicating it is not available for this size.
2. **Given** a product where Grey has `isAvailable = false` for all its size variants, **When** the shopper views the product page, **Then** the Grey button shows an "Out of Stock" indicator regardless of size selection.

---

### User Story 4 - Default Variant Selection on Page Load (Priority: P2)

When a shopper first loads a product page, the system pre-selects the first available variant combination so the page displays a valid, in-stock option by default. The shopper sees the corresponding price, images, and availability immediately without needing to make a selection first.

**Why this priority**: Ensures a seamless first-load experience — the page is never in an ambiguous state with no variant selected.

**Independent Test**: Can be tested by loading a product page and verifying that a valid variant is pre-selected with matching color and size buttons highlighted.

**Acceptance Scenarios**:

1. **Given** a product with multiple variants, **When** the shopper loads the product page for the first time, **Then** the first available color/size combination is pre-selected and all corresponding options are correctly highlighted.
2. **Given** a product where the first variant is out of stock, **When** the page loads, **Then** the system selects the next available variant instead.
3. **Given** a shared URL with variant params (e.g., `?color=Grey&size=32`) where Grey/Size 32 is unavailable, **When** the shopper opens the link, **Then** the system ignores the invalid params and falls back to the default available variant.

---

### Edge Cases

- What happens when a product has only one variant option type (e.g., only sizes, no colors)? The single option type should display normally with unavailable options disabled.
- What happens when all variants of a product are out of stock? All option buttons should be disabled and a clear "Out of Stock" message should be displayed.
- What happens when a shopper selects a color, then changes the size to one unavailable in that color? The system should auto-switch to the first available color in display order for the newly selected size.
- What happens when a product has no variants at all? The product page should display without any variant selector.
- How does the system handle a variant that has `isAvailable = false` but the color/size combination exists in the database? The variant should be treated as out of stock and visually marked accordingly.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST fetch all variant data for a product when the product page loads, including color, size, and availability status for each variant.
- **FR-002**: System MUST dynamically update the available options for one variant dimension (e.g., color) when the user selects a value in another dimension (e.g., size).
- **FR-003**: System MUST visually disable variant option buttons that are not available for the currently selected combination.
- **FR-004**: System MUST visually differentiate between options that are disabled due to the current selection context and options that are completely out of stock.
- **FR-005**: System MUST pre-select a default available variant when the product page is first loaded.
- **FR-006**: System MUST prevent users from adding an unavailable variant combination to their cart or completing a purchase for it.
- **FR-007**: System MUST handle variant updates with zero or near-zero perceptible delay (no full page reloads) after the initial page load.
- **FR-008**: System MUST correctly handle products with a single variant dimension (only color or only size) by disabling unavailable options within that single dimension.
- **FR-009**: System MUST display a clear "Out of Stock" message when all variants of a product are unavailable.
- **FR-010**: System MUST maintain the user's selection state — if a shopper selects a size and then changes color, the size selection should persist if the new color supports it; otherwise, the system should auto-switch to the first available size in display order for the newly selected color.
- **FR-011**: System MUST validate variant selections from URL parameters on page load — if the combination is valid and available, pre-select it; otherwise, fallback to the default available variant.

### Key Entities

- **Product**: The item being sold, which can have multiple variants. Key attributes: name, description, price.
- **Product Variant**: A specific purchasable combination (e.g., Black/Size 32). Key attributes: color, color hex code, size, SKU, availability status.
- **Variant Dimension**: A single axis of variation (e.g., "Color" or "Size"). A product may have one or two dimensions.
- **Availability Matrix**: The cross-reference of all dimension values showing which combinations exist and are in stock. Derived from the collection of product variants.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% of unavailable variant combinations are visually disabled before a user can attempt to select them.
- **SC-002**: Variant availability updates after a user selection occur within 200 milliseconds of perceived response time (no loading spinner or delay visible to the user).
- **SC-003**: Default variant selection on page load results in a valid, in-stock option 100% of the time when at least one variant is available.
- **SC-004**: Users can distinguish between "unavailable for this selection" and "out of stock" options with at least two distinct visual cues.
- **SC-005**: Zero instances where a user can add a genuinely unavailable product variant to their cart.

## Assumptions

- Products in the store use at most two variant dimensions: color and size. Additional dimensions (e.g., material, pattern) are out of scope.
- Variant availability data (`isAvailable` field) is already maintained in the database by the admin dashboard and is the single source of truth for stock status.
- The product page already exists and currently displays variant options — this feature enhances the existing selector with dynamic availability logic.
- Real-time inventory sync (e.g., WebSocket updates when another shopper purchases the last item) is out of scope; availability is determined at page load time.
- The storefront does not currently have cart/checkout functionality — FR-006 will be enforced at the UI level by preventing selection of unavailable variants.

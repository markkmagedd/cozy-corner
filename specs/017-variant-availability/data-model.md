# Data Model: Dynamic Variant Availability Selection

**Feature**: 017-variant-availability  
**Date**: 2026-04-23

## Existing Entities (No Schema Changes Required)

### ProductVariant

The existing `ProductVariant` model already contains all fields needed for this feature. **No database migrations required.**

| Field       | Type     | Description                                        |
|-------------|----------|----------------------------------------------------|
| id          | String   | Unique identifier (cuid)                           |
| productId   | String   | FK → Product                                       |
| color       | String?  | Color name (e.g., "Black", "Grey")                 |
| colorHex    | String?  | Hex code for color swatch (e.g., "#000000")        |
| size        | String?  | Size label (e.g., "32", "M", "XL")                 |
| sku         | String   | Unique stock-keeping unit                          |
| isAvailable | Boolean  | Whether this specific variant is in stock           |

### Product (relevant fields)

| Field    | Type              | Description                          |
|----------|-------------------|--------------------------------------|
| id       | String            | Unique identifier                    |
| variants | ProductVariant[]  | All variant combinations             |

## Client-Side Derived Data Structures

These structures are computed at runtime from the `ProductVariant[]` array. They are not persisted.

### VariantOption (enhanced)

Extends the existing `VariantGroup.options` structure with a new availability state:

| Field             | Type                                           | Description                                           |
|-------------------|------------------------------------------------|-------------------------------------------------------|
| value             | string                                         | Option label (e.g., "Black", "32")                    |
| colorHex          | string? | null                                  | Hex code (color group only)                           |
| availabilityState | `"available"` \| `"disabled"` \| `"oos"`       | Computed per current selection                        |

**State definitions**:
- `"available"`: This option has at least one in-stock variant matching the current other-dimension selection (or no other-dimension selection).
- `"disabled"`: This option has no in-stock variant matching the current other-dimension selection, but has at least one in-stock variant in some other combination.
- `"oos"`: This option has `isAvailable = false` for ALL its variants across all combinations. Globally out of stock.

### AvailabilityMatrix

Derived lookup structure for O(1) availability checks:

| Key                    | Value                  | Description                                      |
|------------------------|------------------------|--------------------------------------------------|
| `color:{value}`        | `Set<string>` of sizes | Sizes available for this color                   |
| `size:{value}`         | `Set<string>` of colors| Colors available for this size                   |
| `globalOos:color:{value}` | boolean             | True if ALL variants with this color are OOS     |
| `globalOos:size:{value}`  | boolean             | True if ALL variants with this size are OOS      |

## Relationships

```text
Product (1) ──→ (N) ProductVariant
                     ├── color? ──→ VariantOption (color group)
                     └── size?  ──→ VariantOption (size group)
```

## Validation Rules

- A product may have 0, 1, or 2 variant dimensions (color only, size only, or both).
- Each variant dimension has 1+ unique values.
- `isAvailable` is the sole source of truth for stock status (maintained by admin).
- URL params (`?color=X&size=Y`) must map to an existing, available variant to be considered valid.

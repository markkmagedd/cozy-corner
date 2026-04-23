# Quickstart: Dynamic Variant Availability Selection

**Feature**: 017-variant-availability  
**Branch**: `017-variant-availability`

## Prerequisites

- Node.js 18+
- PostgreSQL database with existing schema (no migrations needed)
- `npm install` completed
- `.env.local` configured with `DATABASE_URL`

## What Changes

This feature modifies **3 existing files** and creates **1 new utility file**:

### Modified Files

1. **`src/app/product/[slug]/page.tsx`** (Server Component)
   - Add server-side default variant selection logic
   - Validate URL search params against available variants
   - Redirect to valid default if params are invalid/absent
   - Pass full `variants` array to VariantSelector

2. **`src/components/storefront/product/VariantSelector.tsx`** (Client Component)
   - Accept raw `variants` array instead of pre-computed `groups`
   - Build availability matrix from variants on each render
   - Compute `availabilityState` per option based on current selection
   - Apply distinct visual styles: available / disabled-by-selection / out-of-stock
   - Auto-switch logic when selection creates a conflict

3. **`src/types/index.ts`**
   - Add `AvailabilityState` type alias

### New Files

4. **`src/lib/variant-utils.ts`**
   - `buildAvailabilityMatrix(variants)` — derives the lookup matrix
   - `getDefaultVariant(variants)` — finds first available variant
   - `getOptionAvailability(matrix, dimension, value, currentSelection)` — returns availability state
   - `resolveConflict(matrix, dimension, newValue, otherDimension, currentOtherValue)` — auto-switch logic

## Development Flow

```bash
# 1. Switch to feature branch
git checkout 017-variant-availability

# 2. Run dev server
npm run dev

# 3. Navigate to any product page with variants
open http://localhost:3000/product/<slug-with-variants>

# 4. Run tests
npm run test
```

## Testing Strategy

- **Unit tests**: `variant-utils.ts` functions with various variant configurations
- **Component tests**: VariantSelector rendering with different availability states
- **Manual testing**: Product pages with known variant data (use admin to set up test products)

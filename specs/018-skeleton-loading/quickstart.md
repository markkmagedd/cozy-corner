# Quickstart: Skeleton Loading States

**Feature**: 018-skeleton-loading  
**Branch**: `018-skeleton-loading`

## Prerequisites

- Node.js 18+
- `npm install` completed
- `.env.local` configured with `DATABASE_URL`

## What Changes

This feature creates **8 new `loading.tsx` files** — one per route that was missing a skeleton loading state. No existing files are modified.

### New Files

| # | File | Skeleton Content |
|---|------|-----------------|
| 1 | `src/app/loading.tsx` | Hero placeholder + product grid (8 cards) + featured categories |
| 2 | `src/app/categories/loading.tsx` | Page header + category card grid (6 cards) |
| 3 | `src/app/category/[slug]/loading.tsx` | Category header + filter sidebar + product grid |
| 4 | `src/app/admin/loading.tsx` | 4 stat cards row |
| 5 | `src/app/admin/products/new/loading.tsx` | Page header + form fields |
| 6 | `src/app/admin/products/[id]/edit/loading.tsx` | Page header + form fields + image placeholder |
| 7 | `src/app/admin/categories/new/loading.tsx` | Page header + form fields |
| 8 | `src/app/admin/categories/[id]/edit/loading.tsx` | Page header + form fields |

### Reference Files (existing patterns)

- `src/app/admin/categories/loading.tsx` — admin list page skeleton
- `src/app/admin/products/loading.tsx` — admin list page skeleton
- `src/app/product/[slug]/loading.tsx` — storefront detail page skeleton
- `src/components/ui/Skeleton.tsx` — base UI component

## Development Flow

```bash
# 1. Switch to feature branch
git checkout 018-skeleton-loading

# 2. Run dev server
npm run dev

# 3. Test by adding artificial latency to any page's prisma calls:
#    e.g., add `await new Promise(r => setTimeout(r, 3000))` at the top of a page component
#    Then navigate to that page to see the skeleton

# 4. Verify all 8 routes show skeletons
open http://localhost:3000
open http://localhost:3000/categories
open http://localhost:3000/category/<any-slug>
open http://localhost:3000/admin
open http://localhost:3000/admin/products/new
open http://localhost:3000/admin/products/<any-id>/edit
open http://localhost:3000/admin/categories/new
open http://localhost:3000/admin/categories/<any-id>/edit
```

## Testing Strategy

- **Manual testing**: Add `await new Promise(r => setTimeout(r, 3000))` to each server component to simulate slow data fetching, then verify skeleton appears.
- **Visual testing**: Compare skeleton layout to loaded page — verify matching column counts, card proportions, and form field heights.
- **CLS testing**: Use Chrome DevTools Performance tab to measure Cumulative Layout Shift on skeleton → content transition.

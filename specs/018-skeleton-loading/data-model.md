# Data Model: Skeleton Loading States

**Feature**: 018-skeleton-loading  
**Date**: 2026-04-23

## No New Entities Required

This feature does not introduce any new data entities, database changes, or client-side state structures. It exclusively creates `loading.tsx` files that use the existing `Skeleton` UI component to render placeholder layouts.

## Existing Entity (Reused)

### Skeleton (UI Component)

The existing `src/components/ui/Skeleton.tsx` component is the sole building block:

| Prop       | Type     | Description                              |
|------------|----------|------------------------------------------|
| className  | string?  | Tailwind classes for sizing/positioning  |
| ...props   | HTMLDiv  | Standard div attributes                  |

**Behavior**: Renders a `<div>` with `animate-pulse rounded-md bg-slate-100` classes, merging any additional className.

## Mapping: Pages → Skeleton Layouts

| Route | Skeleton Content Blocks | References |
|-------|------------------------|------------|
| `/` (Homepage) | Hero placeholder, 4-col product grid (8 cards), featured categories row | `ProductGrid.isLoading` pattern |
| `/categories` | Header placeholder, 3-col category card grid (6 cards) | `AllCategoriesGrid` layout |
| `/category/[slug]` | Category header + image, filter sidebar, 4-col product grid | Existing page layout |
| `/admin` | 4 stat cards in a row | Admin dashboard layout |
| `/admin/products/new` | Page header + form fields skeleton | Existing admin form pattern |
| `/admin/products/[id]/edit` | Page header + form fields + image gallery skeleton | Existing admin form pattern |
| `/admin/categories/new` | Page header + form fields skeleton | Existing admin form pattern |
| `/admin/categories/[id]/edit` | Page header + form fields skeleton | Existing admin form pattern |

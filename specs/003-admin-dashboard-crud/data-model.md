# Data Model: Admin Dashboard CRUD

**Feature**: 003-admin-dashboard-crud  
**Date**: 2026-03-29  
**Source**: Existing Prisma schema at `prisma/schema.prisma`

## Existing Entities (No Changes Required)

The current Prisma schema already fully supports all admin CRUD operations specified in the feature. No migrations or schema changes are needed.

### Category

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | String (CUID) | PK, auto-generated | |
| name | String | Unique, required | |
| slug | String | Unique, required | Auto-generated from name |
| description | String? | Optional | |
| parentId | String? | FK → Category.id | Self-referencing for hierarchy |
| isFeatured | Boolean | Default: false | Used in storefront MegaMenu |
| displayOrder | Int | Default: 0 | For ordered rendering |
| createdAt | DateTime | Auto-generated | |
| updatedAt | DateTime | Auto-updated | |

**Relations**: `parent` (optional Category), `children` (Category[]), `products` (Product[])  
**Indexes**: `slug`, `parentId`, `isFeatured`  
**Deletion rule**: Hard delete allowed ONLY when `products.count === 0` (FR-004)

### Product

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | String (CUID) | PK, auto-generated | |
| name | String | Required | |
| slug | String | Unique, required | Auto-generated from name |
| description | String? | Optional | |
| price | Float | Min: 0 | |
| brand | String? | Optional | |
| categoryId | String? | FK → Category.id, onDelete: SetNull | Nulled if category deleted |
| isActive | Boolean | Default: true | Soft-delete / hide from storefront |
| createdAt | DateTime | Auto-generated | |
| updatedAt | DateTime | Auto-updated | |

**Relations**: `category` (optional Category), `variants` (ProductVariant[]), `images` (ProductImage[])  
**Indexes**: `slug`, `categoryId`, `brand`, `price`  
**Deletion rule**: Prefer toggling `isActive` to false (soft-delete per assumptions)

### ProductVariant

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | String (CUID) | PK, auto-generated | |
| productId | String | FK → Product.id, onDelete: Cascade | |
| color | String? | Optional | |
| colorHex | String? | Optional | Hex code for UI swatch |
| size | String? | Optional | |
| sku | String | Unique, required | |
| isAvailable | Boolean | Default: true | |
| createdAt | DateTime | Auto-generated | |
| updatedAt | DateTime | Auto-updated | |

**Relations**: `product` (Product)  
**Indexes**: `productId`, `sku`  
**Note**: Products may have zero variants (single-option items per clarification)

### ProductImage

| Field | Type | Constraints | Notes |
|-------|------|-------------|-------|
| id | String (CUID) | PK, auto-generated | |
| productId | String | FK → Product.id, onDelete: Cascade | |
| url | String | Required | Public Supabase Storage URL |
| altText | String? | Optional | |
| displayOrder | Int | Default: 0 | For drag-and-drop reordering |
| isPrimary | Boolean | Default: false | Exactly one per product |
| storagePath | String | Required | Supabase Storage bucket path |
| createdAt | DateTime | Auto-generated | |

**Relations**: `product` (Product)  
**Indexes**: `productId`, `[productId, isPrimary]`  
**Upload constraint**: Max 5 MB per file (FR-010)

## Entity Relationships

```text
Category (1) ←──── (0..n) Product
                           │
                    ┌──────┴──────┐
                    │             │
            (0..n) Variant  (0..n) Image
```

## State Transitions

### Product Lifecycle
```text
Created (isActive: true) → Deactivated (isActive: false) → Reactivated (isActive: true)
```
Admin toggles `isActive`. Hard delete is possible but soft-delete (deactivation) is preferred.

### Category Lifecycle
```text
Created → Updated → Deleted (only if product count = 0)
```

## Validation Rules (from existing Zod schemas)

- **Category name**: 1–100 chars, required
- **Product name**: 1–200 chars, required
- **Product price**: ≥ 0
- **Variant SKU**: 1–50 chars, required, unique
- **Image upload**: ≤ 5 MB, image/* MIME type

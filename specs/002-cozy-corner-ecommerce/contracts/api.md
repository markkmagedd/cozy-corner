# API Contracts: Cozy Corner E-Commerce Platform

**Branch**: `002-cozy-corner-ecommerce` | **Date**: 2026-03-28  
**Base URL**: `/api`

## Storefront APIs (Public)

### GET /api/categories

Fetch all categories for navigation (mega-menu, breadcrumbs).

**Query Parameters**: None

**Response 200**:
```json
{
  "categories": [
    {
      "id": "string",
      "name": "string",
      "slug": "string",
      "description": "string | null",
      "parentId": "string | null",
      "isFeatured": "boolean",
      "displayOrder": "number",
      "children": [
        {
          "id": "string",
          "name": "string",
          "slug": "string",
          "description": "string | null",
          "parentId": "string",
          "isFeatured": "boolean",
          "displayOrder": "number",
          "children": []
        }
      ]
    }
  ]
}
```

**Notes**: Returns a nested tree structure. Top-level categories have `parentId: null`. Categories with `isFeatured: true` are curated collections.

---

### GET /api/products

Fetch products with filtering, sorting, and pagination.

**Query Parameters**:

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| categoryId | string | - | Filter by category |
| brand | string | - | Filter by brand (exact match) |
| minPrice | number | - | Minimum price filter |
| maxPrice | number | - | Maximum price filter |
| search | string | - | Full-text search query |
| sort | string | "newest" | Sort: "newest", "price_asc", "price_desc", "name_asc", "name_desc" |
| page | number | 1 | Page number (1-indexed) |
| limit | number | 12 | Items per page (max 48) |

**Response 200**:
```json
{
  "products": [
    {
      "id": "string",
      "name": "string",
      "slug": "string",
      "price": "number",
      "brand": "string | null",
      "categoryId": "string | null",
      "primaryImage": {
        "url": "string",
        "altText": "string | null"
      } | null,
      "availableColors": ["string"],
      "availableSizes": ["string"]
    }
  ],
  "pagination": {
    "page": "number",
    "limit": "number",
    "total": "number",
    "totalPages": "number"
  }
}
```

---

### GET /api/products/[slug]

Fetch full product details by slug.

**Response 200**:
```json
{
  "product": {
    "id": "string",
    "name": "string",
    "slug": "string",
    "description": "string | null",
    "price": "number",
    "brand": "string | null",
    "category": {
      "id": "string",
      "name": "string",
      "slug": "string"
    } | null,
    "variants": [
      {
        "id": "string",
        "color": "string | null",
        "colorHex": "string | null",
        "size": "string | null",
        "sku": "string",
        "isAvailable": "boolean"
      }
    ],
    "images": [
      {
        "id": "string",
        "url": "string",
        "altText": "string | null",
        "displayOrder": "number",
        "isPrimary": "boolean"
      }
    ],
    "relatedProducts": [
      {
        "id": "string",
        "name": "string",
        "slug": "string",
        "price": "number",
        "brand": "string | null",
        "primaryImage": {
          "url": "string",
          "altText": "string | null"
        } | null
      }
    ]
  }
}
```

**Response 404**: `{ "error": "Product not found" }`

**Notes**: `relatedProducts` returns up to 4 products from the same category, excluding the current product.

---

### GET /api/search

Global product search.

**Query Parameters**:

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| q | string | required | Search query (min 2 characters) |
| limit | number | 10 | Max results |

**Response 200**:
```json
{
  "results": [
    {
      "id": "string",
      "name": "string",
      "slug": "string",
      "price": "number",
      "brand": "string | null",
      "primaryImage": {
        "url": "string",
        "altText": "string | null"
      } | null
    }
  ],
  "total": "number"
}
```

---

## Admin APIs (Authenticated)

All admin endpoints require a valid Supabase Auth session cookie. Unauthenticated requests receive `401 Unauthorized`.

### POST /api/admin/products

Create a new product.

**Request Body**:
```json
{
  "name": "string (required, 1-200 chars)",
  "description": "string (optional)",
  "price": "number (required, >= 0)",
  "brand": "string (optional)",
  "categoryId": "string (optional)",
  "variants": [
    {
      "color": "string (optional)",
      "colorHex": "string (optional)",
      "size": "string (optional)",
      "sku": "string (required, unique)",
      "isAvailable": "boolean (default: true)"
    }
  ]
}
```

**Response 201**: Full product object (same shape as GET /api/products/[slug])  
**Response 400**: `{ "error": "string", "details": { "field": "message" } }`  
**Response 401**: `{ "error": "Unauthorized" }`

---

### PUT /api/admin/products/[id]

Update a product.

**Request Body**: Same shape as POST, all fields optional (partial update).

**Response 200**: Updated product object  
**Response 400**: Validation errors  
**Response 401**: Unauthorized  
**Response 404**: Product not found

---

### DELETE /api/admin/products/[id]

Delete a product and all its variants and images (cascade).

**Response 200**: `{ "message": "Product deleted" }`  
**Response 401**: Unauthorized  
**Response 404**: Product not found

**Side effects**: Deletes associated images from Supabase Storage.

---

### GET /api/admin/products

List products for admin table.

**Query Parameters**:

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| search | string | - | Search by name or brand |
| categoryId | string | - | Filter by category |
| sort | string | "newest" | Sort field |
| page | number | 1 | Page number |
| limit | number | 20 | Items per page |

**Response 200**: Same shape as public GET /api/products but includes `isActive` flag and full variant/image counts.

---

### POST /api/admin/categories

Create a new category.

**Request Body**:
```json
{
  "name": "string (required, 1-100 chars)",
  "description": "string (optional)",
  "parentId": "string (optional)",
  "isFeatured": "boolean (default: false)",
  "displayOrder": "number (default: 0)"
}
```

**Response 201**: Created category object  
**Response 400**: Validation errors  
**Response 401**: Unauthorized

---

### PUT /api/admin/categories/[id]

Update a category.

**Request Body**: Partial update, same fields as POST.

**Response 200**: Updated category object  
**Response 400**: Validation errors (including cycle detection for parentId)  
**Response 401**: Unauthorized  
**Response 404**: Category not found

---

### DELETE /api/admin/categories/[id]

Delete a category.

**Response 200**: `{ "message": "Category deleted", "productsAffected": "number" }`  
**Response 401**: Unauthorized  
**Response 404**: Category not found

**Side effects**: Products in this category have `categoryId` set to null. Child categories have `parentId` set to null.

---

### POST /api/admin/products/[id]/images

Upload product images.

**Request**: `multipart/form-data` with file field(s)

| Field | Type | Description |
|-------|------|-------------|
| files | File[] | Image files (max 5 MB each, JPEG/PNG/WebP) |
| altTexts | string[] | Optional alt texts (parallel array) |

**Response 201**:
```json
{
  "images": [
    {
      "id": "string",
      "url": "string",
      "altText": "string | null",
      "displayOrder": "number",
      "isPrimary": "boolean"
    }
  ]
}
```

**Response 400**: `{ "error": "File too large" }` or `{ "error": "Unsupported format" }`  
**Response 401**: Unauthorized  
**Response 404**: Product not found

---

### PUT /api/admin/products/[id]/images/reorder

Reorder product images.

**Request Body**:
```json
{
  "imageIds": ["string (ordered by desired displayOrder)"]
}
```

**Response 200**: Updated images array  
**Response 401**: Unauthorized

---

### PUT /api/admin/products/[id]/images/[imageId]/primary

Set an image as primary.

**Response 200**: Updated image object  
**Response 401**: Unauthorized

**Side effects**: Unsets `isPrimary` on any previously primary image for this product.

---

### DELETE /api/admin/products/[id]/images/[imageId]

Delete a product image.

**Response 200**: `{ "message": "Image deleted" }`  
**Response 401**: Unauthorized  
**Response 404**: Image not found

**Side effects**: Removes file from Supabase Storage.

---

## Authentication

### POST /api/auth/login

Admin login.

**Request Body**:
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

**Response 200**: `{ "user": { "id": "string", "email": "string" } }`  
**Response 401**: `{ "error": "Invalid credentials" }`

**Side effects**: Sets Supabase Auth session cookie.

---

### POST /api/auth/logout

Admin logout.

**Response 200**: `{ "message": "Logged out" }`

**Side effects**: Clears Supabase Auth session cookie.

---

## Error Response Format

All error responses follow a consistent format:

```json
{
  "error": "string (human-readable message)",
  "details": {} // optional, field-level validation errors
}
```

## HTTP Status Codes

| Code | Usage |
|------|-------|
| 200 | Successful read/update/delete |
| 201 | Successful create |
| 400 | Validation error / bad request |
| 401 | Unauthenticated |
| 404 | Resource not found |
| 500 | Internal server error |

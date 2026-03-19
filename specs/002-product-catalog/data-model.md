# Data Model: 002-product-catalog

## Overview
This feature relies purely on mock local data. The below defines the TypeScript interfaces that act as the schema for the application.

## Core Entities

### 1. Product
Represents an individual item in the hotel shop catalog.

```typescript
interface Product {
  id: string;              // Internal unique identifier
  slug: string;            // SEO/URL-friendly identifier (e.g., "blue-swim-trunks") -> Used in routing
  name: string;            // Display name of the product
  description: string;     // Full text description
  category: string;        // ID or Slug of the associated Category
  images: string[];        // Array of image URIs/paths (e.g., ["/images/products/swim-1.jpg", ...])
  availableSizes: string[];// Array of sizes (e.g., ["S", "M", "L"] or [] if N/A)
  availableColors: Color[];// Array of available colors (can be hex codes + names, or just names)
}

interface Color {
  name: string;            // e.g., "Navy Blue"
  hexCode: string;         // e.g., "#000080" for UI rendering
}
```

**Constraints & Rules:**
- `slug` must be globally unique.
- `images` array must contain at least one string if the product has images. (Handled gracefully if 0 or 1).
- If `availableSizes` or `availableColors` is an empty array, the UI section should be hidden.

### 2. Category
Represents a grouping of products.

```typescript
interface Category {
  id: string;              // Internal unique identifier
  slug: string;            // URL-friendly identifier for filtering (e.g., "?category=swimming-equipment")
  name: string;            // Display title (e.g., "Swimming Equipment")
}
```

**Constraints & Rules:**
- Minimum categories required: 'Clothing', 'Socks', 'Souvenirs', 'Swimming Equipment', plus others.

## Storage Architecture
* All data is stored in memory via a typed local constant or JSON payload.
* An abstraction layer (e.g., `lib/api/products.ts`) will serve this data, supporting simulated async operations.

```typescript
// Example simulated API methods
async function getProducts({ categorySlug, page, limit }): Promise<Product[]>
async function getProductBySlug(slug: string): Promise<Product | null>
async function getCategories(): Promise<Category[]>
```

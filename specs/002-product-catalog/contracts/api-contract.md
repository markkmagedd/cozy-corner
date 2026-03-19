# Contract: Mock Local API

## Read Operations

```typescript
// Fetch a paginated list of products, optionally filtered by category
// Used by the `/` listing page.
export type GetProductsArgs = {
  categorySlug?: string;
  page?: number;        // default 1
  limit?: number;       // default 10
}

export type PaginatedProducts = {
  products: Product[];
  totalCount: number;
  hasMore: boolean;     // Defines if infinite scroll should trigger again
}

async function getProducts(args: GetProductsArgs): Promise<PaginatedProducts>

// Fetch a single product by its slug
// Used by the `/product/[slug]` detail page.
async function getProductBySlug(slug: string): Promise<Product | null>

// Fetch all available categories
// Used by the persistent navigation header.
async function getCategories(): Promise<Category[]>
```

These functions will internally handle simulated network delay (e.g., `await new Promise(r => setTimeout(r, 400))`) to ensure animations and loading states behave identically to a real API interaction.

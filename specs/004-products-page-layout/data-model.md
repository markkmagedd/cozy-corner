# Phase 1: Data Model

## Entities

### `Category`
```typescript
export interface Category {
  id: string;
  name: string;
  parentId?: string | null;
  subcategories?: Category[]; // Optionally populated for tree structures
}
```

### `Product`
```typescript
export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number; // Optional: For sale items to calculate discount
  imageUrl: string;
  categoryId: string;
  sizes: string[];
  inStock: boolean;
}
```

### `PaginatedResponse<T>`
```typescript
export interface PaginatedResponse<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}
```

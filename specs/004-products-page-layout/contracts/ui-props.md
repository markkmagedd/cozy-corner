# Interface Contracts: UI Components

## Category sidebar filtering
```typescript
interface CategorySidebarProps {
  categories: Category[];
  activeCategoryId?: string;
  baseUrl: string; // The URL prefix to append query params to
}
```

## Configurable Product List
```typescript
interface ProductGridProps {
  products: Product[];
  emptyStateMessage?: string;
}
```

## Singular Output Frame
```typescript
interface ProductCardProps {
  product: Product;
}
```

## Standard Pagination Control
```typescript
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
}
```

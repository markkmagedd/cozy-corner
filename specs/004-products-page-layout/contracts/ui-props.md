# Contracts: UI Component Interfaces

## `ProductCardProps`
```typescript
interface ProductCardProps {
  id: string;
  title: string;
  image: string;
  currentPrice: number;
  originalPrice?: number;
  badges?: string[];
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onAddToCart: (id: string) => void;
}
```

## `CategorySidebarProps`
```typescript
interface Category {
  id: string;
  name: string;
  subcategories?: Category[];
}

interface CategorySidebarProps {
  categories: Category[];
  activeCategoryId?: string;
  onSelectCategory: (id: string) => void;
  isMobileDrawer?: boolean;
  onCloseDrawer?: () => void;
}
```

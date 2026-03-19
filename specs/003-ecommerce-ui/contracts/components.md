# Component Contracts

Due to the frontend-only nature of this project, interfaces are defined strictly by React component props.

## Feature Components

### CategoryGrid
```typescript
interface CategoryGridProps {
  categories: Category[];
  isLoading?: boolean;
}
```

### ProductCard
```typescript
interface ProductCardProps {
  product: Product;
  isLoading?: boolean;
}
```

### HeroBanner
```typescript
interface HeroBannerProps {
  headline: string;
  tagline: string;
  ctaText: string;
  ctaLink: string;
}
```

## UI Primitives

### SlideOver (Cart)
```typescript
interface SlideOverProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}
```

### Modal (Login)
```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}
```

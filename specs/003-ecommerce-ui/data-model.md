# Data Model

### Category
Represents a product categorization entity.
```typescript
interface Category {
  id: string;
  name: string;
  pastelColorClass: string; // Tailwind bg class for the pastel block
  imageUrl: string; // URL or SVG path for the icon
}
```

### Product
Represents an item for sale in the best deals section.
```typescript
interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number; // Used to calculate discount if applicable
  discountBadge?: string; // Text to show in the discount badge (e.g. "20% OFF")
  imageUrl: string;
}
```

### Validation Rules
- `Product.name`: Must be truncated dynamically if excessively long (handled at UI schema layer).
- `price`: Must be a positive floating point number.

# Interface Contracts: Admin UI Components

## Product Management Form
```typescript
interface ProductFormProps {
  initialData?: Product;
  categories: Category[]; // To populate the category dropdown
  onSubmit: (data: ProductFormData) => Promise<void>;
  isLoading?: boolean;
}

interface ProductFormData {
  title: string;
  description?: string;
  price: number;
  originalPrice?: number;
  categoryId: string;
  sizes: string[];
  inStock: boolean;
  imageFile?: File; // For new image uploads
}
```

## Category Management Tree
```typescript
interface CategoryTreeProps {
  categories: Category[]; // Full hierarchy
  onAdd: (parentId?: string) => void;
  onEdit: (category: Category) => void;
  onDelete: (id: string) => Promise<void>;
}
```

## Product Data Table
```typescript
interface ProductTableProps {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => Promise<void>;
  onToggleStock: (id: string, inStock: boolean) => Promise<void>;
}
```

## Image Preview & Upload
```typescript
interface ImageUploadProps {
  value?: string; // Current image URL
  onChange: (file: File | null) => void;
  onRemove: () => void;
  disabled?: boolean;
}
```

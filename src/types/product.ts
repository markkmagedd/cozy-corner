export interface Category {
  id: string;
  name: string;
  parentId?: string | null;
  subcategories?: Category[]; // Optionally populated for tree structures
}

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

export interface PaginatedResponse<T> {
  data: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl?: string | null;
  imageStoragePath?: string | null;
  parentId: string | null;
  isFeatured: boolean;
  displayOrder: number;
  children?: Category[];
}

export interface ProductVariant {
  id: string;
  productId: string;
  color: string | null;
  colorHex: string | null;
  size: string | null;
  sku: string;
  isAvailable: boolean;
  displayOrder?: number;
}

export type AvailabilityState = "available" | "disabled" | "oos";

export interface VariantOptionWithState {
  value: string;
  colorHex?: string | null;
  availabilityState: AvailabilityState;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  altText: string | null;
  displayOrder: number;
  isPrimary: boolean;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  compareAtPrice?: number | null;
  brand: string | null;
  categoryId: string | null;
  isActive: boolean;
  isOffer: boolean;
  variants?: ProductVariant[];
  images?: ProductImage[];
  // Application layer computed properties for API
  primaryImage?: { url: string; altText: string | null } | null;
  availableColors?: string[];
  availableSizes?: string[];
  category?: Partial<Category> | null;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ProductsResponse {
  products: Product[];
  pagination: PaginationMeta;
}

export interface CategoriesResponse {
  categories: Category[];
}

export interface SearchResponse {
  results: Product[];
  total: number;
}

// --- Admin Dashboard Types ---

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: PaginationMeta;
}

export interface TableColumn<T> {
  key?: keyof T;
  header: string;
  cell?: (item: T) => React.ReactNode;
}

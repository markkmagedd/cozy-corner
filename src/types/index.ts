export interface Color {
  name: string;
  hexCode: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  category: string; // matches Category slug
  images: string[];
  availableSizes: string[];
  availableColors: Color[];
}

export interface Category {
  id: string;
  slug: string;
  name: string;
}

export interface PaginatedProducts {
  products: Product[];
  totalCount: number;
  hasMore: boolean;
}

export interface GetProductsArgs {
  categorySlug?: string;
  page?: number;
  limit?: number;
}

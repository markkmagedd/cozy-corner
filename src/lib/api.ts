import { GetProductsArgs, PaginatedProducts, Product, Category } from '../types';
import { PRODUCTS } from '../data/mock-products';
import { CATEGORIES } from '../data/mock-categories';

const SIMULATED_DELAY = 600;

export async function getProducts({
  categorySlug = 'all',
  page = 1,
  limit = 8,
}: GetProductsArgs): Promise<PaginatedProducts> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY));

  // 1. Filter by category
  let filtered = [...PRODUCTS];
  if (categorySlug !== 'all') {
    filtered = PRODUCTS.filter((p) => p.category === categorySlug);
  }

  // 2. Paginate
  const start = (page - 1) * limit;
  const end = start + limit;
  const paginated = filtered.slice(start, end);

  return {
    products: paginated,
    totalCount: filtered.length,
    hasMore: end < filtered.length,
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY / 2));
  return PRODUCTS.find((p) => p.slug === slug) || null;
}

export async function getCategories(): Promise<Category[]> {
  await new Promise((resolve) => setTimeout(resolve, SIMULATED_DELAY / 3));
  return CATEGORIES;
}

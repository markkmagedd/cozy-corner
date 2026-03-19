export interface Category {
  id: string;
  name: string;
  parentCategoryId?: string;
  slug: string;
  subcategories?: Category[];
}

export interface Product {
  id: string;
  title: string;
  image: string;
  currentPrice: number;
  originalPrice?: number;
  badges?: string[];
  categoryIds: string[];
  isFavorite: boolean;
}

export interface CategorySidebarProps {
  categories: Category[];
  activeCategoryId?: string;
  onSelectCategory: (id: string) => void;
  isMobileDrawer?: boolean;
  onCloseDrawer?: () => void;
}

export interface ProductCardProps extends Product {
  onToggleFavorite: (id: string) => void;
  onAddToCart: (id: string) => void;
}

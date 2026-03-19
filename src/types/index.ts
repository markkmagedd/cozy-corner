export interface Category {
  id: string;
  name: string;
  pastelColorClass: string; // Tailwind bg class for the pastel block (e.g., 'bg-pastel-blue')
  imageUrl: string; // URL or static path for icons/images
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discountBadge?: string;
  imageUrl: string;
  categoryId: string;
}

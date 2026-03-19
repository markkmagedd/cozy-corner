"use server";

import { MOCK_PRODUCTS } from "../data-mock";
import { Product } from "../../types/product";

export async function fetchProductsByCategory(
  categoryId?: string, 
  offset: number = 0, 
  limit: number = 6,
  sort: string = "Newest",
  searchTerm?: string
): Promise<Product[]> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 800));

  let filtered = [...MOCK_PRODUCTS];
  
  if (categoryId && categoryId !== "1") {
    filtered = filtered.filter(p => p.categoryIds.includes(categoryId));
  }

  if (searchTerm) {
    filtered = filtered.filter(p => p.title.toLowerCase().includes(searchTerm.toLowerCase()));
  }

  // Basic sorting logic
  switch (sort) {
    case "Price: Low to High":
      filtered.sort((a, b) => a.currentPrice - b.currentPrice);
      break;
    case "Price: High to Low":
      filtered.sort((a, b) => b.currentPrice - a.currentPrice);
      break;
    case "Newest":
      // In mock, let's just reverse
      filtered.reverse();
      break;
  }

  return filtered.slice(offset, offset + limit);
}

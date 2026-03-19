import { Category, Product } from "../types/product";

export const MOCK_CATEGORIES: Category[] = [
  {
    id: "1",
    name: "Football Wear",
    slug: "football-wear",
    subcategories: [
      { id: "1-1", name: "Players Edition Jerseys", slug: "players-edition-jerseys", parentCategoryId: "1" },
      { id: "1-2", name: "Economical Players Edition Jerseys", slug: "economical-jerseys", parentCategoryId: "1" },
      { id: "1-3", name: "Mirror Original Jerseys", slug: "mirror-original-jerseys", parentCategoryId: "1" },
    ],
  },
  {
    id: "2",
    name: "Official Products",
    slug: "official-products",
  },
  {
    id: "3",
    name: "Personalized Jerseys",
    slug: "personalized-jerseys",
  },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    title: "Barcelona 1999/2000 Home Jersey with embroidered logos and modified...",
    image: "https://images.unsplash.com/photo-1522778147829-047360bdc7f6?q=80&w=800&auto=format&fit=crop",
    currentPrice: 150,
    originalPrice: 300,
    badges: ["offer"],
    categoryIds: ["1", "1-1"],
    isFavorite: false,
  },
  {
    id: "p2",
    title: "Argentina 2002 Home Jersey with Batistuta 9 printing and embroidered...",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=800&auto=format&fit=crop",
    currentPrice: 300,
    categoryIds: ["1", "1-1"],
    isFavorite: true,
  },
  {
    id: "p3",
    title: "Barcelona 2006 CL Final Jersey with Ronaldinho 10 printing and modified...",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=800&auto=format&fit=crop",
    currentPrice: 350,
    categoryIds: ["1", "1-1"],
    isFavorite: false,
  },
  {
    id: "p4",
    title: "Argentina 2014 Away Jersey with Messi 10 printing and FWC final...",
    image: "https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=800&auto=format&fit=crop",
    currentPrice: 225,
    categoryIds: ["1", "1-1"],
    isFavorite: false,
  },
];

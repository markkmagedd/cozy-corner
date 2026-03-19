import { Category, Product } from "@/src/types/product";

export const mockCategories: Category[] = [
  {
    id: "football-wear",
    name: "Football Wear",
    subcategories: [
      { id: "players-edition", name: "Players' Edition Jerseys", parentId: "football-wear" },
      { id: "economical-jerseys", name: "Economical Players' Edition Jerseys", parentId: "football-wear" },
      { id: "mirror-original", name: "Mirror Original Jerseys", parentId: "football-wear" },
      { id: "curva-special", name: "Curva Special Edition Jerseys", parentId: "football-wear" },
      { id: "original-quality", name: "Original Quality Jerseys - Curva Edition", parentId: "football-wear" },
      { id: "high-copy", name: "High Copy Jerseys", parentId: "football-wear" },
      { id: "classic-jerseys", name: "Classic Jerseys", parentId: "football-wear" },
      { id: "concept-jerseys", name: "Concept Jerseys", parentId: "football-wear" }
    ]
  },
  {
    id: "training-gear",
    name: "Training Gear",
    subcategories: [
      { id: "tracksuits", name: "Tracksuits", parentId: "training-gear" },
      { id: "training-tops", name: "Training Tops", parentId: "training-gear" },
    ]
  },
  {
    id: "accessories",
    name: "Accessories",
    subcategories: [
      { id: "socks", name: "Socks", parentId: "accessories" },
      { id: "caps", name: "Caps", parentId: "accessories" }
    ]
  }
];

export const mockProducts: Product[] = [
  {
    id: "barcelona-1999",
    title: "Barcelona 1999/2000 Home Jersey with embroidered logos and modifications",
    description: "Vintage Barcelona 1999 Home Jersey.",
    price: 150,
    originalPrice: 300,
    imageUrl: "https://placehold.co/400x500/004d98/ffffff?text=Barca+1999",
    categoryId: "classic-jerseys",
    sizes: ["S", "M", "L", "XL"],
    inStock: true
  },
  {
    id: "argentina-2002",
    title: "Argentina 2002 Home Jersey with Batistuta 9 printing and embroidered logos",
    description: "Iconic Argentina 2002 Home Jersey.",
    price: 300,
    imageUrl: "https://placehold.co/400x500/75aadb/ffffff?text=Argentina+2002",
    categoryId: "classic-jerseys",
    sizes: ["M", "L", "XL"],
    inStock: true
  },
  {
    id: "barcelona-2006",
    title: "Barcelona 2006 CL Final Jersey with Ronaldinho 10 printing and modifications",
    description: "Classic CL final edition jersey from 2006.",
    price: 350,
    imageUrl: "https://placehold.co/400x500/004d98/ffffff?text=Barca+2006",
    categoryId: "classic-jerseys",
    sizes: ["S", "M", "L"],
    inStock: true
  },
  {
    id: "argentina-2014",
    title: "Argentina 2014 Away Jersey with Messi 10 printing and FWC final patch",
    description: "Argentina 2014 Away Jersey Messi.",
    price: 325,
    imageUrl: "https://placehold.co/400x500/003566/ffffff?text=Argentina+2014+Away",
    categoryId: "classic-jerseys",
    sizes: ["S", "M", "L", "XL"],
    inStock: true
  },
  {
    id: "jamaica-2026-away",
    title: "Jamaica 2026/27 Away Jersey with embroidered logos AT-124",
    description: "Latest Jamaica away jersey design.",
    price: 300,
    imageUrl: "https://placehold.co/400x500/ffcd00/000000?text=Jamaica+Away",
    categoryId: "players-edition",
    sizes: ["M", "L", "XL"],
    inStock: true
  },
  {
    id: "jamaica-2026-home",
    title: "Jamaica 2026/27 Home Jersey with embroidered logos AT-123",
    description: "Latest Jamaica home jersey with premium embroidery.",
    price: 300,
    imageUrl: "https://placehold.co/400x500/3ab54a/000000?text=Jamaica+Home",
    categoryId: "players-edition",
    sizes: ["S", "M", "L", "XL"],
    inStock: true
  }
];

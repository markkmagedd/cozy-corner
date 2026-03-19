import { Product } from "@/src/types";

export const mockProducts: Product[] = [
  {
    id: "p1",
    name: "Cotton Canvas Jacket",
    price: 120,
    originalPrice: 150,
    discountBadge: "20% OFF",
    imageUrl: "/products/jacket.png",
    categoryId: "outerwear",
  },
  {
    id: "p2",
    name: "Classic Leather Sneakers",
    price: 85,
    imageUrl: "/products/sneakers.png",
    categoryId: "footwear",
  },
  {
    id: "p3",
    name: "Premium Duffle Bag",
    price: 95,
    originalPrice: 110,
    discountBadge: "SALE",
    imageUrl: "/products/bag.png",
    categoryId: "bags",
  },
  {
    id: "p4",
    name: "Ultra-Light Trekking Shoes",
    price: 145,
    imageUrl: "/products/trek-shoes.png",
    categoryId: "footwear",
  },
  {
    id: "p5",
    name: "Performance Sports Hoodie",
    price: 65,
    originalPrice: 85,
    discountBadge: "Hot Deal",
    imageUrl: "/products/hoodie.png",
    categoryId: "mens-clothing",
  },
];

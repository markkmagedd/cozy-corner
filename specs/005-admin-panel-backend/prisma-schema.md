# Prisma Schema: Cozy Corner Catalog

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}

generator client {
  provider = "prisma-client-js"
}

model Category {
  id        String     @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  name      String     @unique
  slug      String     @unique
  parentId  String?    @map("parent_id") @db.Uuid
  createdAt DateTime   @default(now()) @map("created_at")
  updatedAt DateTime   @default(now()) @updatedAt @map("updated_at")

  parent    Category?  @relation("SubCategories", fields: [parentId], references: [id])
  children  Category[] @relation("SubCategories")
  products  Product[]

  @@map("categories")
}

model Product {
  id            String   @id @default(dbgenerated("gen_random_uuid()")) @db.Uuid
  title         String
  slug          String   @unique
  description   String?
  price         Decimal  @db.Decimal(10, 2)
  originalPrice Decimal? @map("original_price") @db.Decimal(10, 2)
  imageUrl      String   @map("image_url")
  categoryId    String   @map("category_id") @db.Uuid
  sizes         String[] @default([])
  inStock       Boolean  @default(true) @map("in_stock")
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @default(now()) @updatedAt @map("updated_at")

  category      Category @relation(fields: [categoryId], references: [id])

  @@map("products")
}
```

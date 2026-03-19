# Phase 1 Data Model: Admin Panel Backend

## PostgreSQL Schema (Supabase)

### Table: `categories`
| Field | Type | Constraint | Description |
|-------|------|------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique ID |
| `name` | TEXT | NOT NULL | Category name |
| `slug` | TEXT | UNIQUE, NOT NULL | URL-friendly slug |
| `parent_id` | UUID | FOREIGN KEY (categories.id) ON DELETE SET NULL | Self-reference for subcategories |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Creation time |
| `updated_at` | TIMESTAMPTZ | DEFAULT now() | Last update time |

### Table: `products`
| Field | Type | Constraint | Description |
|-------|------|------------|-------------|
| `id` | UUID | PRIMARY KEY, DEFAULT gen_random_uuid() | Unique ID |
| `title` | TEXT | NOT NULL | Product title |
| `slug` | TEXT | UNIQUE, NOT NULL | URL-friendly slug |
| `description` | TEXT | | Product description |
| `price` | NUMERIC | NOT NULL, CHECK (price >= 0) | Selling price |
| `original_price`| NUMERIC | CHECK (original_price >= price) | Original price for discounts |
| `image_url` | TEXT | | Supabase Storage public URL |
| `category_id` | UUID | FOREIGN KEY (categories.id) ON DELETE RESTRICT | Associated category |
| `sizes` | TEXT[] | DEFAULT '{}' | Available sizes (XS, S, M, L, XL) |
| `in_stock` | BOOLEAN | DEFAULT true | Inventory status |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Creation time |
| `updated_at` | TIMESTAMPTZ | DEFAULT now() | Last update time |

## Row Level Security (RLS) Policies

### `categories`
- **Policy `Public Select`**: `FOR SELECT USING (true)` - Anyone can view.
- **Policy `Admin All`**: `FOR ALL TO authenticated USING (auth.role() = 'authenticated')` - Admins (authenticated) manage all.

### `products`
- **Policy `Public Select`**: `FOR SELECT USING (true)` - Anyone can view.
- **Policy `Admin All`**: `FOR ALL TO authenticated USING (auth.role() = 'authenticated')` - Admins (authenticated) manage all.

## Storage Buckets: `product-images`
- **Visibility**: Public
- **RLS**:
  - `FOR SELECT`: `true` (Everyone can view)
  - `FOR INSERT/UPDATE/DELETE`: `auth.role() = 'authenticated'`

## Validation Rules (Next.js Layer)
- **Title**: min 3 chars, max 100 chars.
- **Slug**: Regex `^[a-z0-9-]+$`.
- **Price**: Must be a number > 0.
- **Category**: Must exist in the DB.
- **Image**: Max 5MB, JPG/PNG/WEBP only.

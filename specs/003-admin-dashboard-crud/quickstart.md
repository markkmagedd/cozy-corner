# Quickstart: Admin Dashboard CRUD

**Feature**: 003-admin-dashboard-crud

## Prerequisites

1. Supabase project configured with:
   - Auth enabled (email/password provider)
   - Storage bucket named `product-images` (public)
   - Database schema already pushed via `npx prisma db push`

2. Environment variables set in `.env`:
   - `DATABASE_URL`, `DIRECT_URL`: PostgreSQL connection strings
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase client config
   - `SUPABASE_SERVICE_ROLE_KEY`: Required for server-side storage operations

3. Admin user created in Supabase Auth Dashboard (Authentication > Users > Add user)

## Quick Run

```bash
# From project root
npm run dev

# Visit admin dashboard
open http://localhost:3000/admin/login
```

## Key Paths

| Path | Description |
|------|-------------|
| `/admin/login` | Admin sign-in page |
| `/admin` | Dashboard overview |
| `/admin/categories` | Category management list |
| `/admin/categories/new` | Create category |
| `/admin/categories/[id]/edit` | Edit category |
| `/admin/products` | Product management list |
| `/admin/products/new` | Create product |
| `/admin/products/[id]/edit` | Edit product (variants + images) |

## Testing Flow

1. Log in at `/admin/login` with Supabase Auth credentials
2. Create a top-level category (e.g., "Clothing")
3. Create a subcategory under it (e.g., "Jackets" with parent "Clothing")
4. Create a product assigned to "Jackets"
5. Add variants (size M blue, size L red)
6. Upload product images, set one as primary, reorder via drag-and-drop
7. Verify the product appears on the storefront at `/`
8. Attempt to delete "Jackets" category — should be blocked with error
9. Deactivate the product — should disappear from storefront
10. Delete the product, then delete the now-empty "Jackets" category — should succeed

## Supabase Storage Setup

Before image uploads work, create the storage bucket:

1. Go to Supabase Dashboard > Storage
2. Create a new bucket called `product-images`
3. Set it to **Public** (images need to be publicly accessible on the storefront)
4. Add a storage policy allowing authenticated users to upload:
   - Policy name: "Admin uploads"
   - Operation: INSERT
   - Target roles: authenticated

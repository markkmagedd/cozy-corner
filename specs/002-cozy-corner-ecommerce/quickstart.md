# Quickstart: Cozy Corner E-Commerce Platform

**Branch**: `002-cozy-corner-ecommerce` | **Date**: 2026-03-28

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm or yarn
- A Supabase project (free tier works for development)

## 1. Clone & Install

```bash
cd cozy-corner-new
npm install
```

## 2. Supabase Project Setup

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Note your project's:
   - **Project URL** (e.g., `https://xxxx.supabase.co`)
   - **Anon Key** (public, for client-side)
   - **Service Role Key** (secret, for server-side admin operations)
   - **Database URL** (Settings → Database → Connection string → URI)

3. **Storage bucket**: In the Supabase dashboard:
   - Go to Storage → Create a new bucket named `product-images`
   - Set it as **Public** (for CDN image delivery)
   - Add a storage policy allowing authenticated users to upload/delete

4. **Auth**: In Supabase dashboard:
   - Go to Authentication → Settings
   - Ensure Email provider is enabled
   - Create an admin user via Authentication → Users → Invite user

## 3. Environment Variables

Create `.env.local` in the project root:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database (Prisma)
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Note**: `DATABASE_URL` uses the pooler connection (port 6543) for application queries. `DIRECT_URL` uses the direct connection (port 5432) for Prisma migrations.

## 4. Database Setup

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database (development)
npx prisma db push

# Or use migrations (production)
npx prisma migrate dev --name init
```

## 5. Run Development Server

```bash
npm run dev
```

- **Storefront**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3000/admin
- **Admin Login**: http://localhost:3000/admin/login

## 6. Seed Data (Optional)

```bash
npx prisma db seed
```

Creates sample categories, products with variants, and placeholder images for development.

## Project Structure

```
cozy-corner-new/
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Seed script
├── src/
│   ├── app/
│   │   ├── (storefront)/      # Route group: public pages
│   │   │   ├── page.tsx       # Homepage
│   │   │   ├── category/
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx  # Category listing
│   │   │   └── product/
│   │   │       └── [slug]/
│   │   │           └── page.tsx  # Product detail
│   │   ├── admin/             # Route group: admin dashboard
│   │   │   ├── login/
│   │   │   │   └── page.tsx
│   │   │   ├── products/
│   │   │   │   ├── page.tsx   # Product list
│   │   │   │   ├── new/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── [id]/
│   │   │   │       └── edit/
│   │   │   │           └── page.tsx
│   │   │   ├── categories/
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx     # Admin layout with sidebar
│   │   │   └── page.tsx       # Admin dashboard home
│   │   ├── api/
│   │   │   ├── products/
│   │   │   │   ├── route.ts         # GET (list), POST (create)
│   │   │   │   └── [slug]/
│   │   │   │       └── route.ts     # GET (detail)
│   │   │   ├── categories/
│   │   │   │   └── route.ts         # GET (tree)
│   │   │   ├── search/
│   │   │   │   └── route.ts         # GET (search)
│   │   │   ├── admin/
│   │   │   │   ├── products/
│   │   │   │   │   ├── route.ts     # GET (admin list), POST (create)
│   │   │   │   │   └── [id]/
│   │   │   │   │       ├── route.ts              # PUT, DELETE
│   │   │   │   │       └── images/
│   │   │   │   │           ├── route.ts          # POST (upload)
│   │   │   │   │           ├── reorder/
│   │   │   │   │           │   └── route.ts      # PUT
│   │   │   │   │           └── [imageId]/
│   │   │   │   │               ├── primary/
│   │   │   │   │               │   └── route.ts  # PUT
│   │   │   │   │               └── route.ts      # DELETE
│   │   │   │   └── categories/
│   │   │   │       ├── route.ts     # POST (create)
│   │   │   │       └── [id]/
│   │   │   │           └── route.ts # PUT, DELETE
│   │   │   └── auth/
│   │   │       ├── login/
│   │   │       │   └── route.ts
│   │   │       └── logout/
│   │   │           └── route.ts
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Tailwind + global styles
│   ├── components/
│   │   ├── storefront/        # Public UI components
│   │   │   ├── Navbar.tsx
│   │   │   ├── MegaMenu.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductGrid.tsx
│   │   │   ├── FilterSidebar.tsx
│   │   │   ├── SearchBar.tsx
│   │   │   ├── Breadcrumbs.tsx
│   │   │   ├── ImageGallery.tsx
│   │   │   ├── VariantSelector.tsx
│   │   │   ├── Pagination.tsx
│   │   │   └── Footer.tsx
│   │   ├── admin/             # Admin UI components
│   │   │   ├── AdminSidebar.tsx
│   │   │   ├── ProductForm.tsx
│   │   │   ├── ProductTable.tsx
│   │   │   ├── CategoryForm.tsx
│   │   │   ├── CategoryTree.tsx
│   │   │   ├── ImageUploader.tsx
│   │   │   └── ImageSortable.tsx
│   │   └── ui/                # Shared UI primitives
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       ├── Toast.tsx
│   │       ├── Skeleton.tsx
│   │       └── Select.tsx
│   ├── lib/
│   │   ├── prisma.ts          # Prisma client singleton
│   │   ├── supabase/
│   │   │   ├── client.ts      # Browser Supabase client
│   │   │   ├── server.ts      # Server Supabase client
│   │   │   └── middleware.ts  # Auth middleware helpers
│   │   ├── utils.ts           # Shared utilities (slug, format)
│   │   └── validations.ts    # Zod schemas
│   └── types/
│       └── index.ts           # Shared TypeScript types
├── public/
│   └── placeholder.svg        # Placeholder product image
├── .env.local                 # Environment variables (not committed)
├── .env.example               # Template for .env.local
├── middleware.ts              # Next.js middleware (admin auth guard)
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Key Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 3000) |
| `npm run build` | Production build |
| `npx prisma studio` | Open Prisma database GUI |
| `npx prisma db push` | Push schema changes to DB |
| `npx prisma migrate dev` | Create and apply migration |
| `npx prisma generate` | Regenerate Prisma client |
| `npx prisma db seed` | Seed database with sample data |

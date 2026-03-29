# Implementation Plan: Admin Dashboard CRUD

**Branch**: `003-admin-dashboard-crud` | **Date**: 2026-03-29 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-admin-dashboard-crud/spec.md`

## Summary

Build a protected admin dashboard within the existing Cozy Corner Next.js application that enables administrators to perform full CRUD operations on Categories and Products (including variants and images). Authentication gates all admin routes via Supabase Auth (already configured in middleware). Image uploads use Supabase Storage with a 5 MB per-file limit. The dashboard uses Server Actions for mutations and React Server Components for data display, with client-side interactivity for forms, drag-and-drop image reordering, and inline variant management.

## Technical Context

**Language/Version**: TypeScript 5.x on Node.js  
**Primary Dependencies**: Next.js 16.2.1 (App Router), React 19, Prisma 6.x, @supabase/ssr, Tailwind CSS v4, react-hook-form, zod, @dnd-kit/core + @dnd-kit/sortable, lucide-react  
**Storage**: PostgreSQL (Supabase) via Prisma ORM; Supabase Storage for product images  
**Testing**: Manual validation via browser; TypeScript type-checking (`npm run build`)  
**Target Platform**: Web (desktop-primary admin usage)  
**Project Type**: Web application (Next.js App Router)  
**Performance Goals**: Dashboard lists load <1s for catalogs up to 5,000 items (SC-002)  
**Constraints**: Max 5 MB per image upload (FR-010); admin routes protected by Supabase Auth middleware  
**Scale/Scope**: Single admin user type; ~10 admin pages/routes total

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

The project constitution is in template/placeholder state (not customized). No custom gates or principles are enforced. Proceeding with industry-standard best practices:

- ✅ No unnecessary complexity: Reusing existing Prisma schema, Supabase Auth, and UI primitives
- ✅ Server Actions for mutations avoid unnecessary API route proliferation
- ✅ Existing validation schemas (zod) reused and extended

## Project Structure

### Documentation (this feature)

```text
specs/003-admin-dashboard-crud/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output (admin API contracts)
└── tasks.md             # Phase 2 output (/speckit.tasks)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── admin/
│   │   ├── layout.tsx              # Admin shell layout (sidebar + header)
│   │   ├── page.tsx                # Admin dashboard overview
│   │   ├── login/
│   │   │   └── page.tsx            # Login page (email/password)
│   │   ├── categories/
│   │   │   ├── page.tsx            # Category list (paginated, searchable)
│   │   │   ├── new/
│   │   │   │   └── page.tsx        # Create category form
│   │   │   └── [id]/
│   │   │       └── edit/
│   │   │           └── page.tsx    # Edit category form
│   │   └── products/
│   │       ├── page.tsx            # Product list (paginated, searchable)
│   │       ├── new/
│   │       │   └── page.tsx        # Create product form
│   │       └── [id]/
│   │           └── edit/
│   │               └── page.tsx    # Edit product (variants + images)
│   └── api/                        # Existing storefront API routes (unchanged)
├── components/
│   ├── admin/
│   │   ├── AdminSidebar.tsx        # Navigation sidebar
│   │   ├── AdminHeader.tsx         # Top header with user info
│   │   ├── CategoryForm.tsx        # Reusable create/edit category form
│   │   ├── ProductForm.tsx         # Reusable create/edit product form
│   │   ├── VariantManager.tsx      # Inline variant CRUD section
│   │   ├── ImageUploader.tsx       # Image upload + drag-reorder + primary selection
│   │   ├── DataTable.tsx           # Generic paginated data table component
│   │   └── DeleteConfirmDialog.tsx # Reusable deletion confirmation modal
│   ├── storefront/                 # Existing storefront components (unchanged)
│   └── ui/                         # Existing shared UI primitives (unchanged)
├── lib/
│   ├── actions/
│   │   ├── category-actions.ts     # Server Actions for category CRUD
│   │   ├── product-actions.ts      # Server Actions for product CRUD
│   │   └── image-actions.ts        # Server Actions for image upload/delete/reorder
│   ├── supabase/
│   │   ├── server.ts               # Existing: server Supabase client
│   │   ├── client.ts               # Existing: browser Supabase client
│   │   └── middleware.ts           # Existing: auth middleware (already protects /admin)
│   ├── prisma.ts                   # Existing: Prisma client singleton
│   ├── validations.ts              # Existing: Zod schemas (extend for admin)
│   └── utils.ts                    # Existing: utility functions
└── types/
    └── index.ts                    # Existing: shared TypeScript interfaces (extend)
```

**Structure Decision**: The admin dashboard lives entirely under `src/app/admin/` using the Next.js App Router's nested layout pattern. Shared admin components go in `src/components/admin/`. Server Actions are organized under `src/lib/actions/` to keep mutations colocated and reusable.

## Complexity Tracking

No constitution violations to justify.

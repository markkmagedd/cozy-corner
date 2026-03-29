# Tasks: Cozy Corner E-Commerce Platform

**Input**: Design documents from `/specs/002-cozy-corner-ecommerce/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No automated tests requested. Manual testing via acceptance scenarios.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization, dependencies, and configuration

- [x] T001 Initialize Next.js 15 project with TypeScript and App Router in project root (`package.json`, `tsconfig.json`, `next.config.ts`)
- [x] T002 Install all dependencies: Prisma, `@supabase/supabase-js`, `@supabase/ssr`, Tailwind CSS v4, React Hook Form, Zod, `@dnd-kit/core`, `@dnd-kit/sortable` and dev dependencies
- [x] T003 [P] Configure Tailwind CSS v4 with custom design tokens (deep navy, white, light blue accent palette) in `src/app/globals.css` and `tailwind.config.ts`
- [x] T004 [P] Create `.env.example` with all required environment variables (Supabase URL, keys, database URLs, site URL)
- [x] T005 [P] Create shared TypeScript type definitions in `src/types/index.ts` (Product, Category, ProductVariant, ProductImage, API response types, pagination)
- [x] T006 [P] Create shared Zod validation schemas in `src/lib/validations.ts` (product create/update, category create/update, image upload, search params)
- [x] T007 [P] Create utility functions in `src/lib/utils.ts` (slugify, formatPrice, cn classname helper, buildImageUrl)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T008 Create Prisma schema with all 4 models (Category, Product, ProductVariant, ProductImage) including relations, indexes, and full-text search config in `prisma/schema.prisma`
- [x] T009 Create Prisma client singleton in `src/lib/prisma.ts` with connection pooling best practices
- [x] T010 [P] Create Supabase browser client in `src/lib/supabase/client.ts`
- [x] T011 [P] Create Supabase server client with cookie handling in `src/lib/supabase/server.ts`
- [x] T012 [P] Create Supabase middleware helper for session refresh in `src/lib/supabase/middleware.ts`
- [x] T013 Create Next.js middleware for admin route protection in `middleware.ts` (redirect unauthenticated users from `/admin/*` to `/admin/login`)
- [x] T014 Create root layout with font loading (Inter/serif blend), metadata, and global providers in `src/app/layout.tsx`
- [x] T015 [P] Create shared UI primitive components: Button, Input, Select, Modal, Toast, Skeleton in `src/components/ui/` (6 files)
- [x] T016 Create seed script with sample categories (hierarchical), products with variants, and placeholder images in `prisma/seed.ts`
- [x] T017 Create placeholder product image SVG in `public/placeholder.svg`

**Checkpoint**: Foundation ready — database schema defined, auth flow configured, UI primitives available, user story implementation can now begin

---

## Phase 3: User Story 1 — Browse Products by Category (Priority: P1) 🎯 MVP

**Goal**: Visitors can navigate categories via mega-menu, view category pages with filtering/sorting/pagination, and use global search

**Independent Test**: Navigate to homepage → hover nav category → mega-menu opens → click subcategory → category page loads with product grid → apply brand filter and price range → products update → change sort → products reorder → use global search → results appear

### API Layer for User Story 1

- [x] T018 [P] [US1] Implement GET `/api/categories` route handler returning nested category tree in `src/app/api/categories/route.ts`
- [x] T019 [P] [US1] Implement GET `/api/products` route handler with filtering (categoryId, brand, minPrice, maxPrice), sorting (newest, price_asc, price_desc, name_asc, name_desc), pagination, and full-text search in `src/app/api/products/route.ts`
- [x] T020 [P] [US1] Implement GET `/api/search` route handler with PostgreSQL full-text search (tsvector/tsquery) and debounce-friendly response in `src/app/api/search/route.ts`

### Storefront Components for User Story 1

- [x] T021 [P] [US1] Build Navbar component with logo, category links, search bar, and responsive mobile toggle in `src/components/storefront/Navbar.tsx`
- [x] T022 [US1] Build MegaMenu component with multi-column layout showing subcategories and curated collections (isFeatured categories), hover-triggered on desktop in `src/components/storefront/MegaMenu.tsx`
- [x] T023 [P] [US1] Build HeroSection component with product carousel (auto-rotating, manual controls) and featured product showcase in `src/components/storefront/HeroSection.tsx`
- [x] T024 [P] [US1] Build ProductCard component showing product image (with placeholder fallback), brand, name, price, and available color swatches preview in `src/components/storefront/ProductCard.tsx`
- [x] T025 [P] [US1] Build Breadcrumbs component with category hierarchy trail in `src/components/storefront/Breadcrumbs.tsx`
- [x] T026 [P] [US1] Build FilterSidebar component with brand checkboxes, price range inputs, collapsible sections, and mobile overlay mode in `src/components/storefront/FilterSidebar.tsx`
- [x] T027 [P] [US1] Build Pagination component with page numbers, prev/next, and URL param integration in `src/components/storefront/Pagination.tsx`
- [x] T028 [US1] Build ProductGrid component composing ProductCard array with loading skeleton states in `src/components/storefront/ProductGrid.tsx`
- [x] T029 [P] [US1] Build SearchBar component with debounced input (300ms), dropdown results preview, and keyboard navigation in `src/components/storefront/SearchBar.tsx`
- [x] T030 [P] [US1] Build Footer component with site links, brand info, and responsive layout in `src/components/storefront/Footer.tsx`

### Pages for User Story 1

- [x] T031 [US1] Build homepage with HeroSection, featured categories grid, and featured products section in `src/app/(storefront)/page.tsx`
- [x] T032 [US1] Build category page with Breadcrumbs, FilterSidebar, sort dropdown, ProductGrid, and Pagination — reading filters/sort/page from URL search params in `src/app/(storefront)/category/[slug]/page.tsx`
- [x] T033 [US1] Create storefront layout wrapping Navbar and Footer around page content in `src/app/(storefront)/layout.tsx`

**Checkpoint**: User Story 1 complete — visitors can browse the homepage, navigate via mega-menu, filter/sort products on category pages, paginate, and search globally

---

## Phase 4: User Story 2 — View Product Details and Variants (Priority: P1)

**Goal**: Visitors can view full product detail pages with image gallery, variant selection (color/size), and related products

**Independent Test**: Click a product in the grid → product detail page loads → browse image gallery → click different color swatch → images update → select size → availability shown → scroll down → related products visible

### API Layer for User Story 2

- [ ] T034 [US2] Implement GET `/api/products/[slug]` route handler returning full product with variants, images (sorted by displayOrder), category, and up to 4 related products from same category in `src/app/api/products/[slug]/route.ts`

### Storefront Components for User Story 2

- [ ] T035 [P] [US2] Build ImageGallery component with primary image display, thumbnail strip, click-to-enlarge, and smooth transitions in `src/components/storefront/ImageGallery.tsx`
- [ ] T036 [P] [US2] Build VariantSelector component with color swatches (using colorHex), size buttons, availability indicators, and selection state management in `src/components/storefront/VariantSelector.tsx`

### Pages for User Story 2

- [ ] T037 [US2] Build product detail page with ImageGallery, product info (name, brand, price, description), VariantSelector, and related products grid in `src/app/(storefront)/product/[slug]/page.tsx`

**Checkpoint**: User Stories 1 and 2 complete — full browsing experience from homepage to product detail with variant selection

---

## Phase 5: User Story 3 — Admin Manages Products (Priority: P2)

**Goal**: Authenticated admin can create, list, edit, and delete products (with variants) through the admin dashboard

**Independent Test**: Navigate to `/admin/login` → login with email/password → redirected to dashboard → go to Products → see product table → click "Add Product" → fill form (name, description, price, brand, category, variants) → save → product appears in list → edit product → changes saved → delete product → confirmed and removed

### Auth API for User Story 3

- [ ] T038 [P] [US3] Implement POST `/api/auth/login` route handler with Supabase Auth signInWithPassword and session cookie in `src/app/api/auth/login/route.ts`
- [ ] T039 [P] [US3] Implement POST `/api/auth/logout` route handler clearing session cookie in `src/app/api/auth/logout/route.ts`

### Admin Product API for User Story 3

- [ ] T040 [P] [US3] Implement GET `/api/admin/products` route handler with search, category filter, sorting, and pagination for admin table in `src/app/api/admin/products/route.ts`
- [ ] T041 [US3] Implement POST `/api/admin/products` route handler with Zod validation, slug generation, and variant creation in `src/app/api/admin/products/route.ts` (same file as T040)
- [ ] T042 [P] [US3] Implement PUT `/api/admin/products/[id]` route handler with partial update and variant upsert in `src/app/api/admin/products/[id]/route.ts`
- [ ] T043 [US3] Implement DELETE `/api/admin/products/[id]` route handler with cascade deletion (variants, images from storage) in `src/app/api/admin/products/[id]/route.ts` (same file as T042)

### Admin Components for User Story 3

- [ ] T044 [P] [US3] Build AdminSidebar component with navigation links (Dashboard, Products, Categories) and logout button in `src/components/admin/AdminSidebar.tsx`
- [ ] T045 [P] [US3] Build ProductTable component with columns (image thumbnail, name, brand, price, category, variants count), search bar, sort headers, and pagination in `src/components/admin/ProductTable.tsx`
- [ ] T046 [US3] Build ProductForm component with React Hook Form + Zod validation: name, description (textarea), price, brand, category select, dynamic variant rows (color, colorHex, size, SKU, availability toggle) in `src/components/admin/ProductForm.tsx`

### Admin Pages for User Story 3

- [ ] T047 [US3] Build admin login page with email/password form, error handling, and redirect on success in `src/app/admin/login/page.tsx`
- [ ] T048 [US3] Build admin layout with AdminSidebar, header with user info, and content area in `src/app/admin/layout.tsx`
- [ ] T049 [US3] Build admin dashboard overview page with product/category counts in `src/app/admin/page.tsx`
- [ ] T050 [US3] Build admin products list page integrating ProductTable with API calls in `src/app/admin/products/page.tsx`
- [ ] T051 [US3] Build admin create product page with ProductForm and success/error toast notifications in `src/app/admin/products/new/page.tsx`
- [ ] T052 [US3] Build admin edit product page loading existing product data into ProductForm in `src/app/admin/products/[id]/edit/page.tsx`

**Checkpoint**: User Story 3 complete — admin can authenticate, manage products with full CRUD, and all changes reflect on the storefront

---

## Phase 6: User Story 4 — Admin Manages Categories (Priority: P2)

**Goal**: Authenticated admin can create, view (hierarchically), edit, and delete categories

**Independent Test**: Navigate to admin Categories → see category tree → click "Add Category" → enter name, description, select parent → save → category appears in hierarchy → edit category → changes saved → delete category with products → warning shown → confirm → category removed, products become uncategorized

### Admin Category API for User Story 4

- [ ] T053 [P] [US4] Implement POST `/api/admin/categories` route handler with Zod validation, slug generation, and parent assignment in `src/app/api/admin/categories/route.ts`
- [ ] T054 [P] [US4] Implement PUT `/api/admin/categories/[id]` route handler with partial update and cycle detection for parentId in `src/app/api/admin/categories/[id]/route.ts`
- [ ] T055 [US4] Implement DELETE `/api/admin/categories/[id]` route handler with product count warning, SET NULL on products and child categories in `src/app/api/admin/categories/[id]/route.ts` (same file as T054)

### Admin Components for User Story 4

- [ ] T056 [P] [US4] Build CategoryForm component with name, description, parent category select (excluding self and descendants), isFeatured toggle, and displayOrder in `src/components/admin/CategoryForm.tsx`
- [ ] T057 [US4] Build CategoryTree component displaying categories in a hierarchical tree view with expand/collapse, edit and delete actions per node in `src/components/admin/CategoryTree.tsx`

### Admin Pages for User Story 4

- [ ] T058 [US4] Build admin categories page integrating CategoryTree, inline "Add Category" form/modal, edit modal, and delete confirmation dialog in `src/app/admin/categories/page.tsx`

**Checkpoint**: User Story 4 complete — admin can manage full category hierarchy, changes reflect in storefront mega-menu and category pages

---

## Phase 7: User Story 5 — Admin Manages Product Images (Priority: P2)

**Goal**: Admin can upload multiple images per product, reorder them, set primary image, and delete images — all stored in Supabase Storage

**Independent Test**: Edit a product → upload 3 images → images appear in order → drag to reorder → order saved → mark second image as primary → grid thumbnail updates → delete an image → removed from storage and UI

### Admin Image API for User Story 5

- [ ] T059 [P] [US5] Implement POST `/api/admin/products/[id]/images` route handler with multipart file upload, 5 MB limit validation, format check (JPEG/PNG/WebP), Supabase Storage upload, and ProductImage record creation in `src/app/api/admin/products/[id]/images/route.ts`
- [ ] T060 [P] [US5] Implement PUT `/api/admin/products/[id]/images/reorder` route handler updating displayOrder based on ordered imageIds array in `src/app/api/admin/products/[id]/images/reorder/route.ts`
- [ ] T061 [P] [US5] Implement PUT `/api/admin/products/[id]/images/[imageId]/primary` route handler unsetting previous primary and setting new primary in `src/app/api/admin/products/[id]/images/[imageId]/primary/route.ts`
- [ ] T062 [P] [US5] Implement DELETE `/api/admin/products/[id]/images/[imageId]` route handler removing file from Supabase Storage and deleting ProductImage record in `src/app/api/admin/products/[id]/images/[imageId]/route.ts`

### Admin Components for User Story 5

- [ ] T063 [P] [US5] Build ImageUploader component with drag-and-drop zone, file type/size validation, upload progress indicator, and multi-file support in `src/components/admin/ImageUploader.tsx`
- [ ] T064 [US5] Build ImageSortable component with @dnd-kit sortable grid, primary badge, set-primary button, delete button per image in `src/components/admin/ImageSortable.tsx`

### Integration for User Story 5

- [ ] T065 [US5] Integrate ImageUploader and ImageSortable into the product edit page (`src/app/admin/products/[id]/edit/page.tsx`) as an images management section below the product form

**Checkpoint**: User Story 5 complete — admin has full image management with upload, reorder, primary selection, and deletion

---

## Phase 8: User Story 6 — Responsive Browsing Experience (Priority: P3)

**Goal**: The storefront adapts seamlessly across desktop (1200px+), tablet (768px–1199px), and mobile (<768px) viewports

**Independent Test**: Resize browser to mobile width → mega-menu becomes hamburger menu → tap to open → categories accessible → navigate to category page → tap "Filter" button → filter overlay slides in → product grid shows 1–2 columns → navigate to product detail → image gallery and variant selector stack vertically

### Responsive Implementation for User Story 6

- [ ] T066 [P] [US6] Add mobile hamburger menu and slide-out drawer navigation to Navbar (`src/components/storefront/Navbar.tsx`) and MegaMenu (`src/components/storefront/MegaMenu.tsx`)
- [ ] T067 [P] [US6] Add mobile filter overlay mode to FilterSidebar (`src/components/storefront/FilterSidebar.tsx`) with slide-in drawer, "Filter" trigger button visible on mobile, and close/apply buttons
- [ ] T068 [P] [US6] Add responsive grid breakpoints to ProductGrid (`src/components/storefront/ProductGrid.tsx`): 1 col mobile, 2 col tablet, 3–4 col desktop
- [ ] T069 [P] [US6] Add responsive layout to product detail page (`src/app/(storefront)/product/[slug]/page.tsx`): stacked image/info on mobile, side-by-side on desktop
- [ ] T070 [US6] Add responsive layout to homepage (`src/app/(storefront)/page.tsx`): hero carousel adjusts, featured grid reflows, font sizes scale
- [ ] T071 [US6] Verify and fix touch targets (minimum 44px), tap interactions, and scroll behavior across all storefront components

**Checkpoint**: User Story 6 complete — storefront is fully responsive from 320px to 2560px viewport widths

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [ ] T072 [P] Add proper Next.js metadata (title, description, Open Graph) to all page files for SEO
- [ ] T073 [P] Add Next.js `<Image>` component optimization with blur placeholders and responsive srcset to all product image rendering locations
- [ ] T074 [P] Add loading.tsx skeleton files for storefront pages: homepage, category page, product detail page in `src/app/(storefront)/`
- [ ] T075 [P] Add error.tsx error boundary files for storefront and admin routes with user-friendly error messages and retry buttons
- [ ] T076 [P] Add not-found.tsx pages for invalid category slugs and product slugs
- [ ] T077 Configure `next.config.ts` with Supabase Storage image domain in `images.remotePatterns` and any other production settings
- [ ] T078 Write README.md with project overview, setup instructions (referencing quickstart.md), environment variable guide, and development commands
- [ ] T079 Final review: verify all API endpoints return consistent error format, all forms show validation errors, all CRUD operations show toast feedback

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion — BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational — no other story dependencies
- **User Story 2 (Phase 4)**: Depends on Foundational — uses ProductCard from US1 for related products, but can use a simplified version independently
- **User Story 3 (Phase 5)**: Depends on Foundational — no dependency on US1/US2 (admin is separate domain)
- **User Story 4 (Phase 6)**: Depends on Foundational — can run in parallel with US3 (separate pages/APIs)
- **User Story 5 (Phase 7)**: Depends on US3 (needs product edit page to integrate into)
- **User Story 6 (Phase 8)**: Depends on US1 and US2 (needs storefront components to make responsive)
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

```
Phase 1 (Setup) → Phase 2 (Foundational) →┬→ US1 (Browse)  ──→ US2 (Detail) ──→ US6 (Responsive) ──→ Phase 9 (Polish)
                                           ├→ US3 (Admin Products) → US5 (Admin Images) ──────────────→ Phase 9 (Polish)
                                           └→ US4 (Admin Categories) ──────────────────────────────────→ Phase 9 (Polish)
```

### Within Each User Story

- API routes before components that consume them
- Components before pages that compose them
- Core implementation before integration

### Parallel Opportunities

- T003, T004, T005, T006, T007 (all Setup tasks after T001/T002)
- T010, T011, T012 (Supabase clients)
- T018, T019, T020 (US1 API routes)
- T021, T023, T024, T025, T026, T027, T029, T030 (US1 components — different files)
- T038, T039 (auth routes)
- T040, T042 (admin product API routes — different files)
- T044, T045 (admin components — different files)
- T053, T054 (admin category API routes — different files)
- T059, T060, T061, T062 (image API routes — all different files)
- T066, T067, T068, T069 (responsive updates — different files)
- T072, T073, T074, T075, T076 (polish — different files)

---

## Parallel Example: User Story 1

```bash
# Launch all US1 API routes in parallel:
Task T018: "GET /api/categories route handler"
Task T019: "GET /api/products route handler"
Task T020: "GET /api/search route handler"

# Launch independent US1 components in parallel:
Task T021: "Navbar component"
Task T023: "HeroSection component"
Task T024: "ProductCard component"
Task T025: "Breadcrumbs component"
Task T026: "FilterSidebar component"
Task T027: "Pagination component"
Task T029: "SearchBar component"
Task T030: "Footer component"

# Then sequential (depends on components above):
Task T022: "MegaMenu component" (depends on T021 Navbar)
Task T028: "ProductGrid component" (depends on T024 ProductCard)
Task T031: "Homepage" (depends on T023, T028)
Task T032: "Category page" (depends on T025, T026, T027, T028)
Task T033: "Storefront layout" (depends on T021, T030)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL — blocks all stories)
3. Complete Phase 3: User Story 1 (Browse Products by Category)
4. **STOP and VALIDATE**: Visitors can browse homepage, navigate mega-menu, filter/sort/search products
5. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (MVP!)
3. Add User Story 2 → Product detail pages with variants → Deploy/Demo
4. Add User Story 3 → Admin can manage products → Deploy/Demo
5. Add User Story 4 → Admin can manage categories → Deploy/Demo
6. Add User Story 5 → Admin can manage images → Deploy/Demo
7. Add User Story 6 → Fully responsive → Deploy/Demo
8. Polish → Production ready

### Recommended Sequential Execution (Solo Developer)

Phase 1 → Phase 2 → Phase 3 (US1) → Phase 4 (US2) → Phase 5 (US3) → Phase 6 (US4) → Phase 7 (US5) → Phase 8 (US6) → Phase 9

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- No automated tests included — manual testing via acceptance scenarios in spec.md

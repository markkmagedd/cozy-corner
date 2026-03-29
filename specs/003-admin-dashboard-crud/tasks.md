# Tasks: Admin Dashboard CRUD

**Input**: Design documents from `/specs/003-admin-dashboard-crud/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the admin directory structure and shared admin components

- [x] T001 Create admin layout shell with sidebar navigation and top header in `src/app/admin/layout.tsx`
- [x] T002 [P] Build AdminSidebar component with links to Dashboard, Categories, Products, and logout in `src/components/admin/AdminSidebar.tsx`
- [x] T003 [P] Build AdminHeader component displaying current page title and user info in `src/components/admin/AdminHeader.tsx`
- [x] T004 [P] Build reusable DataTable component with server-side pagination, search input, and row actions (edit/delete) in `src/components/admin/DataTable.tsx`
- [x] T005 [P] Build DeleteConfirmDialog component using the existing Modal primitive in `src/components/admin/DeleteConfirmDialog.tsx`
- [x] T006 Extend shared TypeScript interfaces with admin-specific types (ActionResult, PaginatedResponse, TableColumn) in `src/types/index.ts`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Authentication actions and slug utility that ALL user stories depend on

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [x] T007 Implement `loginAction` and `logoutAction` Server Actions using Supabase Auth in `src/lib/actions/auth-actions.ts`
- [x] T008 Build admin login page with email/password form, error display, and redirect-on-success in `src/app/admin/login/page.tsx`
- [x] T009 Build admin dashboard overview page with summary counts (total products, categories, active/inactive) in `src/app/admin/page.tsx`
- [x] T010 Add `generateSlug` utility function to `src/lib/utils.ts` that converts names to URL-safe slugs

**Checkpoint**: Foundation ready — admin can log in, see the dashboard, and user story implementation can begin

---

## Phase 3: User Story 1 — Secure Admin Access (Priority: P1) 🎯 MVP

**Goal**: Admin can log in, access protected routes, and be redirected when unauthenticated.

**Independent Test**: Visit `/admin/categories` while logged out → redirected to `/admin/login`. Log in → access granted. Log out → redirected back.

> Note: The core login page was created in Phase 2 (T008). This phase validates the end-to-end flow is working and the middleware correctly gates all routes.

### Implementation for User Story 1

- [x] T011 [US1] Verify middleware at `src/lib/supabase/middleware.ts` correctly redirects unauthenticated users from all `/admin/*` routes (except `/admin/login`) and redirects authenticated users away from `/admin/login`
- [x] T012 [US1] Add logout button functionality to AdminSidebar that calls `logoutAction` and redirects to `/admin/login` in `src/components/admin/AdminSidebar.tsx`

**Checkpoint**: User Story 1 complete — unauthenticated users are blocked, authenticated users can log in and navigate the admin shell

---

## Phase 4: User Story 2 — Category Management CRUD (Priority: P2)

**Goal**: Admin can create, view, edit, and delete categories with hierarchical parent-child relationships.

**Independent Test**: Create a parent category → create a child category under it → edit the child → attempt to delete a category with products (blocked) → delete an empty category (succeeds).

### Implementation for User Story 2

- [x] T013 [US2] Implement `createCategory`, `updateCategory`, and `deleteCategory` Server Actions with Zod validation, auto-slug generation, and product-count deletion guard in `src/lib/actions/category-actions.ts`
- [x] T014 [US2] Build CategoryForm component (reusable for create/edit) with fields for name, description, parent category dropdown, isFeatured toggle, and displayOrder using react-hook-form + zod in `src/components/admin/CategoryForm.tsx`
- [x] T015 [US2] Build category list page with DataTable showing name, parent, product count, featured status, and edit/delete actions in `src/app/admin/categories/page.tsx`
- [x] T016 [US2] Build create category page wrapping CategoryForm and calling `createCategory` action in `src/app/admin/categories/new/page.tsx`
- [x] T017 [US2] Build edit category page loading existing data and wrapping CategoryForm with `updateCategory` action in `src/app/admin/categories/[id]/edit/page.tsx`
- [x] T018 [US2] Wire delete category action into category list page with DeleteConfirmDialog, displaying product-count error via Toast when deletion is blocked in `src/app/admin/categories/page.tsx`

**Checkpoint**: User Story 2 complete — admin can fully manage categories with hierarchy support and deletion safety

---

## Phase 5: User Story 3 — Product Management & Variants (Priority: P3)

**Goal**: Admin can manage products with variants (size/color) and images (upload, reorder, set primary).

**Independent Test**: Create a product with 2 variants → upload 3 images → set primary image → reorder images via drag-and-drop → deactivate product → verify it disappears from storefront → reactivate → verify it reappears.

### Server Actions for User Story 3

- [x] T019 [P] [US3] Implement `createProduct`, `updateProduct`, `deleteProduct`, and `toggleProductActive` Server Actions with Zod validation, auto-slug, and nested variant create/update/delete in `src/lib/actions/product-actions.ts`
- [x] T020 [P] [US3] Implement `getImageUploadUrl`, `createImageRecord`, `deleteImage`, `reorderImages`, and `setPrimaryImage` Server Actions with 5 MB size validation and Supabase Storage integration in `src/lib/actions/image-actions.ts`

### Components for User Story 3

- [x] T021 [US3] Build VariantManager component for inline add/edit/remove of product variants (color, colorHex, size, SKU, availability) as a dynamic form section in `src/components/admin/VariantManager.tsx`
- [x] T022 [US3] Build ImageUploader component with file input (5 MB limit), drag-and-drop reorder via @dnd-kit, primary image selection star toggle, and delete button per image in `src/components/admin/ImageUploader.tsx`
- [x] T023 [US3] Build ProductForm component (reusable for create/edit) with fields for name, description, price, brand, category dropdown, isActive toggle, and embedded VariantManager and ImageUploader sections using react-hook-form + zod in `src/components/admin/ProductForm.tsx`

### Pages for User Story 3

- [x] T024 [US3] Build product list page with DataTable showing name, brand, price, category, active status badge, and edit/delete actions in `src/app/admin/products/page.tsx`
- [x] T025 [US3] Build create product page wrapping ProductForm and calling `createProduct` action in `src/app/admin/products/new/page.tsx`
- [x] T026 [US3] Build edit product page loading existing product with variants and images, wrapping ProductForm with `updateProduct` action in `src/app/admin/products/[id]/edit/page.tsx`
- [x] T027 [US3] Wire delete product action into product list page with DeleteConfirmDialog and Supabase Storage cleanup in `src/app/admin/products/page.tsx`
- [x] T028 [US3] Wire toggleProductActive action into product list with inline active/inactive toggle button in `src/app/admin/products/page.tsx`

**Checkpoint**: All user stories complete — admin can manage categories, products, variants, and images through the full CRUD lifecycle

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories

- [x] T029 [P] Add loading states (Skeleton components) to all admin list pages in `src/app/admin/categories/page.tsx` and `src/app/admin/products/page.tsx`
- [x] T030 [P] Add Toast notifications for all successful CRUD operations (create, update, delete) across admin pages
- [x] T031 Run `npm run build` to validate TypeScript compilation and fix any type errors
- [x] T032 Run quickstart.md validation flow: login → create category → create subcategory → create product → add variants → upload images → test deletion guards → verify storefront

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies — can start immediately
- **Foundational (Phase 2)**: Depends on Phase 1 (layout must exist for login page)
- **User Story 1 (Phase 3)**: Depends on Phase 2 (login must work)
- **User Story 2 (Phase 4)**: Depends on Phase 2 (admin shell must exist) — independent of US1
- **User Story 3 (Phase 5)**: Depends on Phase 2 (admin shell must exist) — uses categories from US2 for dropdown but can work without
- **Polish (Phase 6)**: Depends on all user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Phase 2 — no dependencies on other stories
- **User Story 2 (P2)**: Can start after Phase 2 — no dependencies on other stories
- **User Story 3 (P3)**: Can start after Phase 2 — integrates with US2's categories for the category dropdown, but can use a null categoryId as fallback

### Within Each User Story

- Server Actions before components
- Components before pages
- Core pages before wiring (delete, toggle)

### Parallel Opportunities

- T002, T003, T004, T005 can all run in parallel (different component files)
- T019, T020 can run in parallel (different action files)
- Once Phase 2 is complete, US1, US2, and US3 can proceed in parallel
- T029, T030 can run in parallel (different concerns)

---

## Parallel Example: User Story 3

```bash
# Launch server actions in parallel (different files):
Task T019: "Product actions in src/lib/actions/product-actions.ts"
Task T020: "Image actions in src/lib/actions/image-actions.ts"

# Then components sequentially (VariantManager → ImageUploader → ProductForm):
Task T021: "VariantManager in src/components/admin/VariantManager.tsx"
Task T022: "ImageUploader in src/components/admin/ImageUploader.tsx"
Task T023: "ProductForm in src/components/admin/ProductForm.tsx" (depends on T021, T022)

# Then pages:
Task T024: "Product list page"
Task T025: "Create product page" (depends on T023)
Task T026: "Edit product page" (depends on T023)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup (admin layout + shared components)
2. Complete Phase 2: Foundational (login + dashboard overview)
3. Complete Phase 3: User Story 1 (verify auth flow)
4. **STOP and VALIDATE**: Admin can log in and navigate

### Incremental Delivery

1. Complete Setup + Foundational → Admin shell ready
2. Add User Story 1 → Auth flow working (MVP!)
3. Add User Story 2 → Category CRUD live → Test independently
4. Add User Story 3 → Product CRUD with variants + images → Test independently
5. Polish → Loading states, toasts, full validation

---

## Notes

- [P] tasks = different files, no dependencies
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Existing infrastructure reused: Prisma schema, Supabase Auth middleware, UI primitives (Button, Input, Select, Modal, Toast, Skeleton)

# Research: Admin Dashboard CRUD

**Feature**: 003-admin-dashboard-crud  
**Date**: 2026-03-29

## R1: Admin Authentication Pattern

**Decision**: Use Supabase Auth email/password sign-in via Server Actions.

**Rationale**: The middleware at `src/lib/supabase/middleware.ts` already redirects unauthenticated users from `/admin/*` to `/admin/login`. The login page calls `supabase.auth.signInWithPassword()` via a Server Action, which sets the session cookie. No additional auth infrastructure is needed.

**Alternatives considered**:
- Custom JWT-based auth: Rejected — adds unnecessary complexity when Supabase Auth already handles sessions, cookies, and refresh tokens.
- NextAuth.js: Rejected — would introduce a new dependency when Supabase Auth is already integrated.

## R2: Server Actions vs API Routes for Mutations

**Decision**: Use Next.js Server Actions for all admin CRUD mutations.

**Rationale**: Server Actions provide type-safe, colocated mutation logic without needing to create separate API route files. They integrate naturally with `react-hook-form` and `zod` validation, support `revalidatePath()` for cache invalidation, and reduce boilerplate compared to manual `fetch()` calls to API routes.

**Alternatives considered**:
- API routes (`/api/admin/*`): Rejected — would duplicate patterns already covered by Server Actions and add unnecessary routing surface area.
- tRPC: Rejected — overengineered for this admin-only use case.

## R3: Image Upload to Supabase Storage

**Decision**: Upload images directly from the client to Supabase Storage via a presigned URL obtained through a Server Action, then store the public URL and storage path in the `ProductImage` Prisma model.

**Rationale**: Client-side upload avoids the 4.5 MB Next.js Server Action body limit. The Server Action validates the file metadata (size ≤ 5 MB, type is image/*), generates a storage path, and returns a presigned upload URL. After the client uploads, a second Server Action call persists the image record in the database.

**Alternatives considered**:
- Server-side upload through Server Action body: Rejected — Next.js has a default body size limit that would conflict with the 5 MB image requirement.
- Direct client upload without server validation: Rejected — bypasses size and type checks.

## R4: Image Reordering with drag-and-drop

**Decision**: Use `@dnd-kit/core` and `@dnd-kit/sortable` (already installed) for drag-and-drop image reordering. Persist the new `displayOrder` values via a Server Action on drop.

**Rationale**: dnd-kit is already a project dependency. It provides accessible, performant drag-and-drop with minimal setup. The sortable preset handles the common reorder-list pattern with built-in keyboard support.

**Alternatives considered**:
- react-beautiful-dnd: Rejected — deprecated and not compatible with React 19.
- Manual sortable with CSS: Rejected — poor accessibility and complex implementation.

## R5: Category Deletion Safety

**Decision**: Before deleting a category, query `Product.count({ where: { categoryId } })`. If count > 0, return an error with the count. The UI displays this in a toast notification.

**Rationale**: This is the simplest implementation of FR-004. The count query is lightweight and provides the exact information specified in the clarification.

**Alternatives considered**:
- Soft-delete categories: Rejected by spec — spec says empty categories support hard deletes.
- Cascade delete products too: Rejected — spec explicitly blocks deletion when products exist.

## R6: Data Table Component

**Decision**: Build a lightweight custom `DataTable` component using server-side pagination and search via URL search params.

**Rationale**: Admin lists for categories and products share the same pattern: paginated table with search, column sorting, and row actions (edit/delete). A reusable component avoids duplication. Server-side pagination keeps queries fast even at 5,000+ rows.

**Alternatives considered**:
- TanStack Table: Considered but rejected — adds a heavy dependency for a simple admin table. A custom solution with server-side data fetching is simpler and more performant.
- Client-side pagination: Rejected — does not scale to 5,000 items per SC-002.

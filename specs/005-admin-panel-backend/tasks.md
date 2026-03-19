# Task Breakdown: Admin Panel Backend (Prisma Refactor)

**Feature**: Admin Panel Backend | **Implementation Phase**: Executor | **Created**: 2026-03-19

---

## Phase 1: Setup & Prisma Initialization
**Purpose**: Prepare the project for Prisma ORM with Supabase context.

- [X] T001 Initialize Prisma in the project (`npx prisma init`)
- [X] T002 Configure `.env.local` with `DATABASE_URL` (Connection Pooling) and `DIRECT_URL` (Direct Connection)
- [X] T003 Define schema in `prisma/schema.prisma` matching `prisma-schema.md`
- [X] T004 Create Prisma client singleton in `src/lib/prisma.ts`
- [X] T005 Run initial introspection or push (`npx prisma generate` completed)

**Checkpoint**: Prisma is connected and can read/write to the Supabase PostgreSQL database.

---

## Phase 2: Refactor Server Actions to Prisma
**Purpose**: Replace raw Supabase `supabase-js` database calls with Prisma for better type safety and DX.

- [X] T006 [P] Refactor `ProductCRUD` actions in `src/lib/actions/product-actions.ts` to use `prisma.product.*`
- [X] T007 [P] Refactor `CategoryCRUD` actions in `src/lib/actions/category-actions.ts` to use `prisma.category.*`
- [X] T008 Update `src/types/database.ts` to use Prisma-generated types if appropriate (Prisma generated its own, so we'll phase out the old manual ones)

---

## Phase 3: Middleware & Auth Refinement
**Purpose**: Ensure Auth continues to work alongside Prisma (Auth remains via Supabase Auth).

- [X] T009 Verify `src/middleware.ts` still correctly guards routes with Supabase SSR
- [X] T010 Test end-to-end flow: Login -> Dashboard -> CRUD with Prisma -> Storefront View.

**Checkpoint**: Full integration - UI is powered by Prisma, Auth by Supabase.

---

## Phase 4: Final Cleanup
**Purpose**: Remove redundant files and ensure documentation is current.

- [X] T011 Remove old `specs/005-admin-panel-backend/database-schema.sql`
- [X] T012 Update `quickstart.md` with Prisma instructions
- [X] T013 Final UI/UX audit.

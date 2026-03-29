# Research: Cozy Corner E-Commerce Platform

**Branch**: `002-cozy-corner-ecommerce` | **Date**: 2026-03-28

## 1. Framework & Rendering Strategy

**Decision**: Next.js 15 with App Router and TypeScript  
**Rationale**: App Router provides server components by default (reducing client-side JS bundle), nested layouts for shared navigation/footer, and built-in route groups for separating storefront from admin. TypeScript enforced for type safety across the full stack.  
**Alternatives considered**:
- Pages Router: Legacy pattern, less ergonomic for layouts and data fetching
- Remix: Excellent but smaller ecosystem; Next.js has broader community support and Vercel deployment
- Vite + React: No SSR/SSG out of the box; would require manual setup for SEO

## 2. Styling Approach

**Decision**: Tailwind CSS v4 with custom design tokens  
**Rationale**: Utility-first approach enables rapid UI development with consistent spacing, color, and typography. Tailwind v4 uses CSS-first configuration. The user's original requirements explicitly mention Tailwind as an option and the reference designs require precise visual control.  
**Alternatives considered**:
- Vanilla CSS: Maximum flexibility but slower iteration for a large component surface
- CSS Modules: Good scoping but verbose for utility patterns
- Styled Components: Runtime overhead, less alignment with server components

## 3. Database & ORM

**Decision**: Prisma ORM with Supabase PostgreSQL  
**Rationale**: User explicitly specified Prisma + Supabase. Prisma provides type-safe database access, auto-generated client, and migration management. Supabase provides managed PostgreSQL with connection pooling (via Supavisor), Row Level Security, and built-in auth.  
**Alternatives considered**:
- Drizzle ORM: Lighter weight but less mature migration tooling
- Direct Supabase JS client: Would bypass type-safe schema management
- MongoDB: User mentioned "NoSQL" but specified Supabase PostgreSQL — using PostgreSQL with JSON columns where flexibility is needed

## 4. Image Storage

**Decision**: Supabase Storage with public buckets and CDN  
**Rationale**: User explicitly specified Supabase Storage. Provides S3-compatible object storage with automatic CDN delivery, image transformations (resize, format conversion), and RLS policies. Integrates seamlessly with Supabase Auth.  
**Alternatives considered**:
- Cloudinary: Better image transformation pipeline but adds external dependency
- AWS S3 + CloudFront: More complex setup, separate billing
- Local filesystem: Not suitable for production deployment

## 5. Authentication

**Decision**: Supabase Auth with email/password, integrated via `@supabase/ssr` for Next.js  
**Rationale**: User explicitly specified Supabase Auth. The `@supabase/ssr` package handles cookie-based session management for server components and middleware. Single admin role means no complex RBAC needed — just an authenticated/unauthenticated check.  
**Alternatives considered**:
- NextAuth.js: Additional abstraction layer over Supabase Auth; unnecessary complexity
- Custom JWT: Reinventing the wheel when Supabase provides it out of the box
- Clerk: External service, adds cost and dependency

## 6. API Architecture

**Decision**: Next.js Route Handlers (REST) in `app/api/` directory  
**Rationale**: Collocated with the application, type-safe with TypeScript, server-side by default. REST is simpler than GraphQL for this catalog-browsing use case with predictable data shapes. Route handlers support all HTTP methods and middleware patterns.  
**Alternatives considered**:
- GraphQL (Apollo/Relay): Over-engineered for a primarily read-only storefront
- tRPC: Great for type safety but adds complexity; REST is sufficient for CRUD operations
- Standalone API server: Unnecessary when Next.js provides built-in API routes

## 7. Search Implementation

**Decision**: PostgreSQL full-text search via Prisma raw queries using `ts_vector` and `ts_query`  
**Rationale**: Avoids external search service dependency. PostgreSQL's built-in full-text search with GIN indexes handles the expected <10K product catalog efficiently. Can be upgraded to a dedicated search engine later if needed.  
**Alternatives considered**:
- Algolia: Excellent search UX but external dependency and cost
- Elasticsearch: Over-engineered for current scale
- Client-side fuzzy search (Fuse.js): Doesn't scale, requires loading all products

## 8. Image Optimization

**Decision**: Next.js `<Image>` component + Supabase Storage transforms  
**Rationale**: Next.js Image component provides automatic lazy loading, responsive srcset, blur placeholder generation, and format optimization (WebP/AVIF). Combined with Supabase Storage's image transformation API for server-side resizing. This addresses FR-018 (lazy loading, responsive sizing, CDN delivery) and SC-010 (progressive loading, no layout shift).  
**Alternatives considered**:
- Manual `<img>` tags with intersection observer: More work, fewer features
- Sharp (server-side): Would need manual pipeline setup

## 9. State Management

**Decision**: React Server Components + URL search params for filter/sort state, minimal client state with React `useState`/`useReducer`  
**Rationale**: Most pages are server-rendered (product listing, detail). Filter/sort state lives in URL params (shareable, bookmarkable). Only interactive UI elements (mega-menu open/close, mobile drawer, image gallery) need client state. No global state management library needed.  
**Alternatives considered**:
- Zustand/Jotai: Unnecessary overhead for primarily server-rendered content
- Redux: Way over-engineered for this use case
- React Context: Only if cross-component client state becomes needed

## 10. Admin Dashboard UI Components

**Decision**: Custom components with Tailwind CSS, leveraging shadcn/ui patterns where beneficial  
**Rationale**: Admin dashboard needs tables, forms, modals, dropdowns, and toast notifications. Building with Tailwind keeps styling consistent with the storefront. shadcn/ui provides copy-paste component patterns (not a dependency) that can be adapted for the admin's needs.  
**Alternatives considered**:
- Material UI: Heavy bundle, style mismatch with custom storefront design
- Ant Design: Enterprise-focused but heavy, different aesthetic
- Headless UI: Good accessibility but still needs full styling

## 11. Drag-and-Drop for Image Reordering

**Decision**: `@dnd-kit/core` + `@dnd-kit/sortable`  
**Rationale**: Lightweight, accessible, framework-agnostic drag-and-drop library. Well-maintained, supports touch devices, and integrates cleanly with React. Needed for Admin Story 5 (image reordering).  
**Alternatives considered**:
- react-beautiful-dnd: Deprecated/unmaintained
- HTML5 drag-and-drop API: Poor touch support, inconsistent browser behavior
- react-dnd: More complex API than dnd-kit

## 12. Form Handling & Validation

**Decision**: React Hook Form + Zod for schema validation  
**Rationale**: React Hook Form provides performant form state management with minimal re-renders. Zod schemas can be shared between client validation and API route validation, ensuring consistency. TypeScript integration is excellent.  
**Alternatives considered**:
- Formik: More re-renders, heavier bundle
- Native form validation: Insufficient for complex admin forms
- Yup: Less TypeScript-native than Zod

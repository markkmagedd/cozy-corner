# Phase 0 Research: Supabase Admin Backend

## Decision: Supabase SSR & App Router Integration
Next.js 15 with Supabase requires specific middleware and server-client utility separation to handle auth sessions correctly (cookies).
- **Rationale**: Server Actions and Server Components need a shared session state to ensure `admin-only` paths are not accessible by public users.
- **Alternatives Considered**: Direct Web Client (not secure for Server actions/private keys), Next-Auth (more complex to integrate with existing Supabase features).

## Decision: Automated Slug Generation (Server Actions)
Slugs will be generated within the Next.js Server Action BEFORE inserting into the database.
- **Rationale**: Easier to handle duplicate numbering (e.g., `-2`) within the Node/TS environment using a quick `SELECT` check than complex PL/pgSQL scripts for a simple MVP. It allows for richer name-normalization (removing emojis, special characters).
- **Alternatives Considered**: PostgreSQL Triggers (harder to maintain for small projects).

## Decision: Image Upload Strategy (Direct signed upload)
Images will be uploaded to Supabase Storage using the standard SDK.
- **Rationale**: Supports progress tracking on the client and avoids large multipart/form-data payloads hitting Next.js server limits for small-memory hosting envs.
- **Alternatives Considered**: Uploading via Server Actions (limited by body size, slower).

## Decision: RLS Policies for Catalog
We will implement two core RLS policies:
1. `SELECT`: Allow everyone to read `products` and `categories` where they are marked as `published` (or just all in this MVP).
2. `INSERT`, `UPDATE`, `DELETE`: Allowed ONLY for authenticated users where `auth.uid()` corresponds to an admin role or simply where authenticated for MVP.
- **Rationale**: Enforces security at the database layer even if the UI is compromised.
- **Alternatives Considered**: Application-layer security only (vulnerable to direct DB access).

## Decision: Auth Flow
Admin-only login using email/password via Supabase GoTrue.
- **Rationale**: Built-in, zero-config, and matches the User scenarios from the spec.
- **Alternatives Considered**: SSO/Google OAuth (Overkill for a personal store catalog admin).

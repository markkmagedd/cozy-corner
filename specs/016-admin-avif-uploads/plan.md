# Implementation Plan: Admin AVIF Uploads

**Branch**: `016-admin-avif-uploads` | **Date**: 2026-04-17 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/016-admin-avif-uploads/spec.md`

## Summary

This feature adds support for uploading, storing, and correctly displaying `.avif` images across the platform, strictly maintaining support for existing formats. The technical approach leverages raw file storage alongside configuration of Next.js native `next/image` to optimize and explicitly serve AVIF encoded formats. 

## Technical Context

**Language/Version**: TypeScript  
**Primary Dependencies**: Next.js (App Router), React 19, Tailwind CSS 4, Prisma  
**Storage**: PostgreSQL (Prisma ORM), Local/Cloud image storage  
**Testing**: Jest / Playwright  
**Target Platform**: Web (Desktop & Mobile browsers)  
**Project Type**: Web application  
**Performance Goals**: Maximize storefront image loading performance  
**Constraints**: Avoid complex custom image manipulation on upload  
**Scale/Scope**: Admin interface uploads, storefront page views  

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

No complex integrations or 3rd-party services required; extending standard MIME type acceptance aligns heavily with existing architecture. No violations.

## Project Structure

### Documentation (this feature)

```text
specs/016-admin-avif-uploads/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── admin/
│   └── api/
│       └── upload/
├── components/
│   ├── admin/
│   └── storefront/
```

**Structure Decision**: Standard Next.js App Router structure. Changes localized to `next.config.ts`, upload API routes, and the admin upload components.

## Complexity Tracking

No violations found, keeping standard stack architecture.

<!--
Sync Impact Report:
- Version change: 0.0.0 → 1.0.0
- Modified principles:
  - PRINCIPLE_1_NAME → Component-First Architecture
  - PRINCIPLE_2_NAME → Responsive Design
  - PRINCIPLE_3_NAME → Static Typing
  - PRINCIPLE_4_NAME → Declarative State & Effects
  - PRINCIPLE_5_NAME → Premium Aesthetics
- Added sections: Technical Stack Standards, Component Structure
- Removed sections: None
- Templates requiring updates: ✅ None explicit
- Follow-up TODOs: None
-->
# Cozy Corner Constitution

## Core Principles

### Component-First Architecture
UI must be built iteratively using reusable, encapsulated, and atomic React components. Components should be strictly limited to their own responsibility.

### Responsive Design
All pages must be fully responsive, prioritizing mobile-friendly interfaces utilizing TailwindCSS.

### Static Typing
Strict TypeScript usage is enforced for robust and self-documenting code. No `any` types unless explicitly justified.

### Declarative State & Effects
State should be managed properly using Next.js 15+ paradigms (App Router), avoiding deep prop drilling and side-effect spaghetti. Prefer Server Components where possible; use Client Components (`"use client"`) only when interactivity or client state is required.

### Premium Aesthetics
Focus on beautiful UX/UI incorporating modern design paradigms, animations (Framer Motion), and accessible contrast (Lucide React icons). 

## Technical Stack Standards

Framework: Next.js 15.x App Router. Language: TypeScript 5+. Styling: TailwindCSS 4, `clsx`, `tailwind-merge`. Animations: Framer Motion. Icons: Lucide React.

## Component Structure

Components should reside within appropriate domains or generic `src/components` directory. Keep components compact and composed. Business logic should be abstracted into hooks or utility functions where appropriate.

## Governance

All code additions MUST be rigorously type-checked and adhere to Next.js App Router patterns. Ensure responsive capabilities are thoroughly verified before any commits. Pull requests require approval and passing CI pipelines. 

**Version**: 1.0.0 | **Ratified**: 2026-03-19 | **Last Amended**: 2026-03-19

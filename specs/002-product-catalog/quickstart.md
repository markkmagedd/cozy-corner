# Quickstart: 002-product-catalog

## Project Setup

This is a Next.js (App Router) project built with Tailwind CSS and Framer Motion.

### 1. Install Dependencies
Ensure you have Node.js (v18+) installed.

```bash
npm install
npm install framer-motion lucide-react clsx tailwind-merge
```
*(lucide-react for standard icons, clsx/tailwind-merge for utility class management if needed).*

### 2. Start the Development Server

```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

## Running the Mock Catalog

No backend or database setup is required. The mock inventory is injected automatically through `src/data/mock-products.ts`. 

## Best Practices During Development

- **Mobile Emulation**: Because this is heavily "mobile-first", rely heavily on Chrome DevTools' device toolbar (e.g., emulate iPhone 13/14 Pro).
- **Animations**: Watch out for strict mode double-invocations in React 18+ playing tricks with Framer Motion entry animations on initial dev load.
- **Routing**: `src/app/page.tsx` is the primary listing, and `src/app/product/[slug]/page.tsx` handles the detail pages. 

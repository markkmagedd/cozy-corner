# Quickstart: Navbar Redesign

## Setup

1. **Prerequisites**: Ensure you are on the `010-navbar-redesign` branch.
2. **Install Dependencies**: `npm install` (to ensure any new UI dependencies like `framer-motion` are present).
3. **Database**: No migrations needed. Ensure Prisma client is generated (`npx prisma generate`).

## Running Local Environment

1. **Start Dev Server**: `npm run dev`
2. **View Changes**: Open `http://localhost:3000` in your browser.
3. **Test Responsiveness**: Use browser inspect tools to toggle between Desktop and Mobile viewports.

## Core Files

- `src/components/storefront/Navbar.tsx`: All primary navigation logic.
- `src/components/storefront/MegaMenu.tsx`: Sub-category and curated link layouts.
- `src/app/globals.css`: Tailwind 4 CSS variables and glassmorphism definitions.

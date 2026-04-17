# Quickstart: Subcategory Navigation Development

## Setup

1. **Database & Seeding**: Ensure your local PostgreSQL connection strings in `.env` are accurate and Prisma client is generated (`npm run postinstall`).
2. **Local Environment**: `npm run dev` starts the application on `http://localhost:3000`.

## Testing the Changes

Once components are injected:
1. Navigate to your storefront. 
2. Enter any major category.
3. Click a subcategory to load the subcategory's page route.
4. Verify the top section includes the sibling navigation menu rendered. 
5. Emulate mobile devices via your browser DevTools to ensure horizontal scroll is active instead of vertical stacking or cut-offs.

## Implementation Guardrails

- Do not create a separate client-side fetching hook for this navigation. You must use server-side querying in `page.tsx` and pass it to a Client or Server component appropriately.
- Only load children of the same `categoryId`.
- Test on a parent category that only contains 1 child. Ensure the navigation fully hides without Layout gaps.

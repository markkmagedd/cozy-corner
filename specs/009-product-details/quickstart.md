# Quickstart: Product Details Page

Once implemented, the feature can be tested via the standard React development environment.

## Steps for validation

1. Ensure the PostgreSQL database is running and securely seeded (`npm run postinstall` / `npx prisma db seed`).
2. Start the local server: 
   ```bash
   npm run dev
   ```
3. Navigate to a known product string in your browser:
   ```text
   http://localhost:3000/products/[valid-product-slug]
   ```
4. **Validations:**
   - Verify the product loads its initial details and main image seamlessly.
   - Click thumbnails to verify the image gallery switches the primary image cleanly.
   - Validate that variant selections correctly map to URLs and update state.
   - Use an automated tool or browser extension to verify that basic SEO tags (Title, Description) are present in the `<head>`.

# Data Model: Product Details Page

The feature will exclusively utilize the **existing** Prisma schema. No new database migrations are required, as the existing models perfectly align with the specification requirements.

## Core Entities Used (Read-Only)

- **`Product`**: Searched and fetched by its unique `slug`. Includes core metadata: `name`, `price`, `description`, `brand`.
- **`ProductImage`**: Loaded through a relation, sorted by `displayOrder`. The image where `isPrimary` is true will drive the initial hero photo.
- **`ProductVariant`**: Variations retrieved to construct the variant selector UI matrix (leveraging the explicit `color` and `size` fields). Records include variant-specific `sku` and `isAvailable` (which will be used to correctly trigger "Out of Stock" UI states per the edge case specifications).

See `prisma/schema.prisma` for the exact schema definitions and existing indexing.

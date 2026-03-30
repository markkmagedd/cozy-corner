# Data Model: All Categories Page

The feature relies exclusively on existing Prisma entities, but changes how they are queried and aggregated for presentation.

## Existing Entities Leveraged

### `Category`

The core grouping mechanism for products.

| Field        | Type     | Description                                | Focus in Feature |
|--------------|----------|--------------------------------------------|------------------|
| id           | String   | Unique identifier                          | Routing          |
| name         | String   | Display name                               | UI Display       |
| slug         | String   | Url-friendly identifier                    | URL construction |
| description  | String?  | Textual description                        | UI Display       |
| parentId     | String?  | Self-referential hierarchy link            | Filtering (null) |
| displayOrder | Int      | Ordering for UI grids                      | Sorting          |

**Query Pattern**: `where: { parentId: null }` (Only Top-Level categories, filtered by optional active scope).

### `Product` & `ProductImage`

Used purely to fetch a dynamic visual thumbnail representing the category.

| Field          | Type     | Description                                | Focus in Feature |
|----------------|----------|--------------------------------------------|------------------|
| categoryId     | String   | Link back to Category                      | Joining          |
| isActive       | Boolean  | Product availability                       | Filtering        |
| ProductImage   | Relation | Nested table of visual assets for product  | Filtering (take 1)|
| isPrimary      | Boolean  | The main product thumbnail                 | Filtering        |

**Query Pattern**: Nested inclusion under `Category` to fetch exactly one active product, and exactly one primary image (`take: 1`).

```json
// Representational Data Shape passed to Component
[
  {
    "id": "cmnbxsk7d0002p5...",
    "name": "Clothing",
    "slug": "clothing",
    "description": "Outerwear, shirts, and pants.",
    "thumbnailUrl": "/uploads/product-image-xyz.jpg" // Derived from first active product
  }
]
```

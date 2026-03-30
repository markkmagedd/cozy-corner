# Data Model: Homepage Redesign

No new entities or schema changes are required for this feature.

## Existing Entities Used

### Category (existing — no changes)

The `Category` model already supports all fields needed for the Featured Categories section:

| Field        | Type     | Usage in this feature                          |
|--------------|----------|------------------------------------------------|
| id           | String   | Primary key                                    |
| name         | String   | Displayed as category label in the grid        |
| slug         | String   | Used to construct `/category/{slug}` links     |
| description  | String?  | Optional — may be shown as subtitle            |
| isFeatured   | Boolean  | Filter criteria: only `true` categories shown  |
| displayOrder | Int      | Sort order for the featured grid               |

**Query**: `prisma.category.findMany({ where: { isFeatured: true }, orderBy: { displayOrder: 'asc' } })`

### Product (existing — no changes)

Products continue to be fetched the same way for the New Arrivals grid. The only layout change is removing the FilterSidebar wrapper — the data query itself is unchanged.

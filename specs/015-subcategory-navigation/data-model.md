# Data Model: Subcategory Navigation

## Entities

The application already tracks categories and subcategories in a hierarchical layout via the Prisma schema.

### `Category`

Represents a top-level navigational bucket.

- **Attributes**: `id`, `name`, `slug`, `imageUrl`
- **Relationships**: Has many `Subcategory` relations.

### `Subcategory`

Represents the scoped listing.

- **Attributes**: `id`, `name`, `categoryId` (foreign key to `Category`), `slug`
- **Relationships**: Belongs to one `Category`.

## Expected Query / State

To fetch a subcategory's siblings, the backend leverages the `categoryId` column:

```typescript
// Look up subcategories matching the current categoryId, excluding the active one.
const siblings = await prisma.subcategory.findMany({
    where: {
        categoryId: currentSubcategory.categoryId,
        id: {
            not: currentSubcategory.id,
        }
    },
    orderBy: {
        name: 'asc'
    }
});
```

This ensures isolation at the category level and robust scalability for large sets. No external schemas or schema modifications are necessary.

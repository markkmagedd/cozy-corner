# Data Model: Products Page Layout

## Entities

### `Category`
Represents a product category or subcategory.
- `id` (string): Unique identifier.
- `name` (string): Display name of the category.
- `parentCategoryId` (string, optional): ID of the parent category if this is a subcategory. Null/undefined if it's a top-level category.
- `slug` (string): URL-friendly string for routing.

### `Product`
Represents an individual item in the catalog.
- `id` (string): Unique identifier.
- `title` (string): Full product name.
- `image` (string): URL to the primary product image.
- `currentPrice` (number): Active price of the product (e.g., in EGP).
- `originalPrice` (number, optional): The non-discounted price, shown with a strikethrough if present.
- `badges` (array of strings): Tags like "offer", "new", etc.
- `categoryIds` (array of strings): References to Category IDs this product belongs to.
- `isFavorite` (boolean): Ephemeral user state or persisted state indicating if the user has favorited this product. (Often managed via local storage or separate user profile relation).

## Relationships
- A `Product` belongs to one or more `Category` entities (Many-to-Many or Many-to-One depending on structure, conceptually modeled as an array of `categoryIds`).
- A `Category` can have multiple subcategories (Self-referencing One-to-Many).

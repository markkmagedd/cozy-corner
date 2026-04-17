# Data Model: Admin AVIF Uploads

## Schema Modifications

No Prisma schema changes are required for this feature.
- **Categories**: Image references are stored as `String` containing the URL paths.
- **Products**: Image gallery paths are also stored as an array of `String` or localized JSON. 

## Entity Validation

Validation logic in data transfer objects and backend constraints must be updated.

### Image Upload Entity
- **Allowed MIME types**: Expanded to dynamically include `image/avif`.
- **Allowed formats**: Expanded to include `.avif`.
- **Validation**:
  - Maximum file size remains unchanged.
  - Image properties detection must not break on valid `.avif` byte sizes.

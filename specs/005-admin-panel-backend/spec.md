# Feature Specification: Admin Panel Backend

## 1. Description
A complete, fully working admin panel linked to the main project utilizing a backend (like Supabase). The admin role allows managing the core e-commerce data: products (add, edit, remove titles, descriptions, and photos) and categories/subcategories (add, edit, remove). This establishes the foundational management flow for the website.

## 2. Business Value
- **Data Control**: Allows business owners to directly manage their stock and categories without developer intervention.
- **Dynamic Storefront**: Ensures the main website is always up-to-date with the latest product offerings and imagery.
- **Operational Efficiency**: Streamlines the process of maintaining a large catalog of premium activewear.

## 3. User Scenarios & Testing

**Scenario 1: Authenticated Admin Access**
- **Given** an administrative user visits the admin URL
- **When** they provide valid credentials via the auth provider (Supabase Auth)
- **Then** they are granted access to the admin dashboard
- **And** non-authenticated users are redirected back to the login page

**Scenario 2: Product Management (CRUD)**
- **Given** an admin is on the "Products" management page
- **When** they fill out a new product form (title, description, price, category, photo upload) and submit
- **Then** the product is saved to the database
- **And** the image is uploaded to cloud storage
- **And** the product immediately appears in the main website's product grid (if active)

**Scenario 3: Category Management**
- **Given** an admin is on the "Categories" management page
- **When** they add a new top-level category or a subcategory under an existing one
- **Then** the hierarchy is updated in the database
- **And** the change is instantly reflected in the main store's `CategorySidebar`

**Scenario 4: Content Deletion Safeguards**
- **Given** an admin attempts to delete a Category
- **When** that category currently has active products associated with it
- **Then** the system prevents the deletion and warns the admin to reassign or delete the child products first

## 4. Functional Requirements
1. **Authentication System**: Only authorized admin users can access the dashboard.
2. **Database Integration**: Read/Write operations for Products and Categories.
3. **Storage Integration**: Capability to securely upload, store, and serve product imagery.
4. **Product Forms**: Form validation for creating/editing products (require title, price, category).
5. **Category Hierarchy**: Support for parent/child relationships in category creation.
6. **Data Synchronization**: Updates made in the admin panel must be visible on the public-facing storefront.

## 5. Success Criteria
1. Admin panel loads and requires authentication to view any content.
2. An admin can successfully create, read, update, and delete a Product, including its image.
3. An admin can successfully create, read, update, and delete a Category.
4. The storefront's mock data is entirely replaced by dynamically fetched data from the backend.
5. Image uploads process in under 3 seconds on standard broadband.
6. Deletion of a category containing products is gracefully handled (blocked or cascaded safely).

## 6. Key Entities
- **AdminUser**: id, email, role.
- **Category**: id, name, parent_id, created_at, updated_at.
- **Product**: id, title, description, price, original_price, image_url, category_id, sizes (array), in_stock (boolean), created_at, updated_at.

## 7. Configuration & Constraints
- Database/Backend: Supabase (PostgreSQL + GoTrue Auth + Storage).
- Architecture: Next.js App Router (Server Components + Server Actions for mutations).
- Styling: Tailwind CSS matching the main project's design system (or a simplified professional variant for admin context).
- File Storage limit: e.g., max 5MB per image array.

## 8. Assumptions
- Assume the user has or will provision a Supabase project and provide the URL/Anon Key.
- Assume a single "Admin" role is sufficient for MVP (no complex RBAC).
- Assume image optimization is handled loosely (or rely on Next.js Image component for delivery).

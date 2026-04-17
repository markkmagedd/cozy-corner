# Feature Specification: Admin AVIF Uploads for Categories and Products

**Feature Branch**: `016-admin-avif-uploads`  
**Created**: 2026-04-17  
**Status**: Draft  
**Input**: User description: "I want the admin to be able to upload .avif photos to wether categories or products"

## Clarifications

### Session 2026-04-17
- Q: How should `.avif` images be processed during upload? → A: Store the raw file but configure Next.js `next.config` to optimize and serve AVIF images.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Upload AVIF Image to Category (Priority: P1)

As an admin, I want to be able to upload `.avif` images when creating or editing a category, so that I can use modern, optimized graphical assets.

**Why this priority**: Categories are central to navigation and highly visible. Allowing `.avif` images enhances page load times and visual fidelity.

**Independent Test**: Can be fully tested by creating or editing a category in the admin dashboard, uploading an `.avif` file, and verifying it displays correctly on both admin and storefront sides.

**Acceptance Scenarios**:

1. **Given** the admin is on the category creation or edit page, **When** they attempt to upload a valid `.avif` image file, **Then** the file should be accepted, uploaded successfully, and previewed correctly.
2. **Given** an admin has saved a category with an `.avif` image, **When** a user visits the storefront, **Then** the `.avif` image should be served and displayed properly.

---

### User Story 2 - Upload AVIF Image to Product (Priority: P1)

As an admin, I want to be able to upload `.avif` images when creating or editing a product, so that product galleries can benefit from the `.avif` format's efficiency.

**Why this priority**: Similar to categories, products heavily rely on imagery, and `.avif` offers superior compression for user experience.

**Independent Test**: Can be fully tested by creating or editing a product, uploading `.avif` files to its image gallery, and checking both admin previews and storefront product pages.

**Acceptance Scenarios**:

1. **Given** the admin is editing a product's images, **When** they select `.avif` files using the file picker, **Then** the files are uploaded and added to the product's image gallery.
2. **Given** a product contains `.avif` images, **When** a user views the product details, **Then** the `.avif` images load and display normally across different devices.

---

### Edge Cases

- What happens when an uploaded `.avif` file exceeds the maximum allowed file size? 
- How does the system handle an invalid file renamed to have an `.avif` extension?
- What happens if the browser rendering the storefront does not support the `.avif` format?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The admin interface MUST accept files with the `.avif` extension in the image upload components for both Categories and Products.
- **FR-002**: The backend upload handling MUST allow the validation and processing of `.avif` MIME types (`image/avif`) and store them directly.
- **FR-003**: System MUST correctly render `.avif` images in the admin dashboard preview components after upload.
- **FR-004**: System MUST serve and correctly render `.avif` images on the storefront category and product pages.
- **FR-005**: Next.js image optimization (`next.config`) MUST be configured to optimize and serve images in the AVIF format.

### Key Entities

- **Category**: Needs to support `.avif` format in its image asset association.
- **Product**: Needs to support `.avif` format in its image gallery array.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Admins can successfully upload `.avif` images to both Categories and Products without system errors.
- **SC-002**: 100% of successfully uploaded `.avif` images load correctly on both the admin dashboard and storefront interfaces for compatible browsers.
- **SC-003**: The addition of `.avif` upload capabilities maintains existing image format support (e.g., JPEG, PNG, WebP) with zero regressions.

## Assumptions

- The underlying file storage solution natively supports storing `.avif` files.
- Modern browser support for `.avif` is acceptable for the target user base without requiring complex server-side fallbacks.
- Existing general maximum file size limits apply to `.avif` images just as they do to other formats.

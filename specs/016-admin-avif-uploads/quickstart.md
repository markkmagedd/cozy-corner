# Quickstart: Admin AVIF Uploads Testing

## Setup
1. **Local Environment**: Run the standard `npm run dev` or build with `npm run build && npm run start` to specifically verify Next.js image optimization behavior.

## Testing the Changes

1. Navigate to your local admin dashboard. 
2. Edit or create a **Category** or **Product**.
3. In the image upload interface, select a valid `.avif` file from your device.
4. Verify the frontend form explicitly accepts and previews the `.avif` file without throwing unsupported file errors.
5. Save the entity and navigate to the storefront.
6. Verify the page displays the uploaded image. Check the browser's Network tab or DevTools inspector to ensure the image is loaded quickly and is being optimized by the server correctly. 

## Implementation Guardrails

- `next.config.ts` must successfully return `"image/avif"` inside the `images.formats` configuration node.
- Next.js must successfully process AVIF content without missing binary loader flags. 
- Ensure classic formats (JPEG, PNG, WebP) are still successfully uploadable.

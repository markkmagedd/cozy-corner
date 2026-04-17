# Research: Admin AVIF Uploads

## Next.js `next/image` AVIF support
- **Decision**: Configure Next.js to optimize images into the AVIF format.
- **Rationale**: Next.js does not optimize images into AVIF by default because it requires more server CPU footprint. However, AVIF offers much better compression than WebP. By adding `'image/avif'` to the `images.formats` array in `next.config.ts`, Next.js will automatically detect client support via the `Accept` header and serve AVIF images, dynamically falling back to WebP or original formats for older, non-compliant browsers.
- **Alternatives considered**: Pre-processing images manually during upload using an external library like `sharp`. This was rejected to prioritize simplicity in the upload flow and leverage the highly optimized, built-in Next.js runtime manipulation pipeline, reducing duplicated storage. 

## File upload support in Next.js/Browser
- **Decision**: Accept `image/avif` MIME type in the Next.js API routes and explicitly in local component `<input>` `accept` attributes.
- **Rationale**: Next.js upload routes often check extensions and MIME types. Adjusting these filters seamlessly allows the system to receive raw AVIFs. 
- **Alternatives considered**: None. Allowing standard MIME acceptance is robust and correct.

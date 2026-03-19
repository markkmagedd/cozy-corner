/**
 * Generates a URL-friendly slug from a string.
 * Example: "Vintage Barcelona 1999" -> "vintage-barcelona-1999"
 */
export function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w-]+/g, '')  // Remove all non-word chars
    .replace(/--+/g, '-')     // Replace multiple - with single -
    .replace(/^-+/, '')       // Trim - from start of text
    .replace(/-+$/, '');      // Trim - from end of text
}

/**
 * Ensures a slug is unique by potentially appending a counter.
 * Note: Requires the caller to provide existing slugs or a check function.
 */
export function ensureUniqueSlug(slug: string, existingSlugs: string[]): string {
  let uniqueSlug = slug;
  let counter = 1;

  while (existingSlugs.includes(uniqueSlug)) {
    uniqueSlug = `${slug}-${counter}`;
    counter++;
  }

  return uniqueSlug;
}

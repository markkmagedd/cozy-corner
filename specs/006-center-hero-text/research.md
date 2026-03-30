# Research: Center Hero Text

## Technical approach for text centering

**Decision**:
Utilize standard TailwindCSS utility classes, specifically `text-center`, applied to the appropriate text elements or wrapper containers within the hero section. Additionally, structural alignment classes like `items-center` or `mx-auto` may be utilized if the text block itself has a constrained width.

**Rationale**:
By reviewing `package.json`, the project heavily utilizes TailwindCSS (`@tailwindcss/postcss`). Leveraging standard utility classes keeps the codebase clean, consistent, and idiomatic. It is the most robust and responsive way to achieve the desired outcome under the current architecture.

**Alternatives considered**:
- *Custom CSS classes in root stylesheet*: Rejected, as it strays from the Tailwind methodology already cleanly established in the project.
- *Inline styles*: Rejected as poor practice for maintenance and responsive design handling.

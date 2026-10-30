# Studio interface

Design guidance: UI UX Pro Max (nextlevelbuilder/ui-ux-pro-max-skill), reviewed 30 October 2026.

Direction: a dark photography workspace with lime accents, Geist typography, understated borders and a clear editing sequence. The search's AI-native interface guidance informed the layout; the generic purple/pink palette and testimonial pattern were intentionally rejected for this photo-editing context. No testimonials or unverified claims were added.

The homepage supports local image preview, accessible treatment/palette selection and a labelled illustrative before/after. Planning controls do not alter pixels. Uploaded previews remain in browser memory and object URLs are released. Missing Clerk credentials render this workspace without loading Clerk. The original, fully connected transformation flow is preserved at /studio; it is available from the homepage when authentication is configured. AI keys remain empty.

Checks: TypeScript, scoped ESLint, desktop/mobile visual review, 375/768/1024/1440 widths, local upload/remove, comparison, pressed selection states, and reduced motion. Live AI generation still requires service configuration.

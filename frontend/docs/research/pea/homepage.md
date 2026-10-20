# PEA homepage clone brief

- Source: `https://www.pea.co.th/`
- Local route: `/`
- Owned implementation: `app/page.tsx`, `app/globals.css`, `app/layout.tsx`
- Local assets: `public/sites/pea/images/`, `public/sites/pea/fonts/`
- Scope: homepage, desktop and mobile

## Browser evidence

The source was inspected with Playwright after scrolling from top to bottom so lazy-loaded sections and images were present. Screenshots use matching viewports:

- Desktop: `1440 × 900`
- Mobile: `390 × 844`
- Source full-page height: desktop `4361px`, mobile `5603px`
- Final local full-page height: desktop `4372px`, mobile `5659px`
- Final local page width: desktop `1440px`, mobile `390px` (no page-level horizontal overflow)

Representative captures are stored under:

- `docs/design-references/pea/source/`
- `docs/design-references/pea/compare/`

## Observed structure

1. White anniversary-logo header and magenta primary navigation
2. Responsive Solar Rooftop hero (separate desktop/mobile artwork)
3. Customer-category pills and horizontal service-card carousel
4. News/infographic tabs and news-card carousel
5. Planned outage panel
6. Safe Save Thai article cards
7. PEA Privilege and Watt-D Point banners
8. Procurement list and announcement carousel
9. Magenta quick-link bar and white organization footer
10. Fixed cookie consent and Live Chat layers

## Responsive rules reproduced

- The desktop navigation becomes a mobile menu at `760px`.
- The hero swaps to the source's dedicated mobile asset.
- Service filters wrap to multiple rows on mobile.
- Service, news, knowledge, and privilege cards become horizontal touch scrollers.
- Procurement changes from two columns to a stacked list and feature card.
- Footer columns become collapsed mobile headings.
- Fixed cookie and chat layers resize and reposition for the mobile viewport.

## Asset mapping

The implementation uses the source's observed PEA assets, downloaded into `public/sites/pea`:

- Anniversary and organization logos
- Desktop/mobile Solar Rooftop hero artwork
- Residential service cards `service-r1.webp` through `service-r4.webp`
- Three current news-card images
- Three Safe Save Thai article images
- Privilege/Watt-D backgrounds and logo layers
- Procurement announcement artwork
- Live Chat artwork
- Aktiv Grotesk Thai font files in weights 400–700

External links intentionally continue to the source services because only the homepage route is in scope.

## Remaining differences

- Carousels are touch-scrollable and show the observed first state, but do not autoplay on the same timer as the production Drupal carousels.
- Outage and procurement content is a representative static snapshot; the production site updates these records dynamically.
- Small icon shapes are editable inline SVG approximations; branded image assets and typography use the observed source files.

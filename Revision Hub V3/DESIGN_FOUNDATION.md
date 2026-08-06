# SJWMS Maths visual foundation

This document is the design contract for the next site-wide rollout. The implementation lives in `assets/foundation.css` and is scoped to pages with the `design-v3` body class.

## Product principles

- Help a student reach the right resource in as few decisions as possible.
- Keep the site public, static and anonymous: no accounts, student data, progress tracking or behavioural analytics.
- Use colour to communicate structure, not as decoration on every surface.
- Prefer one strong composition, clear type and generous spacing over collections of small boxes.
- Keep the same navigation, interaction patterns and content hierarchy on every stage and device.

## Visual language

- **Type:** DM Sans for headings, navigation and body copy. Headings are compact and geometric, with enough line height to prevent collisions.
- **Core colours:** deep navy for authority, violet for primary actions, mint for positive emphasis, yellow for notices, coral for small moments of energy and blue for GCSE/navigation support.
- **Stage colours:** Year 7 orange, Year 8 green, Year 9 purple and GCSE blue-violet. Use accessible dark accents on pale surfaces and lighter equivalents in dark mode.
- **Shapes:** clipped top-right corners, circular icon fields, offset rings, simple graph marks and restrained floating cards. These should support orientation rather than compete with the content.
- **Data motifs:** use small labelled bar charts or progress summaries. Avoid isolated axes or unexplained mathematical decoration.
- **Surfaces:** mostly white or pale neutral. Avoid nested glass panels, heavy gradients and shadows on every component.

## Core components

- `edu-hero`: homepage welcome and primary course route.
- `edu-page-hero`: compact inner-page introduction with quick links and a stage-specific composition.
- `route-card`: one card for each major learning stage.
- `year-card`: KS3 year routes, using the established orange/green/purple scheme.
- `tool-card`: compact external or supporting tools.
- `learning-steps`: the Learn → Practise → Check → Extend revision model.
- `gcse-group`: expandable topic groups that keep the 19-unit course concise.
- `textbook-workspace`: year-first textbook selection without a site login.
- `edu-unit-hero`: reusable unit introduction with stage-aware colour tokens.
- `unit-sidebar`: sticky curriculum navigation on desktop and a native collapsible unit chooser on smaller screens.
- `lab-banner`: a high-contrast home for themed Maths Labs.
- `site-footer`: three compact navigation groups plus the site’s privacy commitment, with separate light and dark surfaces.

## Content rules

- Use short page titles and one clear sentence of context.
- Label links by outcome: “Open textbook”, “Practise”, “View past papers”.
- Make empty or not-yet-ready content explicit; never present a dead control as available.
- Identify external services and never imply that SJWMS Maths owns or stores their login details.
- Keep one `h1` per page and preserve logical heading order.

## Rollout coverage

- The homepage, course hubs, textbook finder and supporting guidance pages use the complete visual system.
- All 30 KS3 units and 19 GCSE units use the shared unit template and curriculum navigation.
- Older learning tools and games use a compatibility layer that adds the shared site context without changing their mathematical behaviour.
- Maths Labs retain their independent branding and content while using the shared navigation and footer.
- CMS administration and retired HTML fragments remain outside the visitor-facing shell.

New pages should be checked at 390px, 768px and desktop widths in light and dark mode before publication.

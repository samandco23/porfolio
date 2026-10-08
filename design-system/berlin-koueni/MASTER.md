# Berlin Koueni — editorial portfolio

User constraint: preserve the existing Inter / JetBrains Mono fonts and all theme palette values. UI/UX Pro Max's creative-portfolio search matched editorial/brutalist asymmetry and scroll storytelling; its suggested blue palette and alternate fonts are overridden by this constraint. Existing Framer Motion handles restrained reveals; no GSAP or additional dependency.

## Image-first reference analysis

Five standalone references generated and inspected before implementation: hero, projects, expertise, moments, contact. These are design references only; their placeholder claims, locations, email addresses and generated people are never used as portfolio data.

- Hero: roughly 55/45 columns. Name on two lines, second in green; 80–100px desktop mono, 54px mobile; role 20–24px; 16px Inter description. Solid green primary CTA and outlined secondary CTA, 48px targets. Thin orbital geometry with central initials balances the text. Availability belongs above the name, location and specialties below a rule. No extra terminal panel.
- Projects: a prominent 60/40 feature row followed by two open entries. 16:10 media frames, 6px radius, restrained geometric drawings when real images are absent. The diagrams are decorative covers, never purported product screenshots. 24–36px titles, 16px descriptions, up to three tags and a circular arrow. No outer card shell around media and text.
- Expertise: open 45/55 composition, left heading split over two lines, right three ruled rows. Consistent Lucide icons. Actual skill names come from database; no unverified technologies from generated reference copy.
- Moments: large real photographs; year headings and a thin green timeline. No carousel controls when there is no carousel. Filtered timeline/gallery views are explicit buttons with pressed state. The actual GetSmarter photo replaces the generated placeholder people.
- Contact: large single heading, contact details left / form right. Visible labels, 48px minimum inputs, error associations, comfortable 16px input text. Social labels replace long URLs.

## Tokens and rhythm

Reuse all CSS color variables in globals.css, including light variants. Do not alter the palette. Primary button uses accent/on-surface inversion to maintain contrast in both themes. Mono display and labels, Inter prose. Keep 4/8px spacing cadence, 24px mobile gutters, 40–48px desktop gutters, 1280px shell, 64/96/112px section rhythm. Reading columns about 768px. Respect zoom, native selects and reduced motion.

## Components and content

Signature components: OrbitMark, ProjectCover/ProjectCard, expertise rows, MomentsExplorer timeline. Menu has native links, Escape close and restored toggle focus. Public copy lives in SiteContent defaults with French and English versions and is editable in admin. Entity records and image URLs remain database controlled. Existing custom copy is preserved.

## Delivery checks

Typecheck, lint, existing meaningful tests and production build. Chrome: 375 / 768 / 1024 / 1440px, light and dark, language persistence, menu keyboard behavior, filtering, skill disclosures, real gallery links and draft privacy. Inspect desktop and mobile screenshots. No horizontal overflow, usable targets, visible focus, 16px prose and inputs, original font and palette values, reduced-motion rendering.

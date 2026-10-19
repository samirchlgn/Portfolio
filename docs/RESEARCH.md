# Audit and reference notes

Reviewed 19 October 2026. This document records the design rationale; it is not part of the public page flow.

## Existing website

Source: https://samirchaulagain.com/

Reviewed the home-page HTML, public configuration, engineering/community/innovation data, timeline and lab entry point. Retained the public portrait and core factual content: senior civil engineering practice in Hamilton, the surveying/construction foundation, land development and three-waters scope, qualifications, CPEng goal, QA/digital work and the three volunteer roles.

The main problems were repetition, an unclear hierarchy, too much content on one page, many competing interaction patterns, fictional project stories and unfinished contact links. An unnecessary theme selector, carousel layers and a demonstration map added complexity without stronger evidence.

The new homepage is an introduction rather than a full professional archive. Details move into dedicated pages. The fictional development entries are removed. No client outcomes, awards or testimonials are invented. Employment is described as a career developed at CKL without publishing unconfirmed changes. Contact uses the correctly matched New Zealand profile, rather than a same-name person abroad:

https://nz.linkedin.com/in/samirchlgn

## Portfolio references

| Reference | What informed this design |
| --- | --- |
| https://www.awwwards.com/websites/portfolio/ | Distinctive identity and composition. The main listing timed out during retrieval; page 2 was accessible at https://www.awwwards.com/websites/portfolio/?page=2. |
| https://muz.li/blog/top-100-most-creative-and-unique-portfolio-websites-of-2025/ | Broad visual research into image-led portfolios and project-led storytelling. At retrieval, this URL’s heading had been updated to the 2026 selection. |
| https://uiuxshowcase.com/best-portfolio-examples/ | Clarity, deliberate hierarchy and a recognisable personal voice. |
| https://dennissnellenberg.com/ | A confident personal identity, selected work and a direct contact route. |
| https://brittanychiang.com/ | Semantic structure, concise role descriptions and readable deeper detail. |

The new site is an original engineering-specific interpretation. It does not reuse the code, graphics, distinctive layouts or wording of those portfolios.

## UX/UI skills applied

### Anthropic frontend-design

https://github.com/anthropics/skills/tree/main/skills/frontend-design

Read the current SKILL.md and applied the principles of subject-specific design, intentional typography, restraint and concise interface copy. Rejected a generic cream-and-serif concept. Used drawing-ink colours, condensed lettering, Samir’s real portrait and a civil-design illustration. Kept only one short entrance animation, with no scroll hijacking or compulsory intro.

### Vercel Web Interface Guidelines

https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines

https://github.com/vercel-labs/web-interface-guidelines

Applied semantic navigation, native form controls, explicit labels and units, visible focus, skip links, reduced-motion support, image dimensions, local fonts, URL-based tool state, honest error feedback and clipboard fallback. The skills were read as reference guidance; no external skill or plugin is required to run the website.

## Technical primary references

- Vercel build configuration: https://vercel.com/docs/builds/configure-a-build
- Rational Method reference (rounded conversion): https://www.nzta.govt.nz/assets/resources/stormwater-management/docs/201005-nzta-stormwater-standard.pdf
- QuickFlow uses the exact hectare/mm-hour conversion, Q = C i A / 360 m³/s. The cited historical standard is a method reference, not a statement that its design requirements govern every project.
- GradeCheck is geometric arithmetic with an explicit direction. BalanceCheck is a transparent single-material volume conversion, not a calibrated geotechnical model.

## Asset provenance

- Portrait: retained from `https://samirchaulagain.com/assets/images/profile.jpg`; optimised into responsive WebP files. No synthetic portrait or stock project photography.
- Civil plan and common-ground graphics: newly authored SVG illustrations.
- Social preview and favicon: newly authored graphics using the same visual system and retained portrait.
- Manrope and Barlow Condensed: local Google Fonts files with the original SIL Open Font License texts.

# Verification record

19 October 2026.

## Completed

- Production build: passed. Eight generated pages plus the legacy lab route, sitemap, robots file and assets.
- Node test runner: **18 tests passed, 0 failed**, including the parent interaction group.
- Calculation coverage: Rational Method units and zero/invalid inputs; falling, rising and level pipes; negative datums; bank/compacted/loose volume conversion; unsuitable export and import demand; discipline-specific review briefs.
- DOM interaction coverage: numeric URL restoration, tool switching, focus, live results, invalid-input recovery, clipboard links, report downloads, earthworks error states, local review generation, multiline clipboard fallback, browser-history events and menu/Escape semantics.
- Static output: **9 HTML documents, 183 local references, 6 image instances and 15 labelled form controls** checked. No missing local asset, broken local anchor, duplicate ID, invalid JSON-LD or retained contact placeholder found.
- JavaScript syntax: passed for all browser modules.
- Assets: original SVG illustrations and the social card were rendered and visually inspected. The responsive portrait files were checked. The original 12.8 MB photograph is served as approximately 50 KB, 84 KB and 148 KB WebP variants.
- Fonts: local WOFF2 files and original OFL notices present.
- Vercel configuration keys verified against the published Vercel JSON schema. No deployment was performed.
- Primary solid-colour contrast calculations: drawing ink on paper 12.30:1; slate body text on paper 5.57:1; pale text on survey blue 5.49:1; dark green on the community graphic 8.65:1. Orange is used for decorative elements and large arrow controls; ink on orange is 4.26:1, exceeding the 3:1 non-text control threshold.
- Mobile title widths were checked using the actual Barlow Condensed font metrics, and the mobile scale was adjusted to fit.

The initial HTML text count decreased from 1,192 words in the old page to 315 in the new homepage. This is a source-text comparison excluding scripts, styles, SVG and noscript, rather than a count of every dynamically rendered element on the previous site.

## Verification limits

The supported browser preview/control capability was unavailable. No live browser screenshots, Lighthouse score, real-device review or screen-reader certification is claimed. Happy DOM tests exercise DOM logic, not CSS layout, native downloads, font rendering or full browser accessibility behavior. Asset previews are artwork inspections, not website screenshots.

Development-server startup and the final Vercel deployment were not exercised in this environment. The user requested source for their own GitHub repository and Vercel account, so the site was not registered or published elsewhere.

## Short acceptance pass on your Vercel preview

1. Review Home, About, all three practice pages, Lab, Colophon and an unknown URL on desktop and a phone. Suggested widths: 320, 390, 768 and 1440 px.
2. Confirm portrait crops, heading wraps, page spacing, focus outlines and no sideways overflow at 100% and 200% zoom.
3. Navigate using Tab, Shift+Tab, Enter and Escape. Check the skip link, menu and career disclosures.
4. Try reduced-motion mode and JavaScript disabled. Core content and navigation should remain available; the lab explains its JavaScript requirement.
5. Test all four tools, a rising pipe, invalid input, reset, copying, clipboard denial, report downloads and Back/Forward.
6. Open a shared numeric calculation URL and the legacy `/apps/lab/index.html?tool=pipe` route.
7. Confirm the LinkedIn contact route and current public role descriptions. Add an approved email or CV in `src/site.mjs` if desired.
8. Review the social image when sharing the Vercel/custom-domain URL. After any domain change, update `src/site.mjs` so canonicals, sitemap and social metadata match.


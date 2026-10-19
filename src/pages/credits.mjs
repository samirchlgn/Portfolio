import { layout, button } from "../components.mjs";

export function credits() {
  return layout({
    title: "Colophon",
    path: "/credits/",
    noContact: true,
    description:
      "The design, typography, imagery and privacy choices behind Samir Chaulagain’s portfolio.",
    body: `<article class="credits-page wrap"><p class="page-context">Colophon</p><h1 class="display">Built with<br>intention.</h1><p>A small, fast personal website about engineering, people and practical ideas.</p><h2>The design</h2><p>Condensed lettering, drawing-ink blue and a light canvas take their cues from technical drawings. The work is presented as three connected practices, with room for each story to breathe.</p><h2>Type & imagery</h2><p>Headlines use <a href="https://fonts.google.com/specimen/Barlow+Condensed">Barlow Condensed</a> by Jeremy Tribby. Reading and interface text use <a href="https://fonts.google.com/specimen/Manrope">Manrope</a> by Mikhail Sharanda. Both are locally hosted under the SIL Open Font License.</p><p>The portrait is Samir’s graduation photograph, retained from his original website. Civil design and common-ground illustrations were created for this portfolio. They are conceptual illustrations, rather than client project drawings or photographs.</p><h2>Privacy & accessibility</h2><p>This site has no analytics, advertising, tracking cookies or remote AI service. Fonts and images are served with the website. Lab calculations run locally. Copying a calculation link shares the numeric inputs in its URL; review context is excluded.</p><p>Navigation supports a keyboard, motion follows your device preference, and core portfolio content is available without JavaScript. Lab calculations require JavaScript.</p><h2>Acknowledgements</h2><p>Research included <a href="https://www.awwwards.com/websites/portfolio/">Awwwards</a>, <a href="https://muz.li/blog/top-100-most-creative-and-unique-portfolio-websites-of-2025/">Muzli</a> and <a href="https://uiuxshowcase.com/best-portfolio-examples/">UI UX Showcase</a>, alongside the portfolios of <a href="https://dennissnellenberg.com/">Dennis Snellenberg</a> and <a href="https://brittanychiang.com/">Brittany Chiang</a>. Their work informed the emphasis on identity, hierarchy and clear navigation. This site uses original layouts and assets.</p><p>Implementation guidance drew on <a href="https://github.com/anthropics/skills/tree/main/skills/frontend-design">Anthropic’s frontend-design skill</a> and <a href="https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines">Vercel’s Web Interface Guidelines</a>.</p></article>`,
  });
}

export function notFound() {
  return layout({
    title: "Page not found",
    path: "/404.html",
    noindex: true,
    noContact: true,
    body: `<section class="not-found wrap"><p class="page-context">404 / A small detour</p><h1 class="display">Let’s find<br>your way back.</h1><p>This page may have moved. There’s plenty to explore from the home page.</p>${button("/", "Back to the portfolio")}</section>`,
  });
}

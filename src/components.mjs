import { site } from "./site.mjs";

export const arrow = (direction = "ne") =>
  `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="${direction === "down" ? "M12 4v16m-6-6 6 6 6-6" : direction === "right" ? "M4 12h16m-6-6 6 6-6 6" : "M5 19 19 5M5 5h14v14"}"/></svg>`;
export const cross = `<svg class="survey-mark" viewBox="0 0 32 32" fill="none" stroke="currentColor" aria-hidden="true"><path d="M16 0v32M0 16h32"/><circle cx="16" cy="16" r="6"/></svg>`;
export const logo = `<svg viewBox="0 0 40 40" class="brand-mark" aria-hidden="true"><path d="M3 26V4h22v8H11v14H3Zm12 10V14h22v22H15Zm8-14v6h6v-6h-6Z" fill="currentColor"/><path d="M3 31h7v5H3z" fill="#F26738"/></svg>`;
export const button = (href, text, light = false) =>
  `<a class="button${light ? " button-light" : ""}" href="${href}"><span>${text}</span><span class="button-arrow">${arrow()}</span></a>`;
export const textLink = (href, text) =>
  `<a class="text-link" href="${href}">${text}${arrow()}</a>`;

export function portrait({
  className = "",
  priority = false,
  sizes = "(max-width: 720px) 90vw, 38vw",
} = {}) {
  return `<img class="${className}" src="/assets/images/samir-960.webp" srcset="/assets/images/samir-640.webp 640w, /assets/images/samir-960.webp 960w, /assets/images/samir-1440.webp 1440w" sizes="${sizes}" width="960" height="1440" alt="Samir Chaulagain at graduation, wearing a Nepali stole" ${priority ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
}

function header(current) {
  const items = [
    ["/#work", "Work", "work"],
    ["/about/", "About", "about"],
    ["/lab/", "Lab", "lab"],
  ];
  return `<a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header"><div class="header-inner wrap">
    <a class="brand" href="/" aria-label="Samir Chaulagain, home">${logo}<span>Samir<br>Chaulagain</span></a>
    <nav class="primary-nav" id="primary-nav" aria-label="Main navigation">${items.map(([href, label, key]) => `<a href="${href}" ${current === key ? 'aria-current="page"' : ""}>${label}</a>`).join("")}<a class="nav-contact-mobile" href="/#contact">Let’s talk</a></nav>
    <a class="header-contact" href="/#contact">Let’s talk${arrow()}</a>
    <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-nav" aria-label="Open navigation"><span></span><span></span></button>
  </div></header>`;
}

function contact() {
  const primaryHref = site.email ? `mailto:${site.email}` : site.linkedin;
  const primaryLabel = site.email ? "Send me an email" : "Connect on LinkedIn";
  return `<section class="contact-section" id="contact" aria-labelledby="contact-title"><div class="wrap contact-inner">
    <div class="contact-top"><span>Have a project, an idea, or a shared purpose?</span>${cross}</div>
    <div class="contact-main"><h2 class="display" id="contact-title">Let’s build<br>something good.</h2><a class="contact-circle" href="${primaryHref}" aria-label="${primaryLabel}">${arrow()}</a></div>
    <div class="contact-bottom"><p>Civil engineering. Digital possibilities.<br>Community that moves forward together.</p><a class="contact-link" href="${primaryHref}" ${site.email ? "" : 'rel="me"'}>${primaryLabel}${arrow()}</a></div>
  </div></section>`;
}

function footer() {
  return `<footer class="site-footer wrap"><a href="/" class="footer-name">Samir Chaulagain</a><span>Hamilton, Aotearoa New Zealand</span><div><a href="/credits/">Colophon</a><a href="${site.linkedin}" rel="me">LinkedIn${arrow()}</a><span>© ${site.year}</span></div></footer>`;
}

export function layout({
  title,
  description = site.description,
  path = "/",
  current = "",
  body,
  lab = false,
  noContact = false,
  noindex = false,
}) {
  const fullTitle = title
    ? `${title} — ${site.name}`
    : `${site.name} — Civil Engineer, Leader & Builder`;
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: site.name,
    jobTitle: site.role,
    url: site.url,
    sameAs: [site.linkedin],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Hamilton",
      addressCountry: "NZ",
    },
    knowsAbout: [
      "Civil engineering",
      "Land development",
      "Three waters",
      "Community leadership",
      "Digital engineering",
    ],
  };
  return `<!doctype html>
<html lang="en-NZ" class="no-js"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover"><meta name="theme-color" content="#F5F7F8"><meta name="color-scheme" content="light"><title>${fullTitle}</title><meta name="description" content="${description}">${noindex ? '<meta name="robots" content="noindex">' : ""}<link rel="canonical" href="${site.url}${path}"><meta property="og:type" content="website"><meta property="og:title" content="${fullTitle}"><meta property="og:description" content="${description}"><meta property="og:url" content="${site.url}${path}"><meta property="og:image" content="${site.url}/assets/images/social-preview.jpg"><meta property="og:image:width" content="1200"><meta property="og:image:height" content="630"><meta property="og:image:alt" content="Samir Chaulagain — civil engineering, people and possibility"><meta name="twitter:card" content="summary_large_image"><link rel="icon" href="/assets/images/favicon.svg" type="image/svg+xml"><link rel="icon" href="/favicon.ico" sizes="any"><link rel="preload" href="/assets/fonts/barlow-condensed-latin.woff2" as="font" type="font/woff2" crossorigin><link rel="preload" href="/assets/fonts/manrope-latin.woff2" as="font" type="font/woff2" crossorigin><link rel="stylesheet" href="/assets/styles.css"><script type="application/ld+json">${JSON.stringify(schema)}</script><script type="module" src="/assets/js/main.js"></script>${lab ? '<script type="module" src="/assets/js/lab.js"></script>' : ""}</head>
<body>${header(current)}<main id="main">${body}${noContact ? "" : contact()}</main>${footer()}<div class="toast" id="toast" role="status" aria-live="polite"></div></body></html>`;
}

export const practiceVisual = `<div class="plan-visual"><img src="/assets/images/civil-study.svg" width="1000" height="760" alt="Original illustrative site plan connecting land parcels, a road, landscape and drainage" loading="lazy" decoding="async"><span class="visual-caption">Civil design study / illustration</span></div>`;
export const communityVisual = `<div class="community-visual"><img src="/assets/images/common-ground.svg" width="800" height="840" alt="Original mountain and gathering-place illustration, connecting Nepal and Aotearoa" loading="lazy" decoding="async"><span class="visual-caption">Aotearoa / Nepal</span><span class="community-visual-word" aria-hidden="true">Common<br>ground.</span></div>`;
export const labVisual = `<div class="lab-visual" aria-label="GradeCheck example: a 1.25 metre fall over 100 metres gives a 1.25 percent grade"><div class="lab-mini-header"><span class="mini-dot"></span><span>GradeCheck</span><span>Design tools</span></div><div class="mini-grade"><span class="mini-grade-value">1.25<small>%</small></span><span>Small checks.<br>Clearer decisions.</span></div><svg viewBox="0 0 600 170" fill="none" aria-hidden="true"><path d="M35 22V151M565 22V151M35 139H565" stroke="currentColor" opacity=".3" stroke-dasharray="4 6"/><path d="m35 38 530 77" stroke="#f26738" stroke-width="9"/><circle cx="35" cy="38" r="8" fill="currentColor"/><circle cx="565" cy="115" r="8" fill="currentColor"/><path d="m35 156 6-5-6-5m530 10-6-5 6-5" stroke="currentColor"/><text x="300" y="135" text-anchor="middle" fill="currentColor" font-size="13">100 m horizontal length</text></svg><div class="lab-mini-footer"><span>Start 15.25 m</span><span>End 14.00 m</span></div></div>`;

import { mkdir, cp, writeFile, rm } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import home from "../src/pages/home.mjs";
import about from "../src/pages/about.mjs";
import { engineering, community, digital } from "../src/pages/practice.mjs";
import lab from "../src/pages/lab.mjs";
import { credits, notFound } from "../src/pages/credits.mjs";
import { site } from "../src/site.mjs";

export const root = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "..",
);
export async function build({ quiet = false } = {}) {
  const dist = path.join(root, "dist");
  await rm(dist, { recursive: true, force: true });
  await mkdir(dist, { recursive: true });
  await cp(path.join(root, "public"), dist, { recursive: true });
  const routes = new Map([
    ["index.html", home],
    ["about/index.html", about],
    ["work/engineering/index.html", engineering],
    ["work/community/index.html", community],
    ["work/digital/index.html", digital],
    ["lab/index.html", lab],
    ["credits/index.html", credits],
    ["404.html", notFound],
  ]);
  for (const [route, render] of routes) {
    const target = path.join(dist, route);
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, render());
  }
  const urls = [...routes.keys()]
    .filter((route) => route !== "404.html")
    .map((route) => site.url + "/" + route.replace(/index\.html$/, ""));
  await writeFile(
    path.join(dist, "sitemap.xml"),
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((url) => `<url><loc>${url}</loc></url>`).join("")}</urlset>\n`,
  );
  await writeFile(
    path.join(dist, "robots.txt"),
    `User-agent: *\nAllow: /\nSitemap: ${site.url}/sitemap.xml\n`,
  );
  // The old lab link remains usable even outside Vercel. The redirect preserves queries.
  const alias = path.join(dist, "apps/lab/index.html");
  await mkdir(path.dirname(alias), { recursive: true });
  await writeFile(
    alias,
    '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>The lab has moved</title><script src="/assets/js/legacy-lab.js" defer></script></head><body><p>The lab has moved. <a href="/lab/">Open the lab</a>.</p></body></html>',
  );
  if (!quiet)
    console.log(
      `Built ${routes.size} static pages, compatibility route, sitemap and local assets → dist/`,
    );
  return dist;
}
if (
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
)
  await build();

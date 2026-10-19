/** Dependency-free audit of our controlled static output. Not a browser audit. */
import { readFile, readdir, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";
import { gzipSync } from "node:zlib";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const dist = path.join(root, "dist");
const failures = [];
const pages = new Map();
let references = 0,
  images = 0,
  controls = 0;
async function walk(dir) {
  const files = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...(await walk(p)));
    else files.push(p);
  }
  return files;
}
function attrs(text) {
  const result = {};
  for (const m of text.matchAll(/([\w:-]+)(?:\s*=\s*"([^"]*)")?/g))
    result[m[1]] = m[2] ?? "";
  return result;
}
for (const file of (await walk(dist)).filter((file) =>
  file.endsWith(".html"),
)) {
  const html = await readFile(file, "utf8");
  const tags = [...html.matchAll(/<([A-Za-z][\w-]*)\b([^>]*?)>/g)].map((m) => ({
    tag: m[1].toLowerCase(),
    ...attrs(m[2]),
  }));
  const ids = tags.filter((t) => t.id).map((t) => t.id);
  const duplicate = ids.filter((id, i) => ids.indexOf(id) !== i);
  if (duplicate.length)
    failures.push(`${file}: duplicate IDs ${duplicate.join(",")}`);
  pages.set(file, { html, tags, ids: new Set(ids) });
}
for (const [file, { html, tags, ids }] of pages) {
  const route = "/" + path.relative(dist, file).replace(/\\/g, "/");
  const compatibility = route.includes("/apps/lab/");
  if (!compatibility) {
    if (tags.filter((t) => t.tag === "h1").length !== 1)
      failures.push(`${route}: expected one H1`);
    if (!tags.some((t) => t.tag === "main" && t.id === "main"))
      failures.push(`${route}: main landmark missing`);
    if (
      !tags.some(
        (t) => t.tag === "meta" && t.name === "description" && t.content,
      )
    )
      failures.push(`${route}: description missing`);
    if (!tags.some((t) => t.tag === "a" && t.href === "#main"))
      failures.push(`${route}: skip link missing`);
  }
  for (const tag of tags) {
    if (tag.tag === "img") {
      images++;
      if (!("alt" in tag) || !tag.width || !tag.height)
        failures.push(`${route}: image alt/dimensions missing`);
    }
    if (["input", "textarea", "select"].includes(tag.tag)) {
      controls++;
      if (
        !tag["aria-label"] &&
        !tags.some((t) => t.tag === "label" && t.for === tag.id)
      )
        failures.push(`${route}: unlabelled control ${tag.id || tag.tag}`);
    }
    for (const attr of [
      "aria-controls",
      "aria-describedby",
      "aria-labelledby",
    ]) {
      if (tag[attr])
        for (const id of tag[attr].split(" "))
          if (!ids.has(id))
            failures.push(`${route}: ${attr} references missing ${id}`);
    }
    const refs = [tag.href, tag.src];
    if (tag.srcset)
      refs.push(...tag.srcset.split(",").map((x) => x.trim().split(/\s+/)[0]));
    if (tag.property === "og:image") refs.push(tag.content);
    for (const ref of refs.filter(Boolean)) {
      if (/^(mailto:|tel:|data:)/.test(ref)) continue;
      const url = new URL(ref, "https://samirchaulagain.com" + route);
      if (url.origin !== "https://samirchaulagain.com") continue;
      references++;
      let target = path.join(dist, decodeURIComponent(url.pathname));
      try {
        if ((await stat(target)).isDirectory())
          target = path.join(target, "index.html");
        await stat(target);
      } catch {
        failures.push(`${route}: missing ${ref}`);
        continue;
      }
      if (
        url.hash &&
        pages.has(target) &&
        !pages.get(target).ids.has(url.hash.slice(1))
      )
        failures.push(`${route}: missing anchor ${ref}`);
    }
  }
  if (
    /your-email@example|https:\/\/example\.com|href="#"|href="https:\/\/www\.linkedin\.com\/"|Demonstration portfolio entry/.test(
      html,
    )
  )
    failures.push(`${route}: placeholder found`);
  const structured = [
    ...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    ),
  ];
  for (const match of structured)
    try {
      JSON.parse(match[1]);
    } catch {
      failures.push(`${route}: invalid JSON-LD`);
    }
}
for (const file of (await walk(path.join(root, "public/assets/js"))).filter(
  (file) => file.endsWith(".js"),
)) {
  const check = spawnSync(process.execPath, ["--check", file], {
    encoding: "utf8",
  });
  if (check.status !== 0) failures.push(check.stderr);
}
const css = await readFile(path.join(dist, "assets/styles.css"), "utf8");
if (/transition:\s*all/.test(css)) failures.push("CSS: transition:all");
if (!css.includes("prefers-reduced-motion"))
  failures.push("CSS: reduced-motion support missing");
const fonts = await readdir(path.join(dist, "assets/fonts"));
for (const name of ["manrope-OFL.txt", "barlow-condensed-OFL.txt"])
  if (!fonts.includes(name)) failures.push(`Font license missing: ${name}`);
const cssBytes = Buffer.byteLength(css);
const cssGzip = gzipSync(css).length;
if (failures.length) {
  console.error(failures.join("\n"));
  process.exitCode = 1;
} else
  console.log(
    `Static checks passed: ${pages.size} HTML documents, ${references} local references, ${images} image instances, ${controls} labelled controls.\nJavaScript syntax, JSON-LD, anchors, image dimensions, local assets, licenses and placeholder checks passed.\nStylesheet: ${(cssBytes / 1024).toFixed(1)} KB; ${(cssGzip / 1024).toFixed(1)} KB gzip.\nBrowser rendering and assistive-technology behavior require separate visual/manual QA.`,
  );

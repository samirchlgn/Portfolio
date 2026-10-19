import http from "node:http";
import { readFile, stat } from "node:fs/promises";
import { watch } from "node:fs";
import path from "node:path";
import { build, root } from "./build.mjs";

const production = process.argv.includes("--production");
const portIndex = process.argv.indexOf("--port");
const port = Number(
  portIndex >= 0 ? process.argv[portIndex + 1] : process.env.PORT || 5173,
);
if (!Number.isInteger(port) || port < 1 || port > 65535)
  throw new Error("Choose a port from 1 to 65535.");
const dist = await build();
const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
  ".txt": "text/plain; charset=utf-8",
};
http
  .createServer(async (req, res) => {
    try {
      const url = new URL(req.url, "http://localhost");
      const decoded = decodeURIComponent(url.pathname);
      const target = path.resolve(dist, "." + decoded);
      if (target !== dist && !target.startsWith(dist + path.sep)) {
        res.writeHead(403);
        res.end("Forbidden");
        return;
      }
      let file = target;
      let status = 200;
      try {
        if ((await stat(file)).isDirectory())
          file = path.join(file, "index.html");
        await stat(file);
      } catch {
        file = path.join(dist, "404.html");
        status = 404;
      }
      const data = await readFile(file);
      res.writeHead(status, {
        "Content-Type": mime[path.extname(file)] || "application/octet-stream",
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      });
      res.end(req.method === "HEAD" ? undefined : data);
    } catch {
      res.writeHead(400);
      res.end("Bad request");
    }
  })
  .listen(port, "127.0.0.1", () =>
    console.log(
      `Portfolio available at http://localhost:${port}${production ? "" : " (source changes rebuild automatically; refresh to view)"}`,
    ),
  );
if (!production) {
  let timer;
  // Template imports are cached in Node. Restart a child build process for fresh modules.
  const { spawn } = await import("node:child_process");
  let building = false,
    queued = false;
  const runBuild = () => {
    if (building) {
      queued = true;
      return;
    }
    building = true;
    const child = spawn(
      process.execPath,
      [path.join(root, "scripts/build.mjs")],
      { stdio: "inherit" },
    );
    child.on("exit", (code) => {
      building = false;
      if (code === 0) console.log("Updated. Refresh your browser.");
      if (queued) {
        queued = false;
        runBuild();
      }
    });
  };
  const freshBuild = () => {
    clearTimeout(timer);
    timer = setTimeout(runBuild, 180);
  };
  watch(path.join(root, "src"), { recursive: true }, freshBuild);
  watch(path.join(root, "public"), { recursive: true }, freshBuild);
}

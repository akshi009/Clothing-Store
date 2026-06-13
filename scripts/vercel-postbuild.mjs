/**
 * Creates the Vercel Build Output API v3 structure from the TanStack Start build.
 * Docs: https://vercel.com/docs/build-output-api/v3
 *
 * Output layout:
 *   .vercel/output/config.json          — routes config
 *   .vercel/output/static/              — static assets (from dist/client)
 *   .vercel/output/functions/index.func — Node.js SSR function
 */

import { cpSync, mkdirSync, writeFileSync, readdirSync } from "fs";
import { resolve, join } from "path";

const root = process.cwd();
const out = join(root, ".vercel/output");

console.log("Building Vercel output...");

// 1. Static assets
mkdirSync(join(out, "static"), { recursive: true });
cpSync(join(root, "dist/client"), join(out, "static"), { recursive: true });
console.log("✓ Copied dist/client → .vercel/output/static");

// 2. SSR function
const fnDir = join(out, "functions/index.func");
mkdirSync(fnDir, { recursive: true });
cpSync(join(root, "dist/server"), fnDir, { recursive: true });
console.log("✓ Copied dist/server → .vercel/output/functions/index.func");

// 3. Node.js launcher (bridges Node req/res ↔ WinterCG fetch)
writeFileSync(
  join(fnDir, "index.js"),
  `
import server from "./server.js";

export default async function handler(req, res) {
  const protocol = req.headers["x-forwarded-proto"] || "https";
  const host = req.headers["x-forwarded-host"] || req.headers.host;
  const url = new URL(req.url, protocol + "://" + host);

  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value == null) continue;
    if (Array.isArray(value)) value.forEach((v) => headers.append(key, v));
    else headers.set(key, value);
  }

  const hasBody = req.method !== "GET" && req.method !== "HEAD";
  const body = hasBody
    ? await new Promise((resolve) => {
        const chunks = [];
        req.on("data", (c) => chunks.push(c));
        req.on("end", () => resolve(Buffer.concat(chunks)));
      })
    : undefined;

  const request = new Request(url.toString(), { method: req.method, headers, body });
  const response = await server.fetch(request);

  res.statusCode = response.status;
  for (const [key, value] of response.headers.entries()) {
    res.setHeader(key, value);
  }
  if (response.body) {
    const reader = response.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(value);
    }
  }
  res.end();
}
`.trimStart()
);
console.log("✓ Created index.js launcher");

// 4. Function runtime config
writeFileSync(
  join(fnDir, ".vc-config.json"),
  JSON.stringify(
    {
      runtime: "nodejs20.x",
      handler: "index.js",
      launcherType: "Nodejs",
      supportsResponseStreaming: true,
    },
    null,
    2
  )
);
console.log("✓ Created .vc-config.json");

// 5. Vercel output config with routes
writeFileSync(
  join(out, "config.json"),
  JSON.stringify(
    {
      version: 3,
      routes: [
        // Static assets pass through
        { src: "^/assets/(.*)$", dest: "/assets/$1" },
        // Everything else → SSR function
        { src: "^/(.*)$", dest: "/index" },
      ],
    },
    null,
    2
  )
);
console.log("✓ Created config.json");
console.log("\n✅ .vercel/output ready for deployment");

// Vercel Edge Function — proxies all non-static requests to the TanStack Start SSR handler
import server from "../dist/server/server.js";

export const config = { runtime: "edge" };

export default function handler(request) {
  return server.fetch(request);
}

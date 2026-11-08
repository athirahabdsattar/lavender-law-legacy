// DEGUP Social Studio relay: a Cloudflare Worker that forwards posts to LinkedIn and TikTok.
// Those APIs don't accept calls straight from a web page (no CORS), so the studio sends them here.
//
// Setup: deploy this as a Cloudflare Worker and add a secret named RELAY_SECRET.
// The studio sends that secret with every request; anything without it is refused.
// Nothing is stored; requests are passed through and the response is returned.

// Hosts the relay will send API calls (any method) to.
const API_HOSTS = ["api.linkedin.com", "www.linkedin.com", "open.tiktokapis.com"];
// LinkedIn image upload URLs live on these hosts too.
const UPLOAD_HOST_SUFFIXES = [".linkedin.com", ".licdn.com"];
// Headers passed through to the platform.
const FORWARD_HEADERS = [
  "authorization",
  "content-type",
  "linkedin-version",
  "x-restli-protocol-version",
];

function cors(origin) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, OPTIONS",
    "Access-Control-Allow-Headers": [...FORWARD_HEADERS, "x-relay-secret"].join(", "),
    "Access-Control-Expose-Headers": "x-restli-id, x-linkedin-id",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

function isAllowed(target, method) {
  if (target.protocol !== "https:") return false;
  if (API_HOSTS.includes(target.hostname)) return true;
  if (UPLOAD_HOST_SUFFIXES.some((s) => target.hostname.endsWith(s))) return true;
  // Plain downloads (your own public image/video URL, e.g. for LinkedIn image uploads).
  return method === "GET";
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    if (request.method === "OPTIONS")
      return new Response(null, { status: 204, headers: cors(origin) });

    const reply = (status, message) =>
      new Response(JSON.stringify({ message }), {
        status,
        headers: { ...cors(origin), "Content-Type": "application/json" },
      });

    if (!env.RELAY_SECRET) return reply(500, "RELAY_SECRET is not set on this worker.");
    if (request.headers.get("x-relay-secret") !== env.RELAY_SECRET)
      return reply(401, "Wrong relay secret.");

    let target;
    try {
      target = new URL(new URL(request.url).searchParams.get("url") || "");
    } catch {
      return reply(400, "Missing or invalid ?url=");
    }
    if (!isAllowed(target, request.method))
      return reply(403, `Relay won't forward ${request.method} to ${target.hostname}.`);

    const headers = new Headers();
    for (const name of FORWARD_HEADERS) {
      const value = request.headers.get(name);
      if (value) headers.set(name, value);
    }
    const upstream = await fetch(target.toString(), {
      method: request.method,
      headers,
      body: ["GET", "HEAD"].includes(request.method) ? undefined : await request.arrayBuffer(),
      redirect: "follow",
    });

    const out = new Headers(cors(origin));
    for (const name of ["content-type", "x-restli-id", "x-linkedin-id"]) {
      const value = upstream.headers.get(name);
      if (value) out.set(name, value);
    }
    return new Response(upstream.body, { status: upstream.status, headers: out });
  },
};

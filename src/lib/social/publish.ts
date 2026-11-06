// Browser-side publishing to the official platform APIs.
// The site is statically hosted (no server), so tokens live only in this browser's localStorage
// and requests go straight from the browser to each platform.

import type { MediaType, PlatformId } from "./platforms";

export type Credentials = {
  graphVersion: string;
  facebookPageId: string;
  facebookPageToken: string;
  instagramUserId: string;
  instagramToken: string;
  threadsUserId: string;
  threadsToken: string;
  tiktokToken: string;
};

export const EMPTY_CREDENTIALS: Credentials = {
  graphVersion: "v23.0",
  facebookPageId: "",
  facebookPageToken: "",
  instagramUserId: "",
  instagramToken: "",
  threadsUserId: "",
  threadsToken: "",
  tiktokToken: "",
};

export function isConnected(id: PlatformId, c: Credentials) {
  switch (id) {
    case "facebook":
      return Boolean(c.facebookPageId && c.facebookPageToken);
    case "instagram":
      return Boolean(c.instagramUserId && c.instagramToken);
    case "threads":
      return Boolean(c.threadsUserId && c.threadsToken);
    case "tiktok":
      return Boolean(c.tiktokToken);
  }
}

export type PublishRequest = {
  caption: string;
  mediaType: MediaType;
  mediaUrl: string;
  link: string;
};

export type PublishResult = { ok: true; id: string; note?: string } | { ok: false; error: string };

type GraphResponse = {
  id?: string;
  post_id?: string;
  error?: { message?: string };
  [field: string]: unknown;
};

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function form(url: string, params: Record<string, string>): Promise<GraphResponse> {
  const body = new URLSearchParams(Object.entries(params).filter(([, v]) => v !== ""));
  const res = await fetch(url, { method: "POST", body });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.error) throw new Error(json.error?.message ?? `HTTP ${res.status}`);
  return json;
}

async function getJson(url: string): Promise<GraphResponse> {
  const res = await fetch(url);
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.error) throw new Error(json.error?.message ?? `HTTP ${res.status}`);
  return json;
}

async function waitUntilReady(statusUrl: string, field: string, done: string[], failed: string[]) {
  for (let i = 0; i < 40; i++) {
    const json = await getJson(statusUrl);
    const status = String(json[field] ?? "");
    if (done.includes(status)) return;
    if (failed.includes(status)) throw new Error(`Media processing failed (${status}).`);
    await sleep(3000);
  }
  throw new Error("Media processing timed out. Check the post in the app later.");
}

async function publishFacebook(c: Credentials, r: PublishRequest): Promise<PublishResult> {
  const base = `https://graph.facebook.com/${c.graphVersion}/${c.facebookPageId}`;
  const token = c.facebookPageToken;
  if (r.mediaType === "image") {
    const json = await form(`${base}/photos`, {
      url: r.mediaUrl,
      message: r.caption,
      access_token: token,
    });
    return { ok: true, id: json.post_id ?? json.id ?? "" };
  }
  if (r.mediaType === "video") {
    const json = await form(`${base}/videos`, {
      file_url: r.mediaUrl,
      description: r.caption,
      access_token: token,
    });
    return { ok: true, id: json.id ?? "", note: "The video is processing on Facebook." };
  }
  const json = await form(`${base}/feed`, {
    message: r.caption,
    link: r.link,
    access_token: token,
  });
  return { ok: true, id: json.id ?? "" };
}

async function publishInstagram(c: Credentials, r: PublishRequest): Promise<PublishResult> {
  const base = `https://graph.facebook.com/${c.graphVersion}`;
  const token = c.instagramToken;
  const params: Record<string, string> = { caption: r.caption, access_token: token };
  if (r.mediaType === "video") {
    params["media_type"] = "REELS";
    params["video_url"] = r.mediaUrl;
  } else {
    params["image_url"] = r.mediaUrl;
  }
  const container = await form(`${base}/${c.instagramUserId}/media`, params);
  if (r.mediaType === "video") {
    await waitUntilReady(
      `${base}/${container.id}?fields=status_code&access_token=${encodeURIComponent(token)}`,
      "status_code",
      ["FINISHED"],
      ["ERROR", "EXPIRED"],
    );
  }
  const published = await form(`${base}/${c.instagramUserId}/media_publish`, {
    creation_id: container.id ?? "",
    access_token: token,
  });
  return { ok: true, id: published.id ?? "" };
}

async function publishThreads(c: Credentials, r: PublishRequest): Promise<PublishResult> {
  const base = "https://graph.threads.net/v1.0";
  const token = c.threadsToken;
  const params: Record<string, string> = { text: r.caption, access_token: token };
  if (r.mediaType === "image") {
    params["media_type"] = "IMAGE";
    params["image_url"] = r.mediaUrl;
  } else if (r.mediaType === "video") {
    params["media_type"] = "VIDEO";
    params["video_url"] = r.mediaUrl;
  } else {
    params["media_type"] = "TEXT";
  }
  const container = await form(`${base}/${c.threadsUserId}/threads`, params);
  if (r.mediaType !== "none") {
    await waitUntilReady(
      `${base}/${container.id}?fields=status&access_token=${encodeURIComponent(token)}`,
      "status",
      ["FINISHED"],
      ["ERROR", "EXPIRED"],
    );
  }
  const published = await form(`${base}/${c.threadsUserId}/threads_publish`, {
    creation_id: container.id ?? "",
    access_token: token,
  });
  return { ok: true, id: published.id ?? "" };
}

async function publishTikTok(c: Credentials, r: PublishRequest): Promise<PublishResult> {
  const headers = {
    Authorization: `Bearer ${c.tiktokToken}`,
    "Content-Type": "application/json; charset=UTF-8",
  };
  // TikTok requires the privacy level to be one the creator account allows.
  // Unaudited apps can only post SELF_ONLY (private); the post can be made public in the app.
  const infoRes = await fetch("https://open.tiktokapis.com/v2/post/publish/creator_info/query/", {
    method: "POST",
    headers,
  });
  const info = await infoRes.json();
  if (info.error?.code && info.error.code !== "ok")
    throw new Error(info.error.message || info.error.code);
  const options: string[] = info.data?.privacy_level_options ?? ["SELF_ONLY"];
  const privacy = options.includes("PUBLIC_TO_EVERYONE") ? "PUBLIC_TO_EVERYONE" : options[0];

  const res = await fetch("https://open.tiktokapis.com/v2/post/publish/video/init/", {
    method: "POST",
    headers,
    body: JSON.stringify({
      post_info: {
        title: r.caption,
        privacy_level: privacy,
        disable_comment: false,
        disable_duet: false,
        disable_stitch: false,
      },
      source_info: { source: "PULL_FROM_URL", video_url: r.mediaUrl },
    }),
  });
  const json = await res.json();
  if (json.error?.code && json.error.code !== "ok")
    throw new Error(json.error.message || json.error.code);
  return {
    ok: true,
    id: json.data?.publish_id ?? "",
    ...(privacy === "SELF_ONLY"
      ? {
          note: "Posted as private (your TikTok app isn't audited yet). Make it public in the TikTok app.",
        }
      : {}),
  };
}

const PUBLISHERS: Record<
  PlatformId,
  (c: Credentials, r: PublishRequest) => Promise<PublishResult>
> = {
  facebook: publishFacebook,
  instagram: publishInstagram,
  threads: publishThreads,
  tiktok: publishTikTok,
};

export async function publishTo(
  id: PlatformId,
  c: Credentials,
  r: PublishRequest,
): Promise<PublishResult> {
  try {
    return await PUBLISHERS[id](c, r);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (err instanceof TypeError) {
      return {
        ok: false,
        error: `The browser couldn't reach ${id} (${message}). This is usually CORS or a network block. Use “Copy & open” instead.`,
      };
    }
    return { ok: false, error: message };
  }
}

export const UPLOAD_URLS: Record<PlatformId, string> = {
  instagram: "https://www.instagram.com/",
  facebook: "https://www.facebook.com/",
  tiktok: "https://www.tiktok.com/tiktokstudio/upload",
  threads: "https://www.threads.net/",
};

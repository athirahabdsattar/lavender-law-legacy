import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  ExternalLink,
  KeyRound,
  Loader2,
  RotateCcw,
  Send,
  ShieldAlert,
  Sparkles,
  TrendingUp,
  Rocket,
  Wand2,
  TriangleAlert,
  XCircle,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { AutoPost, EMPTY_AUTOPOST, type AutoPostState } from "@/components/studio/AutoPost";
import { EMPTY_REPURPOSE, Repurpose, type RepurposeState } from "@/components/studio/Repurpose";
import type { OutputFormat, RepurposeResult } from "@/lib/social/repurpose";
import {
  AUDIENCES,
  AUDIENCE_ORDER,
  PLATFORMS,
  PLATFORM_ORDER,
  captionLength,
  parseHashtags,
  tailorCaption,
  validate,
  type AudienceId,
  type MediaType,
  type PlatformId,
} from "@/lib/social/platforms";
import {
  EMPTY_CREDENTIALS,
  manualPostUrl,
  isConnected,
  publishTo,
  type Credentials,
  type PublishResult,
} from "@/lib/social/publish";
import { COMPLIANCE, HASHTAG_SETS, KPIS, PILLARS, ROADMAP, SCHEDULE } from "@/lib/social/growth";

export const Route = createFileRoute("/studio")({
  component: Studio,
  head: () => ({
    meta: [
      { title: "DEGUP Social Studio" },
      {
        name: "description",
        content:
          "Generate once, tailor per audience, and post to Instagram, Facebook, TikTok, Threads and LinkedIn.",
      },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
});

type Draft = {
  audience: AudienceId;
  hook: string;
  body: string;
  link: string;
  hashtags: string;
  includeCta: boolean;
  mediaType: MediaType;
  mediaUrl: string;
  enabled: Record<PlatformId, boolean>;
  overrides: Partial<Record<PlatformId, string>>;
};

type HistoryEntry = {
  at: string;
  audience: AudienceId;
  preview: string;
  results: Partial<Record<PlatformId, PublishResult>>;
};

const EMPTY_DRAFT: Draft = {
  audience: "patients",
  hook: "",
  body: "",
  link: "",
  hashtags: "",
  includeCta: true,
  mediaType: "image",
  mediaUrl: "",
  enabled: { instagram: true, facebook: true, tiktok: false, threads: true, linkedin: true },
  overrides: {},
};

const STORAGE = {
  draft: "degup-studio:draft",
  creds: "degup-studio:creds",
  history: "degup-studio:history",
  repurpose: "degup-studio:repurpose",
  autopost: "degup-studio:autopost",
};

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? { ...fallback, ...JSON.parse(raw) } : fallback;
  } catch {
    return fallback;
  }
}

function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable (private mode); state stays in memory */
  }
}

function usePersisted<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    setValue(load(key, fallback));
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  useEffect(() => {
    if (ready) save(key, value);
  }, [key, value, ready]);
  return [value, setValue] as const;
}

const fieldClass =
  "w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";
const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground";

function Studio() {
  const [tab, setTab] = useState("autopost");
  return (
    <div className="min-h-screen bg-secondary/40">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
        <div className="container-tight flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="rounded-lg p-2 text-muted-foreground transition hover:bg-accent hover:text-foreground"
              aria-label="Back to site"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <p className="text-lg font-extrabold leading-none tracking-tight gradient-text">
                DEGUP Social Studio
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Generate once and post to Instagram, Facebook, TikTok, Threads and LinkedIn
              </p>
            </div>
          </div>
          <a
            href="https://www.instagram.com/degup.my/"
            target="_blank"
            rel="noreferrer"
            className="hidden rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-primary transition hover:bg-accent sm:inline-flex"
          >
            @degup.my
          </a>
        </div>
      </header>

      <main className="container-tight py-8">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-6 h-auto flex-wrap justify-start gap-1 rounded-xl bg-background p-1 shadow-sm">
            <TabsTrigger value="autopost" className="gap-2 rounded-lg px-4 py-2">
              <Rocket className="h-4 w-4" />
              Auto-post
            </TabsTrigger>
            <TabsTrigger value="compose" className="gap-2 rounded-lg px-4 py-2">
              <Send className="h-4 w-4" />
              Compose
            </TabsTrigger>
            <TabsTrigger value="repurpose" className="gap-2 rounded-lg px-4 py-2">
              <Wand2 className="h-4 w-4" />
              Repurpose content
            </TabsTrigger>
            <TabsTrigger value="grow" className="gap-2 rounded-lg px-4 py-2">
              <TrendingUp className="h-4 w-4" />
              Grow @degup.my
            </TabsTrigger>
            <TabsTrigger value="accounts" className="gap-2 rounded-lg px-4 py-2">
              <KeyRound className="h-4 w-4" />
              Accounts
            </TabsTrigger>
          </TabsList>
          <StudioBody goTo={setTab} />
        </Tabs>
      </main>
    </div>
  );
}

function StudioBody({ goTo }: { goTo: (tab: string) => void }) {
  const [draft, setDraft] = usePersisted<Draft>(STORAGE.draft, EMPTY_DRAFT);
  const [creds, setCreds] = usePersisted<Credentials>(STORAGE.creds, EMPTY_CREDENTIALS);
  const [history, setHistory] = usePersisted<{ items: HistoryEntry[] }>(STORAGE.history, {
    items: [],
  });
  const [autopost, setAutopost] = usePersisted<AutoPostState>(STORAGE.autopost, EMPTY_AUTOPOST);
  const addHistory = (e: HistoryEntry) =>
    setHistory((h) => ({ items: [e, ...h.items].slice(0, 30) }));
  const [repurpose, setRepurpose] = usePersisted<RepurposeState>(
    STORAGE.repurpose,
    EMPTY_REPURPOSE,
  );

  function sendToComposer(
    result: RepurposeResult,
    formats: OutputFormat[],
    audience: Draft["audience"],
  ) {
    const overrides: Draft["overrides"] = {};
    for (const o of result.outputs) {
      const platform = formats.find((f) => f.id === o.format_id)?.platform;
      if (platform && !overrides[platform]) overrides[platform] = o.text;
    }
    setDraft((d) => ({
      ...d,
      audience,
      hook: result.hook,
      body: result.body,
      hashtags: result.hashtags.join(" "),
      overrides,
      enabled: Object.fromEntries(
        PLATFORM_ORDER.map((id) => [id, overrides[id] !== undefined || d.enabled[id]]),
      ) as Draft["enabled"],
    }));
    goTo("compose");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <>
      <TabsContent value="autopost">
        <AutoPost state={autopost} setState={setAutopost} creds={creds} onPublished={addHistory} />
      </TabsContent>
      <TabsContent value="compose">
        <Composer
          draft={draft}
          setDraft={setDraft}
          creds={creds}
          history={history.items}
          onPublished={(e) => setHistory((h) => ({ items: [e, ...h.items].slice(0, 30) }))}
        />
      </TabsContent>
      <TabsContent value="repurpose">
        <Repurpose
          state={repurpose}
          setState={setRepurpose}
          apiKey={creds.anthropicKey}
          onSendToComposer={sendToComposer}
        />
      </TabsContent>
      <TabsContent value="grow">
        <GrowthPlaybook onUseHashtags={(tags) => setDraft((d) => ({ ...d, hashtags: tags }))} />
      </TabsContent>
      <TabsContent value="accounts">
        <Accounts creds={creds} setCreds={setCreds} />
      </TabsContent>
    </>
  );
}

/* ---------------------------------- Compose --------------------------------- */

function Composer({
  draft,
  setDraft,
  creds,
  history,
  onPublished,
}: {
  draft: Draft;
  setDraft: React.Dispatch<React.SetStateAction<Draft>>;
  creds: Credentials;
  history: HistoryEntry[];
  onPublished: (e: HistoryEntry) => void;
}) {
  const [results, setResults] = useState<Partial<Record<PlatformId, PublishResult | "pending">>>(
    {},
  );
  const [copied, setCopied] = useState<PlatformId | null>(null);
  const update = <K extends keyof Draft>(k: K, v: Draft[K]) => setDraft((d) => ({ ...d, [k]: v }));

  const input = useMemo(
    () => ({
      hook: draft.hook,
      body: draft.body,
      link: draft.link,
      hashtags: parseHashtags(draft.hashtags),
      audience: draft.audience,
      includeCta: draft.includeCta,
    }),
    [draft.hook, draft.body, draft.link, draft.hashtags, draft.audience, draft.includeCta],
  );

  const captions = useMemo(() => {
    const out = {} as Record<PlatformId, string>;
    for (const id of PLATFORM_ORDER) out[id] = draft.overrides[id] ?? tailorCaption(id, input);
    return out;
  }, [input, draft.overrides]);

  const issues = useMemo(() => {
    const out = {} as Record<PlatformId, ReturnType<typeof validate>>;
    for (const id of PLATFORM_ORDER)
      out[id] = validate(id, captions[id], draft.mediaType, draft.mediaUrl);
    return out;
  }, [captions, draft.mediaType, draft.mediaUrl]);

  const selected = PLATFORM_ORDER.filter((id) => draft.enabled[id]);
  const blocked = selected.filter((id) => issues[id].some((i) => i.level === "error"));
  const notConnected = selected.filter((id) => !isConnected(id, creds));
  const publishing = Object.values(results).includes("pending");
  const canPublish =
    selected.length > 0 && blocked.length === 0 && notConnected.length === 0 && !publishing;

  async function publishAll() {
    setResults(Object.fromEntries(selected.map((id) => [id, "pending"])));
    const req = {
      mediaType: draft.mediaType,
      mediaUrl: draft.mediaUrl.trim(),
      link: draft.link.trim(),
    };
    const settled = await Promise.all(
      selected.map(async (id) => {
        const r = await publishTo(id, creds, { ...req, caption: captions[id] });
        setResults((prev) => ({ ...prev, [id]: r }));
        return [id, r] as const;
      }),
    );
    onPublished({
      at: new Date().toISOString(),
      audience: draft.audience,
      preview: (draft.hook || draft.body).slice(0, 90),
      results: Object.fromEntries(settled),
    });
  }

  async function copyAndOpen(id: PlatformId) {
    try {
      await navigator.clipboard.writeText(captions[id]);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      /* clipboard blocked; the caption is still selectable in the box */
    }
    window.open(manualPostUrl(id, captions[id]), "_blank", "noopener");
  }

  const audience = AUDIENCES[draft.audience];

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Inputs */}
      <section className="space-y-5 rounded-2xl border border-border bg-background p-5 shadow-sm lg:col-span-5 lg:self-start">
        <div>
          <span className={labelClass}>Who is this post for?</span>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {AUDIENCE_ORDER.map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => update("audience", id)}
                className={`rounded-xl border px-3 py-2.5 text-left text-sm transition ${
                  draft.audience === id
                    ? "border-primary bg-primary/10 font-semibold text-primary"
                    : "border-border hover:border-primary/40"
                }`}
              >
                {AUDIENCES[id].label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">{audience.description}</p>
        </div>

        <div>
          <label className={labelClass} htmlFor="hook">
            Hook (first line)
          </label>
          <input
            id="hook"
            className={fieldClass}
            value={draft.hook}
            onChange={(e) => update("hook", e.target.value)}
            placeholder="Susah cari slot dialisis bila balik kampung? 😟"
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="body">
            Main message
          </label>
          <textarea
            id="body"
            rows={7}
            className={fieldClass}
            value={draft.body}
            onChange={(e) => update("body", e.target.value)}
            placeholder={
              "Separate paragraphs with a blank line.\nTikTok and Threads get the first sentence of each paragraph."
            }
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="link">
              Link (optional)
            </label>
            <input
              id="link"
              className={fieldClass}
              value={draft.link}
              onChange={(e) => update("link", e.target.value)}
              placeholder="https://degup.my"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="tags">
              Your hashtags
            </label>
            <input
              id="tags"
              className={fieldClass}
              value={draft.hashtags}
              onChange={(e) => update("hashtags", e.target.value)}
              placeholder="#dialisiskelantan"
            />
          </div>
        </div>

        <label className="flex items-center justify-between gap-4 rounded-xl bg-secondary/60 px-3.5 py-3 text-sm">
          <span>
            <span className="font-semibold">Add an audience-specific call to action</span>
            <span className="block text-xs text-muted-foreground">
              Uses a different CTA for each platform
            </span>
          </span>
          <Switch checked={draft.includeCta} onCheckedChange={(v) => update("includeCta", v)} />
        </label>

        <div>
          <span className={labelClass}>Media</span>
          <div className="mb-2 flex gap-2">
            {(["image", "video", "none"] as MediaType[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => update("mediaType", m)}
                className={`flex-1 rounded-xl border px-3 py-2 text-sm capitalize transition ${
                  draft.mediaType === m
                    ? "border-primary bg-primary/10 font-semibold text-primary"
                    : "border-border hover:border-primary/40"
                }`}
              >
                {m === "none" ? "Text only" : m}
              </button>
            ))}
          </div>
          {draft.mediaType !== "none" && (
            <>
              <input
                className={fieldClass}
                value={draft.mediaUrl}
                onChange={(e) => update("mediaUrl", e.target.value)}
                placeholder="https://… public URL of the .jpg or .mp4"
              />
              <p className="mt-1.5 text-xs text-muted-foreground">
                The platforms download media from a public URL. Upload it to Google Cloud Storage,
                Supabase Storage, S3 or similar first. Use a 9:16 MP4 for Reels and TikTok.
              </p>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={() => setDraft(EMPTY_DRAFT)}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-destructive"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Clear draft
        </button>
      </section>

      {/* Per-platform previews */}
      <section className="space-y-4 lg:col-span-7">
        <div className="grid gap-4 md:grid-cols-2">
          {PLATFORM_ORDER.map((id) => (
            <PlatformCard
              key={id}
              id={id}
              enabled={Boolean(draft.enabled[id])}
              onToggle={(v) => setDraft((d) => ({ ...d, enabled: { ...d.enabled, [id]: v } }))}
              caption={captions[id]}
              overridden={draft.overrides[id] !== undefined}
              onEdit={(text) =>
                setDraft((d) => ({ ...d, overrides: { ...d.overrides, [id]: text } }))
              }
              onReset={() =>
                setDraft((d) => {
                  const { [id]: _drop, ...rest } = d.overrides;
                  return { ...d, overrides: rest };
                })
              }
              issues={issues[id]}
              connected={isConnected(id, creds)}
              result={results[id]}
              copied={copied === id}
              onCopy={() => copyAndOpen(id)}
            />
          ))}
        </div>

        <div className="sticky bottom-4 rounded-2xl border border-border bg-background/95 p-4 shadow-xl shadow-primary/10 backdrop-blur">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm">
              {selected.length === 0 && (
                <p className="text-muted-foreground">Turn on at least one platform.</p>
              )}
              {blocked.length > 0 && (
                <p className="text-destructive">
                  Fix the issues on {blocked.map((id) => PLATFORMS[id].name).join(", ")}.
                </p>
              )}
              {blocked.length === 0 && notConnected.length > 0 && (
                <p className="text-muted-foreground">
                  {notConnected.map((id) => PLATFORMS[id].name).join(", ")}{" "}
                  {notConnected.length > 1 ? "aren't" : "isn't"} connected. Add tokens under
                  Accounts, or use “Open & post”.
                </p>
              )}
              {canPublish && (
                <p className="text-muted-foreground">
                  Ready to post to {selected.length} platform{selected.length > 1 ? "s" : ""} at
                  once.
                </p>
              )}
            </div>
            <button
              type="button"
              disabled={!canPublish}
              onClick={publishAll}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {publishing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              Publish to {selected.length || "…"} platform{selected.length === 1 ? "" : "s"}
            </button>
          </div>
        </div>

        {history.length > 0 && (
          <div className="rounded-2xl border border-border bg-background p-5 shadow-sm">
            <h3 className="mb-3 text-sm font-bold">Recent posts (this browser)</h3>
            <ul className="divide-y divide-border text-sm">
              {history.slice(0, 8).map((h) => (
                <li key={h.at} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
                  <span className="min-w-0 flex-1 truncate">{h.preview || "(media only)"}</span>
                  <span className="flex gap-1.5">
                    {(Object.keys(h.results) as PlatformId[]).map((id) => (
                      <span
                        key={id}
                        title={
                          h.results[id]?.ok
                            ? "Published"
                            : (h.results[id] as { error: string }).error
                        }
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${h.results[id]?.ok ? "bg-emerald-500/15 text-emerald-700" : "bg-destructive/10 text-destructive"}`}
                      >
                        {PLATFORMS[id].name}
                      </span>
                    ))}
                  </span>
                  <span className="w-full text-xs text-muted-foreground sm:w-auto">
                    {new Date(h.at).toLocaleString("en-MY")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}

function PlatformCard(props: {
  id: PlatformId;
  enabled: boolean;
  onToggle: (v: boolean) => void;
  caption: string;
  overridden: boolean;
  onEdit: (t: string) => void;
  onReset: () => void;
  issues: ReturnType<typeof validate>;
  connected: boolean;
  result: PublishResult | "pending" | undefined;
  copied: boolean;
  onCopy: () => void;
}) {
  const p = PLATFORMS[props.id];
  const len = captionLength(props.caption);
  const pct = Math.min(100, (len / p.maxChars) * 100);
  return (
    <article
      className={`flex flex-col rounded-2xl border bg-background p-4 shadow-sm transition ${props.enabled ? "border-border" : "border-dashed border-border opacity-60"}`}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.color }} />
          <h3 className="text-sm font-bold">{p.name}</h3>
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${props.connected ? "bg-emerald-500/15 text-emerald-700" : "bg-muted text-muted-foreground"}`}
          >
            {props.connected ? "Connected" : "Manual"}
          </span>
        </div>
        <Switch
          checked={props.enabled}
          onCheckedChange={props.onToggle}
          aria-label={`Post to ${p.name}`}
        />
      </div>

      <textarea
        rows={8}
        value={props.caption}
        onChange={(e) => props.onEdit(e.target.value)}
        className="w-full flex-1 resize-y rounded-xl border border-input bg-secondary/40 p-3 text-[13px] leading-relaxed outline-none focus:border-primary"
        placeholder="Your tailored caption appears here."
      />

      <div className="mt-2 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-20 overflow-hidden rounded-full bg-muted">
            <div
              className={`h-full rounded-full ${len > p.maxChars ? "bg-destructive" : "bg-primary"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <span
            className={
              len > p.maxChars ? "font-semibold text-destructive" : "text-muted-foreground"
            }
          >
            {len.toLocaleString()}/{p.maxChars.toLocaleString()}
          </span>
        </div>
        {props.overridden ? (
          <button
            type="button"
            onClick={props.onReset}
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            <RotateCcw className="h-3 w-3" /> Auto-tailor
          </button>
        ) : (
          <span className="inline-flex items-center gap-1 text-muted-foreground">
            <Sparkles className="h-3 w-3" /> Auto-tailored
          </span>
        )}
      </div>

      {props.issues.length > 0 && (
        <ul className="mt-3 space-y-1">
          {props.issues.map((i) => (
            <li
              key={i.message}
              className={`flex gap-1.5 text-xs ${i.level === "error" ? "text-destructive" : "text-amber-700"}`}
            >
              {i.level === "error" ? (
                <XCircle className="mt-px h-3.5 w-3.5 shrink-0" />
              ) : (
                <TriangleAlert className="mt-px h-3.5 w-3.5 shrink-0" />
              )}
              {i.message}
            </li>
          ))}
        </ul>
      )}

      {props.result && (
        <div className="mt-3 rounded-lg bg-secondary/60 p-2.5 text-xs">
          {props.result === "pending" ? (
            <span className="inline-flex items-center gap-1.5">
              <Loader2 className="h-3.5 w-3.5 animate-spin" /> Publishing…
            </span>
          ) : props.result.ok ? (
            <span className="inline-flex items-start gap-1.5 text-emerald-700">
              <CheckCircle2 className="mt-px h-3.5 w-3.5 shrink-0" />
              Published{props.result.id ? ` (id ${props.result.id})` : ""}. {props.result.note}
            </span>
          ) : (
            <span className="inline-flex items-start gap-1.5 text-destructive">
              <XCircle className="mt-px h-3.5 w-3.5 shrink-0" />
              {props.result.error}
            </span>
          )}
        </div>
      )}

      <button
        type="button"
        onClick={props.onCopy}
        className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-semibold transition hover:bg-accent"
      >
        {props.copied ? (
          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
        ) : (
          <Copy className="h-3.5 w-3.5" />
        )}
        {props.copied ? "Copied!" : "Open & post"} <ExternalLink className="h-3 w-3 opacity-60" />
      </button>

      <details className="mt-3 text-xs text-muted-foreground">
        <summary className="cursor-pointer font-medium text-foreground/80">{p.name} tips</summary>
        <ul className="mt-2 list-disc space-y-1 pl-4">
          {p.tips.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>
      </details>
    </article>
  );
}

/* ---------------------------------- Accounts -------------------------------- */

function Accounts({
  creds,
  setCreds,
}: {
  creds: Credentials;
  setCreds: React.Dispatch<React.SetStateAction<Credentials>>;
}) {
  const set = (k: keyof Credentials) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setCreds((c) => ({ ...c, [k]: e.target.value.trim() }));
  const groups: {
    id: PlatformId;
    title: string;
    fields: { key: keyof Credentials; label: string; secret?: boolean }[];
    how: string[];
  }[] = [
    {
      id: "facebook",
      title: "Facebook Page",
      fields: [
        { key: "facebookPageId", label: "Page ID" },
        { key: "facebookPageToken", label: "Page access token", secret: true },
      ],
      how: [
        "Create an app at developers.facebook.com (type: Business) and add the Facebook Login for Business product.",
        "In Graph API Explorer, grant pages_manage_posts, pages_read_engagement and pages_show_list, then call /me/accounts.",
        "Copy the DEGUP Page's id and access_token. For a long-lived token, exchange a long-lived user token first.",
      ],
    },
    {
      id: "instagram",
      title: "Instagram (@degup.my)",
      fields: [
        { key: "instagramUserId", label: "Instagram business account ID" },
        { key: "instagramToken", label: "Access token", secret: true },
      ],
      how: [
        "@degup.my must be a Professional account linked to the DEGUP Facebook Page.",
        "Same app: add the instagram_basic and instagram_content_publish permissions.",
        "Call /{page-id}?fields=instagram_business_account to get the ID. The Page token from above works here.",
        "Instagram allows 50 API posts per 24 hours. Images must be JPEG.",
      ],
    },
    {
      id: "threads",
      title: "Threads",
      fields: [
        { key: "threadsUserId", label: "Threads user ID" },
        { key: "threadsToken", label: "Threads access token", secret: true },
      ],
      how: [
        "Add the Threads API use case to your Meta app with the threads_basic and threads_content_publish scopes.",
        "Add @degup.my as a Threads tester, accept the invite in Threads, then generate a token.",
        "GET graph.threads.net/v1.0/me returns your user ID.",
      ],
    },
    {
      id: "tiktok",
      title: "TikTok",
      fields: [{ key: "tiktokToken", label: "User access token (video.publish)", secret: true }],
      how: [
        "Create an app at developers.tiktok.com and add Content Posting API with the Direct Post option.",
        "Verify the domain that hosts your videos (required for PULL_FROM_URL).",
        "Until TikTok audits the app, posts go up as private and you make them public in the app.",
        "TikTok blocks direct browser calls, so add your relay below for automatic posting. Without it, use “Open & post”.",
      ],
    },
    {
      id: "linkedin",
      title: "LinkedIn",
      fields: [
        { key: "linkedinToken", label: "Access token (w_member_social)", secret: true },
        { key: "linkedinAuthor", label: "Author URN (optional, e.g. urn:li:organization:123)" },
        { key: "linkedinVersion", label: "LinkedIn API version (YYYYMM)" },
      ],
      how: [
        "Create an app at linkedin.com/developers and add the “Share on LinkedIn” and “Sign In with LinkedIn using OpenID Connect” products.",
        "Under Auth → OAuth 2.0 tools, generate a token with the openid, profile and w_member_social scopes. It lasts 60 days.",
        "Leave Author URN empty to post as yourself. Posting as the DEGUP company page needs the Community Management API (LinkedIn must approve it) and urn:li:organization:<page id>.",
        "LinkedIn blocks direct browser calls, so automatic posting needs the relay below. Without it, “Open & post” opens LinkedIn with your post already typed in.",
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm">
        <ShieldAlert className="h-5 w-5 shrink-0 text-amber-700" />
        <p>
          Tokens are saved <strong>only in this browser</strong> (localStorage) and sent straight to
          Meta, or through your own relay to LinkedIn and TikTok. They never go to this website's
          server, and it doesn't have one. Use this on your own device only, and click “Disconnect”
          on shared computers.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {groups.map((g) => (
          <section
            key={g.id}
            className="rounded-2xl border border-border bg-background p-5 shadow-sm"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-bold">{g.title}</h3>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${isConnected(g.id, creds) ? "bg-emerald-500/15 text-emerald-700" : "bg-muted text-muted-foreground"}`}
              >
                {isConnected(g.id, creds) ? "Connected" : "Not connected"}
              </span>
            </div>
            <div className="space-y-3">
              {g.fields.map((f) => (
                <div key={f.key}>
                  <label className={labelClass} htmlFor={f.key}>
                    {f.label}
                  </label>
                  <input
                    id={f.key}
                    type={f.secret ? "password" : "text"}
                    autoComplete="off"
                    className={fieldClass}
                    value={creds[f.key]}
                    onChange={set(f.key)}
                  />
                </div>
              ))}
            </div>
            <details className="mt-4 text-xs text-muted-foreground">
              <summary className="cursor-pointer font-medium text-foreground/80">
                How to get these
              </summary>
              <ol className="mt-2 list-decimal space-y-1 pl-4">
                {g.how.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ol>
            </details>
            {isConnected(g.id, creds) && (
              <button
                type="button"
                onClick={() =>
                  setCreds((c) => ({
                    ...c,
                    ...Object.fromEntries(g.fields.map((f) => [f.key, ""])),
                  }))
                }
                className="mt-4 text-xs font-medium text-destructive hover:underline"
              >
                Disconnect
              </button>
            )}
          </section>
        ))}
      </div>

      <section className="rounded-2xl border border-border bg-background p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-bold">Relay for LinkedIn & TikTok</h3>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${creds.relayUrl ? "bg-emerald-500/15 text-emerald-700" : "bg-muted text-muted-foreground"}`}
          >
            {creds.relayUrl ? "Set up" : "Not set up"}
          </span>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          LinkedIn and TikTok don't accept posts sent straight from a web page. A relay is a tiny
          free program you run on your own Cloudflare account. It passes your posts along and
          doesn't store anything.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="relayUrl">
              Relay URL
            </label>
            <input
              id="relayUrl"
              className={fieldClass}
              value={creds.relayUrl}
              onChange={set("relayUrl")}
              placeholder="https://degup-relay.yourname.workers.dev"
            />
          </div>
          <div>
            <label className={labelClass} htmlFor="relaySecret">
              Relay secret
            </label>
            <input
              id="relaySecret"
              type="password"
              autoComplete="off"
              className={fieldClass}
              value={creds.relaySecret}
              onChange={set("relaySecret")}
            />
          </div>
        </div>
        <details className="mt-4 text-xs text-muted-foreground">
          <summary className="cursor-pointer font-medium text-foreground/80">
            How to set it up (about 5 minutes, free)
          </summary>
          <ol className="mt-2 list-decimal space-y-1 pl-4">
            <li>Create a free account at dash.cloudflare.com.</li>
            <li>Workers & Pages → Create → Worker. Name it “degup-relay”, then Deploy.</li>
            <li>
              Edit code, replace everything with the contents of relay/worker.js from this project,
              then Deploy.
            </li>
            <li>
              Settings → Variables and Secrets → add a Secret named RELAY_SECRET with a long random
              password.
            </li>
            <li>Paste the worker's URL and that same password here.</li>
          </ol>
        </details>
      </section>

      <section className="rounded-2xl border border-border bg-background p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-bold">AI repurposing (Anthropic)</h3>
          <span
            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${creds.anthropicKey ? "bg-emerald-500/15 text-emerald-700" : "bg-muted text-muted-foreground"}`}
          >
            {creds.anthropicKey ? "Connected" : "Not connected"}
          </span>
        </div>
        <label className={labelClass} htmlFor="anthropicKey">
          Anthropic API key
        </label>
        <input
          id="anthropicKey"
          type="password"
          autoComplete="off"
          className={fieldClass}
          value={creds.anthropicKey}
          onChange={set("anthropicKey")}
          placeholder="sk-ant-…"
        />
        <details className="mt-4 text-xs text-muted-foreground">
          <summary className="cursor-pointer font-medium text-foreground/80">
            How to get this
          </summary>
          <ol className="mt-2 list-decimal space-y-1 pl-4">
            <li>Sign in at console.anthropic.com and add billing credit (pay as you go).</li>
            <li>Go to API Keys → Create key, name it “DEGUP studio”, and paste it here.</li>
            <li>
              Set a monthly spend limit in the Console. Turning one piece of content into all
              formats usually costs a few cents.
            </li>
          </ol>
        </details>
        {creds.anthropicKey && (
          <button
            type="button"
            onClick={() => setCreds((c) => ({ ...c, anthropicKey: "" }))}
            className="mt-4 text-xs font-medium text-destructive hover:underline"
          >
            Disconnect
          </button>
        )}
      </section>

      <div className="max-w-xs">
        <label className={labelClass} htmlFor="graphVersion">
          Meta Graph API version
        </label>
        <input
          id="graphVersion"
          className={fieldClass}
          value={creds.graphVersion}
          onChange={set("graphVersion")}
        />
      </div>
    </div>
  );
}

/* ---------------------------------- Growth ---------------------------------- */

function GrowthPlaybook({ onUseHashtags }: { onUseHashtags: (tags: string) => void }) {
  const [usedSet, setUsedSet] = useState<string | null>(null);
  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl gradient-band p-7 text-white shadow-lg sm:p-10">
        <div className="aurora -right-10 -top-10 h-64 w-64 bg-white/30" />
        <p className="relative text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
          Instagram growth plan
        </p>
        <h2 className="relative mt-3 max-w-2xl text-balance text-3xl font-extrabold leading-tight sm:text-4xl">
          Grow @degup.my by being the most useful dialysis account in Malaysia.
        </h2>
        <p className="relative mt-4 max-w-2xl text-white/85">
          Niche health accounts don't grow by chasing trends. They grow when patients and families
          save and share posts that solve real problems, and when trusted partners introduce them to
          new followers. Post Reels to be found, carousels to be saved, Stories to build trust, and
          Collab posts to borrow other accounts' audiences.
        </p>
      </section>

      <section>
        <h3 className="mb-4 text-xl font-bold">1. Content pillars</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((p) => (
            <article
              key={p.name}
              className="rounded-2xl border border-border bg-background p-5 shadow-sm"
            >
              <div className="flex items-baseline justify-between gap-2">
                <h4 className="font-bold">{p.name}</h4>
                <span className="text-2xl font-extrabold gradient-text">{p.share}</span>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {p.audience} · {p.format}
              </p>
              <ul className="mt-3 space-y-1.5 text-sm">
                {p.examples.map((e) => (
                  <li key={e} className="border-l-2 border-primary/40 pl-2.5">
                    {e}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-xl font-bold">2. 90-day roadmap</h3>
        <ol className="grid gap-4 md:grid-cols-2">
          {ROADMAP.map((phase, i) => (
            <li
              key={phase.title}
              className="rounded-2xl border border-border bg-background p-5 shadow-sm"
            >
              <div className="mb-3 flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <div>
                  <h4 className="font-bold leading-tight">{phase.title}</h4>
                  <p className="text-xs text-muted-foreground">{phase.weeks}</p>
                </div>
              </div>
              <ul className="list-disc space-y-1.5 pl-5 text-sm">
                {phase.goals.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="mb-4 text-xl font-bold">3. Weekly posting schedule (MYT)</h3>
          <div className="overflow-x-auto rounded-2xl border border-border bg-background shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-secondary/60 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th className="px-4 py-2.5">Day</th>
                  <th className="px-4 py-2.5">Time</th>
                  <th className="px-4 py-2.5">Format</th>
                  <th className="px-4 py-2.5">Pillar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {SCHEDULE.map((s) => (
                  <tr key={s.day}>
                    <td className="px-4 py-2.5 font-semibold">{s.day}</td>
                    <td className="px-4 py-2.5">{s.slot}</td>
                    <td className="px-4 py-2.5">{s.format}</td>
                    <td className="px-4 py-2.5 text-muted-foreground">{s.pillar}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            These are starting points. After 4 weeks, check Insights → Audience → Most active times
            and adjust.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-xl font-bold">4. Hashtag sets</h3>
          <div className="space-y-3">
            {HASHTAG_SETS.map((h) => (
              <div
                key={h.name}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-background p-3.5 shadow-sm"
              >
                <div className="min-w-0">
                  <p className="text-sm font-semibold">{h.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{h.tags}</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onUseHashtags(h.tags);
                    setUsedSet(h.name);
                  }}
                  className="shrink-0 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/20"
                >
                  {usedSet === h.name ? "Added ✓" : "Use in draft"}
                </button>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Rotate sets so posts don't look repetitive, and always keep #degupmy as your branded
            tag.
          </p>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="mb-4 text-xl font-bold">5. Numbers to watch monthly</h3>
          <div className="space-y-3">
            {KPIS.map((k) => (
              <div
                key={k.metric}
                className="rounded-xl border border-border bg-background p-4 shadow-sm"
              >
                <div className="flex items-baseline justify-between gap-3">
                  <p className="text-sm font-semibold">{k.metric}</p>
                  <p className="text-sm font-bold text-primary">{k.target}</p>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{k.why}</p>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="mb-4 text-xl font-bold">6. Healthcare guardrails</h3>
          <ul className="space-y-3">
            {COMPLIANCE.map((c) => (
              <li
                key={c}
                className="flex gap-3 rounded-xl border border-border bg-background p-4 text-sm shadow-sm"
              >
                <ShieldAlert className="h-4 w-4 shrink-0 text-primary" />
                {c}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

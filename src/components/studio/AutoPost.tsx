import { useMemo, useState } from "react";
import {
  CheckCircle2,
  ExternalLink,
  Loader2,
  Rocket,
  RotateCcw,
  Send,
  TriangleAlert,
  Wand2,
  XCircle,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
  AUDIENCES,
  AUDIENCE_ORDER,
  PLATFORMS,
  PLATFORM_ORDER,
  tailorCaption,
  validate,
  type AudienceId,
  type MediaType,
  type PlatformId,
} from "@/lib/social/platforms";
import {
  isConnected,
  manualPostUrl,
  publishTo,
  type Credentials,
  type PublishResult,
} from "@/lib/social/publish";
import {
  BUILT_IN_FORMATS,
  DEFAULT_BRAND_VOICE,
  LANGUAGES,
  RepurposeError,
  quickFormat,
  repurposeWithClaude,
  type Language,
} from "@/lib/social/repurpose";

export type AutoPostState = {
  topic: string;
  audience: AudienceId;
  language: Language;
  link: string;
  mediaType: MediaType;
  mediaUrl: string;
  platforms: Partial<Record<PlatformId, boolean>>;
  /** Publish straight after generating, without the review step. */
  skipReview: boolean;
};

export const EMPTY_AUTOPOST: AutoPostState = {
  topic: "",
  audience: "patients",
  language: "ms",
  link: "",
  mediaType: "image",
  mediaUrl: "",
  platforms: { instagram: true, facebook: true, tiktok: false, threads: true, linkedin: true },
  skipReview: false,
};

export type PostedEntry = {
  at: string;
  audience: AudienceId;
  preview: string;
  results: Partial<Record<PlatformId, PublishResult>>;
};

const FORMAT_FOR: Record<PlatformId, string> = {
  instagram: "instagram_caption",
  facebook: "facebook_post",
  tiktok: "tiktok_caption",
  threads: "threads_post",
  linkedin: "linkedin_post",
};

const fieldClass =
  "w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";
const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground";

type Phase = "idle" | "generating" | "review" | "publishing" | "done";

export function AutoPost({
  state,
  setState,
  creds,
  onPublished,
}: {
  state: AutoPostState;
  setState: React.Dispatch<React.SetStateAction<AutoPostState>>;
  creds: Credentials;
  onPublished: (entry: PostedEntry) => void;
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [captions, setCaptions] = useState<Partial<Record<PlatformId, string>>>({});
  const [results, setResults] = useState<Partial<Record<PlatformId, PublishResult | "pending">>>(
    {},
  );
  const [opened, setOpened] = useState<Partial<Record<PlatformId, boolean>>>({});
  const [error, setError] = useState<string | null>(null);
  const update = <K extends keyof AutoPostState>(k: K, v: AutoPostState[K]) =>
    setState((s) => ({ ...s, [k]: v }));

  const chosen = PLATFORM_ORDER.filter((id) => state.platforms[id]);
  const auto = chosen.filter((id) => isConnected(id, creds));
  const manual = chosen.filter((id) => !isConnected(id, creds));
  const hasKey = Boolean(creds.anthropicKey);

  const issues = useMemo(() => {
    const out: Partial<Record<PlatformId, ReturnType<typeof validate>>> = {};
    for (const id of chosen)
      out[id] = validate(id, captions[id] ?? "", state.mediaType, state.mediaUrl);
    return out;
  }, [captions, chosen, state.mediaType, state.mediaUrl]);
  const blocked = chosen.filter((id) => issues[id]?.some((i) => i.level === "error"));

  async function generate() {
    setError(null);
    setResults({});
    setOpened({});
    setPhase("generating");
    const formats = BUILT_IN_FORMATS.filter((f) => chosen.some((id) => FORMAT_FOR[id] === f.id));
    const req = {
      source: state.topic,
      audience: state.audience,
      language: state.language,
      formats,
      brandVoice: DEFAULT_BRAND_VOICE,
      extra: [
        state.link
          ? `Include this link where the format allows clickable links: ${state.link}`
          : "",
        state.mediaType === "video"
          ? "These captions go with a short vertical video."
          : state.mediaType === "image"
            ? "These captions go with an image."
            : "These are text-only posts.",
      ]
        .filter(Boolean)
        .join(" "),
    };
    try {
      const next: Partial<Record<PlatformId, string>> = {};
      if (hasKey) {
        const result = await repurposeWithClaude(creds.anthropicKey, req);
        for (const id of chosen) {
          next[id] = result.outputs.find((o) => o.format_id === FORMAT_FOR[id])?.text ?? "";
        }
      } else {
        // No AI key: split the notes into a hook + body and use the built-in per-platform tailoring.
        const quick = quickFormat({ ...req, formats: [] });
        for (const id of chosen) {
          next[id] = tailorCaption(id, {
            hook: quick.hook,
            body: quick.body,
            link: state.link,
            hashtags: [],
            audience: state.audience,
            includeCta: true,
          });
        }
      }
      setCaptions(next);
      const canAutoPublish =
        state.skipReview &&
        auto.length > 0 &&
        !chosen.some((id) =>
          validate(id, next[id] ?? "", state.mediaType, state.mediaUrl).some(
            (i) => i.level === "error",
          ),
        );
      if (canAutoPublish) await publish(next);
      else setPhase("review");
    } catch (err) {
      setError(
        err instanceof RepurposeError ? err.message : `Something went wrong: ${String(err)}`,
      );
      setPhase("idle");
    }
  }

  async function publish(source = captions) {
    setPhase("publishing");
    setResults(Object.fromEntries(auto.map((id) => [id, "pending"])));
    const req = {
      mediaType: state.mediaType,
      mediaUrl: state.mediaUrl.trim(),
      link: state.link.trim(),
    };
    const settled = await Promise.all(
      auto.map(async (id) => {
        const r = await publishTo(id, creds, { ...req, caption: source[id] ?? "" });
        setResults((prev) => ({ ...prev, [id]: r }));
        return [id, r] as const;
      }),
    );
    if (settled.length) {
      onPublished({
        at: new Date().toISOString(),
        audience: state.audience,
        preview: state.topic.slice(0, 90),
        results: Object.fromEntries(settled),
      });
    }
    setPhase("done");
  }

  async function openManual(id: PlatformId) {
    const text = captions[id] ?? "";
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      /* clipboard blocked; LinkedIn and Threads get the text pre-filled anyway */
    }
    window.open(manualPostUrl(id, text), "_blank", "noopener");
    setOpened((o) => ({ ...o, [id]: true }));
  }

  const busy = phase === "generating" || phase === "publishing";
  const canGenerate = state.topic.trim().length >= 15 && chosen.length > 0 && !busy;

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Step 1: what to post */}
      <section className="space-y-5 rounded-2xl border border-border bg-background p-5 shadow-sm lg:col-span-5 lg:self-start">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Auto-post</p>
          <h2 className="mt-1 text-xl font-extrabold">Idea in, posts out</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Describe what you want to say. The studio writes a version for each platform and posts
            them all.
          </p>
        </div>

        <div>
          <label className={labelClass} htmlFor="ap-topic">
            What do you want to post about?
          </label>
          <textarea
            id="ap-topic"
            rows={6}
            className={fieldClass}
            value={state.topic}
            onChange={(e) => update("topic", e.target.value)}
            placeholder={
              "Rough notes are fine, e.g.\nWe just partnered with 3 new dialysis centres in Kota Bharu. Patients can now request slots during school holidays. Free for patients."
            }
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="ap-audience">
              Audience
            </label>
            <select
              id="ap-audience"
              className={fieldClass}
              value={state.audience}
              onChange={(e) => update("audience", e.target.value as AudienceId)}
            >
              {AUDIENCE_ORDER.map((id) => (
                <option key={id} value={id}>
                  {AUDIENCES[id].label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass} htmlFor="ap-lang">
              Language
            </label>
            <select
              id="ap-lang"
              className={fieldClass}
              value={state.language}
              onChange={(e) => update("language", e.target.value as Language)}
            >
              {LANGUAGES.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <span className={labelClass}>Media</span>
          <div className="mb-2 flex gap-2">
            {(["image", "video", "none"] as MediaType[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => update("mediaType", m)}
                className={`flex-1 rounded-xl border px-3 py-2 text-sm capitalize transition ${
                  state.mediaType === m
                    ? "border-primary bg-primary/10 font-semibold text-primary"
                    : "border-border hover:border-primary/40"
                }`}
              >
                {m === "none" ? "Text only" : m}
              </button>
            ))}
          </div>
          {state.mediaType !== "none" && (
            <input
              className={fieldClass}
              value={state.mediaUrl}
              onChange={(e) => update("mediaUrl", e.target.value)}
              placeholder="https://… public URL of the .jpg or .mp4"
              aria-label="Media URL"
            />
          )}
          <input
            className={fieldClass + " mt-2"}
            value={state.link}
            onChange={(e) => update("link", e.target.value)}
            placeholder="Link to include (optional), e.g. https://degup.my"
            aria-label="Link"
          />
        </div>

        <div>
          <span className={labelClass}>Post to</span>
          <div className="space-y-2">
            {PLATFORM_ORDER.map((id) => (
              <label
                key={id}
                className="flex items-center justify-between gap-3 rounded-xl border border-border px-3.5 py-2.5 text-sm"
              >
                <span className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: PLATFORMS[id].color }}
                  />
                  <span className="font-semibold">{PLATFORMS[id].name}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${
                      isConnected(id, creds)
                        ? "bg-emerald-500/15 text-emerald-700"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isConnected(id, creds) ? "Auto" : "1-click"}
                  </span>
                </span>
                <Switch
                  checked={Boolean(state.platforms[id])}
                  onCheckedChange={(v) =>
                    setState((s) => ({ ...s, platforms: { ...s.platforms, [id]: v } }))
                  }
                  aria-label={`Post to ${PLATFORMS[id].name}`}
                />
              </label>
            ))}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            <strong>Auto</strong> platforms post by themselves. <strong>1-click</strong> platforms
            aren't connected yet, so the studio opens them with your post ready to go (on LinkedIn
            and Threads it's already typed in). Connect them under Accounts to make them automatic.
          </p>
        </div>

        <label className="flex items-center justify-between gap-4 rounded-xl bg-secondary/60 px-3.5 py-3 text-sm">
          <span>
            <span className="font-semibold">Post without reviewing</span>
            <span className="block text-xs text-muted-foreground">
              Publishes as soon as the posts are written. Leave this off if you want to check health
              facts first.
            </span>
          </span>
          <Switch checked={state.skipReview} onCheckedChange={(v) => update("skipReview", v)} />
        </label>

        <button
          type="button"
          disabled={!canGenerate}
          onClick={generate}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {phase === "generating" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : state.skipReview ? (
            <Rocket className="h-4 w-4" />
          ) : (
            <Wand2 className="h-4 w-4" />
          )}
          {phase === "generating"
            ? "Writing your posts…"
            : state.skipReview
              ? `Generate & post to ${chosen.length} platform${chosen.length === 1 ? "" : "s"}`
              : "Generate posts"}
        </button>
        {!hasKey && (
          <p className="text-xs text-muted-foreground">
            No Anthropic key yet, so the posts are built from your own sentences. Add a key under
            Accounts for AI-written posts.
          </p>
        )}
      </section>

      {/* Step 2: review & publish */}
      <section className="space-y-4 lg:col-span-7">
        {error && (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {phase === "idle" && !error && (
          <div className="flex min-h-[360px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-background/60 p-8 text-center">
            <Rocket className="h-9 w-9 text-primary" />
            <h3 className="mt-3 text-lg font-bold">One idea, five platforms</h3>
            <ol className="mt-3 max-w-sm space-y-1 text-left text-sm text-muted-foreground">
              <li>1. Write what you want to say, even rough notes</li>
              <li>2. Generate: each platform gets its own version and tone</li>
              <li>3. Check them, then post everywhere with one button</li>
            </ol>
          </div>
        )}

        {phase === "generating" && (
          <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-border bg-background p-8 text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary" /> Writing {chosen.length}{" "}
            posts…
          </div>
        )}

        {(phase === "review" || phase === "publishing" || phase === "done") && (
          <>
            <div className="sticky top-20 z-10 flex flex-col gap-3 rounded-2xl border border-primary/30 bg-background/95 p-4 shadow-lg shadow-primary/10 backdrop-blur sm:flex-row sm:items-center sm:justify-between">
              <div className="text-sm">
                {phase === "done" ? (
                  <p>
                    <strong>Done.</strong>{" "}
                    {manual.length > 0 && manual.some((id) => !opened[id])
                      ? "Now click “Open & post” on the remaining platforms below."
                      : "All platforms handled."}
                  </p>
                ) : blocked.length > 0 ? (
                  <p className="text-destructive">
                    Fix the issues on {blocked.map((id) => PLATFORMS[id].name).join(", ")} first.
                  </p>
                ) : (
                  <p>
                    <strong>Ready.</strong>{" "}
                    {auto.length > 0
                      ? `${auto.map((id) => PLATFORMS[id].name).join(", ")} will post automatically.`
                      : "No platform is connected for automatic posting yet."}
                    {manual.length > 0 &&
                      ` ${manual.map((id) => PLATFORMS[id].name).join(", ")}: 1 click each.`}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={generate}
                  disabled={busy}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-border px-3.5 py-2.5 text-sm font-semibold transition hover:bg-accent disabled:opacity-50"
                >
                  <RotateCcw className="h-4 w-4" /> Rewrite
                </button>
                {phase !== "done" && auto.length > 0 && (
                  <button
                    type="button"
                    onClick={() => publish()}
                    disabled={busy || blocked.some((id) => auto.includes(id))}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {phase === "publishing" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    Post to {auto.length} now
                  </button>
                )}
              </div>
            </div>

            {chosen.map((id) => {
              const result = results[id];
              const p = PLATFORMS[id];
              const text = captions[id] ?? "";
              return (
                <article
                  key={id}
                  className="rounded-2xl border border-border bg-background p-4 shadow-sm"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.color }} />
                      <h3 className="text-sm font-bold">{p.name}</h3>
                    </div>
                    <span
                      className={`text-xs ${text.length > p.maxChars ? "font-semibold text-destructive" : "text-muted-foreground"}`}
                    >
                      {text.length.toLocaleString()}/{p.maxChars.toLocaleString()}
                    </span>
                  </div>
                  <textarea
                    value={text}
                    onChange={(e) => setCaptions((c) => ({ ...c, [id]: e.target.value }))}
                    rows={Math.min(14, Math.max(4, text.split("\n").length + 1))}
                    disabled={
                      phase === "publishing" ||
                      (result !== undefined && result !== "pending" && result.ok)
                    }
                    className="w-full resize-y rounded-xl border border-input bg-secondary/40 p-3 text-[13px] leading-relaxed outline-none focus:border-primary disabled:opacity-70"
                  />
                  {(issues[id] ?? []).map((i) => (
                    <p
                      key={i.message}
                      className={`mt-1.5 flex gap-1.5 text-xs ${i.level === "error" ? "text-destructive" : "text-amber-700"}`}
                    >
                      {i.level === "error" ? (
                        <XCircle className="mt-px h-3.5 w-3.5 shrink-0" />
                      ) : (
                        <TriangleAlert className="mt-px h-3.5 w-3.5 shrink-0" />
                      )}
                      {i.message}
                    </p>
                  ))}

                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                    {isConnected(id, creds) ? (
                      result === "pending" ? (
                        <span className="inline-flex items-center gap-1.5">
                          <Loader2 className="h-3.5 w-3.5 animate-spin" /> Posting…
                        </span>
                      ) : result?.ok ? (
                        <span className="inline-flex items-start gap-1.5 text-emerald-700">
                          <CheckCircle2 className="mt-px h-3.5 w-3.5 shrink-0" /> Posted.{" "}
                          {result.note}
                        </span>
                      ) : result ? (
                        <>
                          <span className="inline-flex items-start gap-1.5 text-destructive">
                            <XCircle className="mt-px h-3.5 w-3.5 shrink-0" /> {result.error}
                          </span>
                          <button
                            type="button"
                            onClick={() => openManual(id)}
                            className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1.5 font-semibold hover:bg-accent"
                          >
                            Open & post instead <ExternalLink className="h-3 w-3" />
                          </button>
                        </>
                      ) : (
                        <span className="text-muted-foreground">Posts automatically</span>
                      )
                    ) : (
                      <button
                        type="button"
                        onClick={() => openManual(id)}
                        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 font-semibold transition ${
                          opened[id]
                            ? "border border-border text-muted-foreground hover:bg-accent"
                            : "bg-primary/10 text-primary hover:bg-primary/20"
                        }`}
                      >
                        {opened[id] ? (
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                        ) : (
                          <ExternalLink className="h-3.5 w-3.5" />
                        )}
                        {opened[id]
                          ? "Opened (open again)"
                          : id === "linkedin" || id === "threads"
                            ? `Open ${p.name} with post ready`
                            : `Copy & open ${p.name}`}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </>
        )}
      </section>
    </div>
  );
}

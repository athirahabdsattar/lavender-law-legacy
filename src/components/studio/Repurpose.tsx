import { useRef, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Copy,
  FileUp,
  Loader2,
  Plus,
  Trash2,
  Wand2,
  Zap,
} from "lucide-react";
import {
  AUDIENCES,
  AUDIENCE_ORDER,
  PLATFORMS,
  PLATFORM_ORDER,
  type AudienceId,
  type PlatformId,
} from "@/lib/social/platforms";
import {
  BUILT_IN_FORMATS,
  DEFAULT_BRAND_VOICE,
  LANGUAGES,
  RepurposeError,
  quickFormat,
  repurposeWithClaude,
  type Language,
  type OutputFormat,
  type RepurposeResult,
} from "@/lib/social/repurpose";

export type RepurposeState = {
  source: string;
  audience: AudienceId;
  language: Language;
  selected: string[];
  brandVoice: string;
  extra: string;
  customFormats: OutputFormat[];
};

export const EMPTY_REPURPOSE: RepurposeState = {
  source: "",
  audience: "patients",
  language: "ms",
  selected: [
    "instagram_caption",
    "facebook_post",
    "tiktok_caption",
    "threads_post",
    "linkedin_post",
    "carousel",
    "reel_script",
  ],
  brandVoice: DEFAULT_BRAND_VOICE,
  extra: "",
  customFormats: [],
};

const fieldClass =
  "w-full rounded-xl border border-input bg-background px-3.5 py-2.5 text-sm text-foreground shadow-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";
const labelClass =
  "mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground";

/** Strip subtitle timestamps/indices so .srt / .vtt transcripts read as plain text. */
function cleanTranscript(text: string) {
  return text
    .replace(/^WEBVTT.*$/m, "")
    .replace(/^\d+\s*$/gm, "")
    .replace(/^[\d:.,]+\s*-->\s*[\d:.,]+.*$/gm, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function Repurpose({
  state,
  setState,
  apiKey,
  onSendToComposer,
}: {
  state: RepurposeState;
  setState: React.Dispatch<React.SetStateAction<RepurposeState>>;
  apiKey: string;
  onSendToComposer: (
    result: RepurposeResult,
    formats: OutputFormat[],
    audience: AudienceId,
  ) => void;
}) {
  const [result, setResult] = useState<RepurposeResult | null>(null);
  const [mode, setMode] = useState<"ai" | "quick" | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [newFormat, setNewFormat] = useState<{
    name: string;
    instructions: string;
    platform: PlatformId | "";
  }>({
    name: "",
    instructions: "",
    platform: "",
  });
  const fileRef = useRef<HTMLInputElement>(null);

  const update = <K extends keyof RepurposeState>(k: K, v: RepurposeState[K]) =>
    setState((s) => ({ ...s, [k]: v }));
  const allFormats = [...BUILT_IN_FORMATS, ...state.customFormats];
  const chosen = allFormats.filter((f) => state.selected.includes(f.id));
  const canRun = state.source.trim().length >= 40 && chosen.length > 0 && !loading;

  function toggleFormat(id: string) {
    setState((s) => ({
      ...s,
      selected: s.selected.includes(id) ? s.selected.filter((x) => x !== id) : [...s.selected, id],
    }));
  }

  function addFormat() {
    if (!newFormat.name.trim() || !newFormat.instructions.trim()) return;
    const id = `custom_${Date.now().toString(36)}`;
    const format: OutputFormat = {
      id,
      name: newFormat.name.trim(),
      instructions: newFormat.instructions.trim(),
      custom: true,
      ...(newFormat.platform ? { platform: newFormat.platform } : {}),
    };
    setState((s) => ({
      ...s,
      customFormats: [...s.customFormats, format],
      selected: [...s.selected, id],
    }));
    setNewFormat({ name: "", instructions: "", platform: "" });
  }

  async function loadFiles(files: FileList | null) {
    if (!files?.length) return;
    const texts = await Promise.all(Array.from(files).map((f) => f.text()));
    const joined = texts.map(cleanTranscript).join("\n\n---\n\n");
    setState((s) => ({
      ...s,
      source: s.source.trim() ? `${s.source.trim()}\n\n${joined}` : joined,
    }));
    if (fileRef.current) fileRef.current.value = "";
  }

  async function run(which: "ai" | "quick") {
    setError(null);
    setMode(which);
    const req = {
      source: state.source,
      audience: state.audience,
      language: state.language,
      formats: chosen,
      brandVoice: state.brandVoice,
      extra: state.extra,
    };
    if (which === "quick") {
      setResult(quickFormat(req));
      return;
    }
    setLoading(true);
    try {
      setResult(await repurposeWithClaude(apiKey, req));
    } catch (err) {
      setError(
        err instanceof RepurposeError ? err.message : `Something went wrong: ${String(err)}`,
      );
    } finally {
      setLoading(false);
    }
  }

  function editOutput(formatId: string, text: string) {
    setResult((r) =>
      r
        ? { ...r, outputs: r.outputs.map((o) => (o.format_id === formatId ? { ...o, text } : o)) }
        : r,
    );
  }

  async function copy(id: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      /* clipboard blocked; the text stays selectable */
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      {/* Input */}
      <section className="space-y-5 rounded-2xl border border-border bg-background p-5 shadow-sm lg:col-span-5 lg:self-start">
        <div>
          <div className="mb-1.5 flex items-center justify-between">
            <label className={labelClass + " mb-0"} htmlFor="source">
              Your existing content
            </label>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              <FileUp className="h-3.5 w-3.5" /> Upload file
            </button>
            <input
              ref={fileRef}
              type="file"
              multiple
              accept=".txt,.md,.srt,.vtt,.csv,.html,text/*"
              className="hidden"
              onChange={(e) => loadFiles(e.target.files)}
            />
          </div>
          <textarea
            id="source"
            rows={10}
            className={fieldClass}
            value={state.source}
            onChange={(e) => update("source", e.target.value)}
            placeholder="Paste anything: a blog post, pitch deck notes, a talk or video transcript, a WhatsApp update, an old caption, meeting notes…"
          />
          <p className="mt-1.5 text-xs text-muted-foreground">
            Text files and video subtitles (.txt, .md, .srt, .vtt) are supported. For Word or Google
            Docs, copy and paste the text.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={labelClass} htmlFor="rp-audience">
              Audience
            </label>
            <select
              id="rp-audience"
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
            <label className={labelClass} htmlFor="rp-lang">
              Language
            </label>
            <select
              id="rp-lang"
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
          <span className={labelClass}>Formats to create</span>
          <div className="flex flex-wrap gap-2">
            {allFormats.map((f) => {
              const on = state.selected.includes(f.id);
              return (
                <span key={f.id} className="inline-flex items-center">
                  <button
                    type="button"
                    onClick={() => toggleFormat(f.id)}
                    title={f.instructions}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      on
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/40"
                    } ${f.custom ? "rounded-r-none" : ""}`}
                  >
                    {on ? "✓ " : ""}
                    {f.name}
                  </button>
                  {f.custom && (
                    <button
                      type="button"
                      aria-label={`Delete ${f.name}`}
                      onClick={() =>
                        setState((s) => ({
                          ...s,
                          customFormats: s.customFormats.filter((c) => c.id !== f.id),
                          selected: s.selected.filter((x) => x !== f.id),
                        }))
                      }
                      className="rounded-r-full border border-l-0 border-border px-2 py-1.5 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  )}
                </span>
              );
            })}
          </div>
        </div>

        <details
          className="rounded-xl border border-dashed border-primary/40 p-3.5"
          open={state.customFormats.length === 0}
        >
          <summary className="cursor-pointer text-sm font-semibold text-primary">
            <Plus className="mr-1 inline h-4 w-4" />
            Add your own format
          </summary>
          <div className="mt-3 space-y-3">
            <input
              className={fieldClass}
              value={newFormat.name}
              onChange={(e) => setNewFormat((n) => ({ ...n, name: e.target.value }))}
              placeholder="Name, e.g. “Myth vs Fact carousel”"
            />
            <textarea
              rows={4}
              className={fieldClass}
              value={newFormat.instructions}
              onChange={(e) => setNewFormat((n) => ({ ...n, instructions: e.target.value }))}
              placeholder={
                "Describe the format exactly, e.g.\n5 slides. Slide 1: “MITOS ❌” + the myth. Slides 2–4: “FAKTA ✅” + one fact each, max 20 words. Slide 5: “Kongsi dengan keluarga 💜”."
              }
            />
            <div className="flex flex-wrap items-center gap-2">
              <select
                className={fieldClass + " w-auto flex-1"}
                value={newFormat.platform}
                onChange={(e) =>
                  setNewFormat((n) => ({ ...n, platform: e.target.value as PlatformId | "" }))
                }
                aria-label="Send to platform"
              >
                <option value="">Not a caption (script, slides…)</option>
                {PLATFORM_ORDER.map((id) => (
                  <option key={id} value={id}>
                    Caption for {PLATFORMS[id].name}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={addFormat}
                disabled={!newFormat.name.trim() || !newFormat.instructions.trim()}
                className="rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground disabled:opacity-50"
              >
                Save format
              </button>
            </div>
          </div>
        </details>

        <details className="text-sm">
          <summary className="cursor-pointer font-semibold">
            Brand voice & extra instructions
          </summary>
          <div className="mt-3 space-y-3">
            <textarea
              rows={4}
              className={fieldClass}
              value={state.brandVoice}
              onChange={(e) => update("brandVoice", e.target.value)}
              aria-label="Brand voice"
            />
            <input
              className={fieldClass}
              value={state.extra}
              onChange={(e) => update("extra", e.target.value)}
              placeholder="One-off note, e.g. “Mention our Ramadan slot campaign”"
              aria-label="Extra instructions"
            />
          </div>
        </details>

        <div className="flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            disabled={!canRun || !apiKey}
            onClick={() => run("ai")}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
            {loading ? "Writing…" : "Generate with AI"}
          </button>
          <button
            type="button"
            disabled={!canRun}
            onClick={() => run("quick")}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-border px-5 py-3 text-sm font-semibold transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Zap className="h-4 w-4" /> Quick format
          </button>
        </div>
        <p className="text-xs text-muted-foreground">
          {!apiKey ? (
            <>
              <strong>Generate with AI</strong> needs an Anthropic API key (add it under Accounts).{" "}
              <strong>Quick format</strong> works without one: it rearranges your own sentences into
              each structure but doesn't rewrite them.
            </>
          ) : state.source.trim().length < 40 ? (
            "Paste at least a few sentences of content."
          ) : (
            "AI mode rewrites your content for each format and audience. It uses only facts from your text."
          )}
        </p>
      </section>

      {/* Output */}
      <section className="space-y-4 lg:col-span-7">
        {error && (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </div>
        )}

        {!result && !loading && (
          <div className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-background/60 p-8 text-center">
            <Wand2 className="h-8 w-8 text-primary" />
            <h3 className="mt-3 font-bold">Turn one piece of content into a week of posts</h3>
            <ol className="mt-3 max-w-sm space-y-1 text-left text-sm text-muted-foreground">
              <li>1. Paste or upload content you already have</li>
              <li>2. Pick the formats you want, or save your own template</li>
              <li>3. Generate, edit, then send the captions to the composer to publish</li>
            </ol>
          </div>
        )}

        {loading && (
          <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-border bg-background p-8 text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary" /> Writing {chosen.length}{" "}
            formats… (usually 20–60 seconds)
          </div>
        )}

        {result && !loading && (
          <>
            <div className="flex flex-col gap-3 rounded-2xl border border-primary/30 bg-primary/5 p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm">
                <strong>{result.outputs.length} formats ready</strong>
                <span className="text-muted-foreground">
                  {" "}
                  ·{" "}
                  {mode === "ai"
                    ? "written by Claude, so check the facts before posting"
                    : "quick format, not rewritten"}
                </span>
              </p>
              <button
                type="button"
                onClick={() => onSendToComposer(result, allFormats, state.audience)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
              >
                Send captions to composer <ArrowRight className="h-4 w-4" />
              </button>
            </div>

            {result.outputs.map((o) => {
              const format = allFormats.find((f) => f.id === o.format_id);
              return (
                <article
                  key={o.format_id}
                  className="rounded-2xl border border-border bg-background p-4 shadow-sm"
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold">
                      {format?.name ?? o.format_id}
                      {format?.platform && (
                        <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                          → {PLATFORMS[format.platform].name}
                        </span>
                      )}
                    </h3>
                    <span className="text-xs text-muted-foreground">
                      {o.text.length.toLocaleString()} chars
                    </span>
                  </div>
                  <textarea
                    value={o.text}
                    onChange={(e) => editOutput(o.format_id, e.target.value)}
                    rows={Math.min(16, Math.max(5, o.text.split("\n").length + 1))}
                    className="w-full resize-y rounded-xl border border-input bg-secondary/40 p-3 text-[13px] leading-relaxed outline-none focus:border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => copy(o.format_id, o.text)}
                    className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-semibold transition hover:bg-accent"
                  >
                    {copied === o.format_id ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                    {copied === o.format_id ? "Copied!" : "Copy"}
                  </button>
                </article>
              );
            })}
          </>
        )}
      </section>
    </div>
  );
}

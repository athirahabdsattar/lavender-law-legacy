// Turn content you already have (a blog post, talk transcript, WhatsApp note, old caption)
// into the social formats you want, either with Claude (AI mode) or with a simple offline formatter.

import Anthropic from "@anthropic-ai/sdk";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { z } from "zod/v4";
import { AUDIENCES, PLATFORMS, type AudienceId, type PlatformId } from "./platforms";

export type OutputFormat = {
  id: string;
  name: string;
  /** If set, "Send to composer" puts this output into that platform's caption. */
  platform?: PlatformId;
  instructions: string;
  custom?: boolean;
};

export const BUILT_IN_FORMATS: OutputFormat[] = [
  {
    id: "instagram_caption",
    name: "Instagram caption",
    platform: "instagram",
    instructions:
      "Instagram feed/Reel caption. Hook in the first line (under 125 characters). Short paragraphs with line breaks, 1–3 emojis, a clear call to action, then 3–5 niche hashtags on the last line. No URLs: say “link in bio”. Max 2,200 characters.",
  },
  {
    id: "facebook_post",
    name: "Facebook post",
    platform: "facebook",
    instructions:
      "Facebook Page post. Warm and conversational, aimed at family members and caregivers aged 35–65. Links are allowed. End with a question that invites comments. At most 2 hashtags.",
  },
  {
    id: "tiktok_caption",
    name: "TikTok caption",
    platform: "tiktok",
    instructions:
      "TikTok caption. 1–3 short lines using words people actually search for (e.g. “pusat dialisis”, “slot dialisis”). 3–5 topic hashtags, never #fyp. Under 300 characters.",
  },
  {
    id: "threads_post",
    name: "Threads post",
    platform: "threads",
    instructions:
      "Threads post. Conversational opinion or insight that invites replies. Max 450 characters. At most one topic tag at the end.",
  },
  {
    id: "carousel",
    name: "Carousel slides",
    instructions:
      "Instagram carousel of 6–8 slides, ready to paste into Canva. Format each slide as “Slide N — HEADLINE” on one line, then 1–2 short lines of body text (max 25 words per slide). Slide 1 is a scroll-stopping title, the last slide is a save/share/follow CTA.",
  },
  {
    id: "reel_script",
    name: "Reel / TikTok script",
    instructions:
      "30–45 second vertical video script. Sections: HOOK (0–3s), then 3–4 BEATS, then CTA. For each, give ON-SCREEN TEXT, VOICEOVER, and SHOT (what to film). Simple shots a small team can film on a phone.",
  },
  {
    id: "story_sequence",
    name: "Story sequence",
    instructions:
      "Instagram Story sequence of 4–5 frames. For each frame: the text on screen and one interactive sticker (poll, quiz, question box, slider or link). The last frame drives a DM or link click.",
  },
];

export type Language = "ms" | "en" | "bilingual";

export const LANGUAGES: { id: Language; label: string }[] = [
  { id: "ms", label: "Bahasa Melayu" },
  { id: "en", label: "English" },
  { id: "bilingual", label: "BM + English" },
];

export type RepurposeRequest = {
  source: string;
  audience: AudienceId;
  language: Language;
  formats: OutputFormat[];
  brandVoice: string;
  extra: string;
};

const ResultSchema = z.object({
  hook: z.string().describe("One scroll-stopping first line for the composer."),
  body: z.string().describe("The core message in 2–3 short paragraphs, without hashtags or CTA."),
  hashtags: z.array(z.string()).describe("3–5 hashtags including #degupmy."),
  outputs: z.array(
    z.object({
      format_id: z.string().describe("The id of the requested format, exactly as given."),
      text: z.string().describe("The finished content, ready to copy and paste."),
    }),
  ),
});

export type RepurposeResult = z.infer<typeof ResultSchema>;

export const DEFAULT_BRAND_VOICE =
  "DEGUP (@degup.my) is a Malaysian healthcare navigation startup that helps dialysis patients and their families find dialysis slots and support. Voice: warm, hopeful, practical and respectful, like a knowledgeable friend. Plain language, no jargon. Lavender 💜 is the brand colour.";

const SYSTEM = `You are the social media editor for DEGUP. You repurpose the source material the user gives you into finished social posts in the exact formats they ask for.

Rules:
- Use only facts that are in the source material. Do not invent statistics, names, quotes, prices or medical claims. If the source lacks something a format needs, write around it.
- Never promise medical outcomes. When content touches on treatment, suggest consulting a doctor.
- Do not include patient names or identifying details unless they are already in the source.
- Write natural Malaysian Bahasa Melayu (not Indonesian) when asked for BM. For bilingual, lead in BM with a short English line.
- Each output must follow its format instructions exactly and be ready to paste, with no commentary about what you did.`;

function buildPrompt(r: RepurposeRequest) {
  const audience = AUDIENCES[r.audience];
  const language = LANGUAGES.find((l) => l.id === r.language)?.label ?? "Bahasa Melayu";
  const formats = r.formats
    .map((f) => `- id: ${f.id}\n  name: ${f.name}\n  instructions: ${f.instructions}`)
    .join("\n");
  return `<source_material>
${r.source.trim()}
</source_material>

<brand_voice>
${r.brandVoice.trim() || DEFAULT_BRAND_VOICE}
</brand_voice>

Audience: ${audience.label}. ${audience.description}
Language: ${language}
Suggested hashtags for this audience: ${audience.hashtags.join(" ")}
${r.extra.trim() ? `Extra instructions: ${r.extra.trim()}\n` : ""}
Produce one output for each of these formats, using the same format_id:
${formats}`;
}

export class RepurposeError extends Error {}

export async function repurposeWithClaude(
  apiKey: string,
  r: RepurposeRequest,
): Promise<RepurposeResult> {
  // The site is static (no server), so the call goes straight from the browser with the user's own key.
  const client = new Anthropic({ apiKey, dangerouslyAllowBrowser: true });
  try {
    const response = await client.beta.messages.parse({
      model: "claude-opus-5-5",
      max_tokens: 16000,
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      output_config: { effort: "medium", format: zodOutputFormat(ResultSchema) },
      system: SYSTEM,
      messages: [{ role: "user", content: buildPrompt(r) }],
    });
    if (response.stop_reason === "refusal") {
      throw new RepurposeError(
        "Claude declined this request. Try rephrasing the source or instructions.",
      );
    }
    if (response.stop_reason === "max_tokens") {
      throw new RepurposeError(
        "The output was too long and got cut off. Pick fewer formats and try again.",
      );
    }
    if (!response.parsed_output)
      throw new RepurposeError("Claude's reply couldn't be read. Please try again.");
    return response.parsed_output;
  } catch (err) {
    if (err instanceof RepurposeError) throw err;
    if (err instanceof Anthropic.AuthenticationError)
      throw new RepurposeError("The Anthropic API key was rejected. Check it under Accounts.");
    if (err instanceof Anthropic.PermissionDeniedError)
      throw new RepurposeError("This API key doesn't have access to the model.");
    if (err instanceof Anthropic.RateLimitError)
      throw new RepurposeError("Rate limit reached. Wait a minute and try again.");
    if (err instanceof Anthropic.APIConnectionError)
      throw new RepurposeError("Couldn't reach the Anthropic API. Check your internet connection.");
    if (err instanceof Anthropic.APIError)
      throw new RepurposeError(`Anthropic API error ${err.status ?? ""}: ${err.message}`);
    throw err;
  }
}

/* ----------------------------- Offline quick format ----------------------------- */

function sentences(text: string) {
  return (
    text
      .replace(/\s+/g, " ")
      .match(/[^.!?。]+[.!?。]*/g)
      ?.map((s) => s.trim())
      .filter((s) => s.length > 2) ?? []
  );
}

function chunk<T>(items: T[], parts: number) {
  const size = Math.max(1, Math.ceil(items.length / parts));
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

/**
 * No-AI fallback: splits the source by sentences into the requested structures.
 * It reorganises your words but doesn't rewrite them. Use AI mode for real rewriting.
 */
export function quickFormat(r: RepurposeRequest): RepurposeResult {
  const all = sentences(r.source);
  const hook = all[0] ?? "";
  const rest = all.slice(1);
  const body = chunk(rest.slice(0, 6), 3)
    .map((p) => p.join(" "))
    .join("\n\n");
  const audience = AUDIENCES[r.audience];
  const hashtags = audience.hashtags.slice(0, 5);
  const shorten = (s: string, n: number) => (s.length > n ? `${s.slice(0, n - 1).trimEnd()}…` : s);

  const outputs = r.formats.map((f) => {
    let text: string;
    if (f.platform) {
      const p = PLATFORMS[f.platform];
      const tags = hashtags.slice(0, p.idealHashtags[1]).join(" ");
      const main =
        f.platform === "threads" || f.platform === "tiktok"
          ? [hook, rest[0] ?? ""].join(" ")
          : [hook, body].join("\n\n");
      text = [main, audience.cta[f.platform], tags].filter(Boolean).join("\n\n");
      if (text.length > p.maxChars) text = shorten(text, p.maxChars);
    } else if (f.id === "carousel") {
      const groups = chunk(rest, 5);
      text = [
        `Slide 1 — ${shorten(hook, 80).toUpperCase()}`,
        ...groups.map((g, i) =>
          `Slide ${i + 2} — ${shorten(g[0] ?? "", 60)}\n${g.slice(1).join(" ")}`.trim(),
        ),
        `Slide ${groups.length + 2} — SIMPAN & KONGSI 💜\nFollow @degup.my untuk tips seterusnya.`,
      ].join("\n\n");
    } else if (f.id === "reel_script") {
      const beats = chunk(rest, 3);
      text = [
        `HOOK (0–3s)\nON-SCREEN TEXT: ${shorten(hook, 60)}\nVOICEOVER: ${hook}\nSHOT: Close-up to camera`,
        ...beats.map(
          (b, i) =>
            `BEAT ${i + 1}\nON-SCREEN TEXT: ${shorten(b[0] ?? "", 50)}\nVOICEOVER: ${b.join(" ")}\nSHOT: B-roll`,
        ),
        `CTA\nON-SCREEN TEXT: ${shorten(audience.cta.tiktok, 60)}\nVOICEOVER: ${audience.cta.instagram}`,
      ].join("\n\n");
    } else if (f.id === "story_sequence") {
      text = [
        `Frame 1: ${shorten(hook, 90)}\nSticker: Poll (Pernah alami? Ya / Belum)`,
        `Frame 2: ${shorten(rest[0] ?? "", 120)}\nSticker: Quiz`,
        `Frame 3: ${shorten(rest[1] ?? "", 120)}\nSticker: Emoji slider 💜`,
        `Frame 4: Ada soalan? Tanya kami!\nSticker: Question box`,
        `Frame 5: ${audience.cta.instagram}\nSticker: Link`,
      ].join("\n\n");
    } else {
      // Custom formats need AI to follow free-form instructions; give the raw material as a starting point.
      text = `[${f.name}: AI mode follows your custom instructions. Here's the source, organised:]\n\n${[hook, body].join("\n\n")}`;
    }
    return { format_id: f.id, text };
  });

  return { hook, body, hashtags, outputs };
}

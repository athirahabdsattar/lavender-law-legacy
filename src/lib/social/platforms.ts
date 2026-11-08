// Platform rules + caption tailoring for the DEGUP social studio.
// Everything here is pure (no network) so it can run in the browser and be prerendered.

export type PlatformId = "instagram" | "facebook" | "tiktok" | "threads" | "linkedin";
export type MediaType = "none" | "image" | "video";

export type Platform = {
  id: PlatformId;
  name: string;
  maxChars: number;
  /** Hashtags the platform rewards; more than this reads as spam or is rejected. */
  maxHashtags: number;
  idealHashtags: [number, number];
  clickableLinks: boolean;
  requiresMedia: MediaType[] | null;
  color: string;
  tips: string[];
};

export const PLATFORMS: Record<PlatformId, Platform> = {
  instagram: {
    id: "instagram",
    name: "Instagram",
    maxChars: 2200,
    maxHashtags: 30,
    idealHashtags: [3, 5],
    clickableLinks: false,
    requiresMedia: ["image", "video"],
    color: "oklch(0.63 0.22 10)",
    tips: [
      "First 125 characters show before “more”. Put the hook there.",
      "Links don't work in captions. Point to the link in bio or a DM keyword.",
      "3–5 niche hashtags work better than 30 generic ones.",
      "Reels reach non-followers. Feed posts and carousels keep the people who already follow you.",
    ],
  },
  facebook: {
    id: "facebook",
    name: "Facebook",
    maxChars: 63206,
    maxHashtags: 3,
    idealHashtags: [0, 2],
    clickableLinks: true,
    requiresMedia: null,
    color: "oklch(0.55 0.19 260)",
    tips: [
      "Older caregivers and family members are most active here, so write in warm, plain BM.",
      "End with a question. Comments push reach more than likes do.",
      "Links are clickable, but link posts get less reach. Consider putting the link in the first comment.",
    ],
  },
  tiktok: {
    id: "tiktok",
    name: "TikTok",
    maxChars: 2200,
    maxHashtags: 5,
    idealHashtags: [3, 5],
    clickableLinks: false,
    requiresMedia: ["video"],
    color: "oklch(0.3 0.02 300)",
    tips: [
      "TikTok works like a search engine. Write the words people type, e.g. “pusat dialisis Kota Bharu”.",
      "The hook has to land in the first 2 seconds, both on screen and in the caption.",
      "Skip #fyp. Use topic hashtags your audience follows.",
    ],
  },
  threads: {
    id: "threads",
    name: "Threads",
    maxChars: 500,
    maxHashtags: 1,
    idealHashtags: [0, 1],
    clickableLinks: true,
    requiresMedia: null,
    color: "oklch(0.25 0.01 300)",
    tips: [
      "Threads allows one topic tag per post. Pick the community you want to join.",
      "Opinions and questions get replies, and replies drive reach.",
      "500 characters max. The long version belongs on IG or Facebook.",
    ],
  },
  linkedin: {
    id: "linkedin",
    name: "LinkedIn",
    maxChars: 3000,
    maxHashtags: 5,
    idealHashtags: [3, 3],
    clickableLinks: true,
    requiresMedia: null,
    color: "oklch(0.5 0.13 245)",
    tips: [
      "Where partners, clinicians, investors and corporates are. Write in a professional founder voice, in English.",
      "The first 2 lines show before “…see more”, so open with an insight or a number.",
      "Short lines with white space. Tell a lesson from the build, then ask a question.",
      "About 3 hashtags. Posting links can reduce reach, so consider putting the link in a comment.",
    ],
  },
};

export const PLATFORM_ORDER: PlatformId[] = [
  "instagram",
  "facebook",
  "tiktok",
  "threads",
  "linkedin",
];

export type AudienceId = "patients" | "caregivers" | "providers" | "ecosystem" | "public";

export type Audience = {
  id: AudienceId;
  label: string;
  description: string;
  language: "ms" | "en";
  hashtags: string[];
  cta: Record<PlatformId, string>;
};

export const AUDIENCES: Record<AudienceId, Audience> = {
  patients: {
    id: "patients",
    label: "Dialysis patients",
    description: "People on dialysis looking for slots, centres and day-to-day support. BM first.",
    language: "ms",
    hashtags: ["#dialisis", "#buahpinggang", "#pesakitbuahpinggang", "#hemodialisis", "#degupmy"],
    cta: {
      instagram: "💬 DM “SLOT” untuk bantuan cari slot dialisis. Link di bio.",
      facebook: "Perlukan bantuan cari slot dialisis? Komen “SLOT” atau mesej kami terus. 💜",
      tiktok: "Follow @degup.my untuk tips dialisis setiap minggu 💜",
      threads: "Ada pengalaman cari slot dialisis? Kongsi di bawah 👇",
      linkedin:
        "We help dialysis patients across Malaysia find treatment slots. If you work with patients who travel, let's connect.",
    },
  },
  caregivers: {
    id: "caregivers",
    label: "Caregivers & family",
    description: "Children and spouses managing a loved one's dialysis. Practical and reassuring.",
    language: "ms",
    hashtags: ["#penjaga", "#dialisis", "#keluarga", "#buahpinggang", "#degupmy"],
    cta: {
      instagram: "🔖 Simpan & kongsi dengan ahli keluarga yang menjaga pesakit dialisis.",
      facebook:
        "Tag ahli keluarga yang sedang menjaga pesakit dialisis. Mereka tak keseorangan. 💜",
      tiktok: "Share dengan adik-beradik yang jaga mak ayah 💜",
      threads: "Penjaga pesakit dialisis, apa yang paling susah bagi anda?",
      linkedin:
        "Many of us are quietly caring for a parent on dialysis while working full-time. Employers, how do you support caregivers on your team?",
    },
  },
  providers: {
    id: "providers",
    label: "Dialysis centres & clinicians",
    description:
      "Centre operators, nephrologists and nurses. Professional English, partnership tone.",
    language: "en",
    hashtags: ["#dialysis", "#nephrology", "#healthtechmalaysia", "#kidneycare", "#degupmy"],
    cta: {
      instagram: "Run a dialysis centre? DM us “PARTNER” to list your available slots.",
      facebook:
        "Dialysis centre operators: let's talk about filling empty slots. Message us to partner.",
      tiktok: "Centre owners, follow for more on patient referrals 🩺",
      threads: "Clinicians: what's the biggest bottleneck in dialysis referrals today?",
      linkedin:
        "Dialysis centre operators and nephrologists: we're partnering with centres to fill unused slots. Message me to explore a pilot.",
    },
  },
  ecosystem: {
    id: "ecosystem",
    label: "Startup & impact ecosystem",
    description: "Investors, accelerators, corporates and founders. The building-in-public story.",
    language: "en",
    hashtags: ["#healthtech", "#startupmalaysia", "#socialimpact", "#seedlab", "#degupmy"],
    cta: {
      instagram: "Follow along as we build Malaysia's dialysis navigation platform. 🚀",
      facebook:
        "We're building in public. Follow DEGUP for the journey, and reach out if you'd like to collaborate.",
      tiktok: "Follow the build: lawyer to healthtech founder 🚀",
      threads: "Founders in healthtech: what would you do differently in year one?",
      linkedin:
        "Building in public with SEEd.Lab (PETRONAS & TCS). Follow along, and reach out if you'd like to collaborate.",
    },
  },
  public: {
    id: "public",
    label: "General public (kidney awareness)",
    description: "Prevention and awareness for everyone. Bilingual, myth-busting, shareable.",
    language: "ms",
    hashtags: ["#kesihatanbuahpinggang", "#kidneyhealth", "#diabetes", "#darahtinggi", "#degupmy"],
    cta: {
      instagram: "🔖 Save & share. Check your kidneys if you have diabetes or high blood pressure.",
      facebook: "Kongsikan supaya lebih ramai tahu. Pencegahan lebih baik daripada rawatan. 💜",
      tiktok: "Share dengan family yang ada diabetes / darah tinggi 💜",
      threads: "Did you know diabetes is the top cause of kidney failure in Malaysia?",
      linkedin: "Kidney health is workplace health. Share this with your HR or wellness team.",
    },
  },
};

export const AUDIENCE_ORDER: AudienceId[] = [
  "patients",
  "caregivers",
  "providers",
  "ecosystem",
  "public",
];

export type ComposeInput = {
  hook: string;
  body: string;
  link: string;
  hashtags: string[];
  audience: AudienceId;
  includeCta: boolean;
};

/** Length as the platforms count it (UTF-16 code units, which is what the APIs validate). */
export function captionLength(text: string) {
  return text.length;
}

export function parseHashtags(raw: string): string[] {
  const seen = new Set<string>();
  const tags: string[] = [];
  for (const piece of raw.split(/[\s,]+/)) {
    const clean = piece.replace(/^#+/, "").replace(/[^\p{L}\p{N}_]/gu, "");
    if (!clean) continue;
    const key = clean.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    tags.push(`#${clean}`);
  }
  return tags;
}

export function countHashtags(text: string) {
  return (text.match(/(^|\s)#[\p{L}\p{N}_]+/gu) ?? []).length;
}

function mergeTags(own: string[], audience: string[], max: number) {
  const out: string[] = [];
  const seen = new Set<string>();
  for (const t of [...own, ...audience]) {
    const k = t.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(t);
    if (out.length >= max) break;
  }
  return out;
}

function truncate(text: string, max: number) {
  if (text.length <= max) return text;
  const slice = text.slice(0, max - 1);
  const cut = Math.max(slice.lastIndexOf(". "), slice.lastIndexOf("\n"), slice.lastIndexOf(" "));
  return `${slice.slice(0, cut > max * 0.6 ? cut : max - 1).trimEnd()}…`;
}

/** Shorten paragraphs to the first sentence each, for short-form platforms. */
function condense(body: string) {
  return body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => {
      const m = p.match(/^.+?[.!?](\s|$)/);
      return (m ? m[0] : p).trim();
    })
    .join(" ");
}

export function tailorCaption(platformId: PlatformId, input: ComposeInput): string {
  const platform = PLATFORMS[platformId];
  const audience = AUDIENCES[input.audience];
  const hook = input.hook.trim();
  const body = input.body.trim();
  const link = input.link.trim();
  const cta = input.includeCta ? audience.cta[platformId] : "";
  const tags = mergeTags(input.hashtags, audience.hashtags, platform.idealHashtags[1]);

  switch (platformId) {
    case "instagram": {
      const bioLine = audience.language === "ms" ? "🔗 Pautan di bio" : "🔗 Link in bio";
      const needsBioLine = link && !/\bbio\b/i.test(cta);
      const parts = [hook, body, cta, needsBioLine ? bioLine : "", tags.join(" ")];
      return truncate(parts.filter(Boolean).join("\n\n"), platform.maxChars);
    }
    case "facebook": {
      // Facebook: conversational, link inline, at most two hashtags.
      const parts = [hook, body, link, cta, tags.slice(0, 2).join(" ")];
      return truncate(parts.filter(Boolean).join("\n\n"), platform.maxChars);
    }
    case "tiktok": {
      // TikTok: hook + condensed searchable body on one or two lines, tags at the end.
      const short = condense(body);
      const parts = [hook, short, cta, tags.join(" ")];
      return truncate(parts.filter(Boolean).join("\n\n"), platform.maxChars);
    }
    case "threads": {
      // Threads: a single topic tag, keep it under 500 chars.
      const topic = tags[0] ?? "";
      const tail = [cta, link, topic].filter(Boolean).join("\n\n");
      const budget = platform.maxChars - (tail ? tail.length + 2 : 0);
      const main = truncate(
        [hook, condense(body)].filter(Boolean).join("\n\n"),
        Math.max(budget, 80),
      );
      return [main, tail].filter(Boolean).join("\n\n").slice(0, platform.maxChars);
    }
    case "linkedin": {
      // LinkedIn: insight-led, short lines, link inline, ~3 hashtags at the end.
      const parts = [hook, body, cta, link, tags.slice(0, 3).join(" ")];
      return truncate(parts.filter(Boolean).join("\n\n"), platform.maxChars);
    }
  }
}

export type Issue = { level: "error" | "warn"; message: string };

export function validate(
  platformId: PlatformId,
  caption: string,
  mediaType: MediaType,
  mediaUrl: string,
): Issue[] {
  const p = PLATFORMS[platformId];
  const issues: Issue[] = [];
  const len = captionLength(caption);
  if (len > p.maxChars)
    issues.push({
      level: "error",
      message: `${len - p.maxChars} characters over the ${p.maxChars} limit.`,
    });
  if (!caption.trim() && mediaType === "none")
    issues.push({ level: "error", message: "Nothing to post: add a caption or media." });
  const tagCount = countHashtags(caption);
  if (tagCount > p.maxHashtags)
    issues.push({
      level: "error",
      message: `${tagCount} hashtags. ${p.name} allows ${p.maxHashtags}.`,
    });
  else if (tagCount > p.idealHashtags[1])
    issues.push({
      level: "warn",
      message: `${tagCount} hashtags. ${p.idealHashtags[0]}–${p.idealHashtags[1]} usually performs better.`,
    });
  if (p.requiresMedia && !p.requiresMedia.includes(mediaType)) {
    issues.push({
      level: "error",
      message: `${p.name} needs ${p.requiresMedia.join(" or ")} media.`,
    });
  }
  if (mediaType !== "none" && !/^https:\/\/\S+$/.test(mediaUrl.trim())) {
    issues.push({
      level: "error",
      message: "The media must be a public https:// URL so the platform can fetch it.",
    });
  }
  if (!p.clickableLinks && /https?:\/\//.test(caption)) {
    issues.push({
      level: "warn",
      message: "Links aren't clickable here. Say “link in bio” instead.",
    });
  }
  if (platformId === "instagram" && (caption.split("\n")[0] ?? "").length > 125) {
    issues.push({
      level: "warn",
      message: "The first line is cut off after about 125 characters. Shorten the hook.",
    });
  }
  return issues;
}

// Instagram growth playbook for @degup.my, a dialysis navigation startup in Malaysia.

export type Pillar = {
  name: string;
  share: string;
  audience: string;
  format: string;
  examples: string[];
};

export const PILLARS: Pillar[] = [
  {
    name: "Dialysis navigation tips",
    share: "30%",
    audience: "Patients & caregivers",
    format: "Carousel + Reel",
    examples: [
      "5 soalan wajib tanya sebelum pilih pusat dialisis",
      "Cara dapatkan slot dialisis bila balik kampung / bercuti",
      "Dokumen yang perlu dibawa untuk dialisis di pusat baharu",
    ],
  },
  {
    name: "Real stories",
    share: "20%",
    audience: "Patients, caregivers, public",
    format: "Reel (talking head / b-roll)",
    examples: [
      "Seorang anak yang menjaga ayah 3x seminggu (get written consent first)",
      "A day in the life of a dialysis nurse",
      "Patient milestone: 5 years on dialysis and still working",
    ],
  },
  {
    name: "Kidney health awareness",
    share: "20%",
    audience: "General public",
    format: "Reel + shareable carousel",
    examples: [
      "Mitos vs fakta: “Minum banyak air boleh elak sakit buah pinggang?”",
      "Diabetes & darah tinggi: tanda awal buah pinggang bermasalah",
      "Explain the kidney test results (eGFR, creatinine) your doctor mentioned",
    ],
  },
  {
    name: "Building DEGUP in public",
    share: "20%",
    audience: "Ecosystem, partners, public",
    format: "Reel + Stories",
    examples: [
      "From litigation lawyer to healthtech founder: why I started DEGUP",
      "Behind the scenes at SEEd.Lab (PETRONAS & TCS)",
      "We visited 10 dialysis centres this month. Here's what we learnt",
    ],
  },
  {
    name: "Partner spotlights",
    share: "10%",
    audience: "Centres & clinicians",
    format: "Collab post",
    examples: [
      "Meet the team at [centre name] (Collab post so it shows on both accounts)",
      "Nephrologist Q&A: 3 questions every new patient asks",
      "Slots available this week: partner centre roundup",
    ],
  },
];

export type Phase = { title: string; weeks: string; goals: string[] };

export const ROADMAP: Phase[] = [
  {
    title: "Foundation",
    weeks: "Week 1–2",
    goals: [
      "Switch to a Professional (Business) account and pick the category “Health & Wellness Website” or “Medical & Health”.",
      "Name field: “DEGUP | Cari Slot Dialisis”. The name field is searchable, so put keywords there.",
      "Bio: say who it's for, what you do and what to do next, e.g. “Bantu pesakit & keluarga cari slot dialisis di Malaysia 💜 DM “SLOT” ⬇️”.",
      "Link in bio: a single page with the slot request form, WhatsApp, and partner sign-up.",
      "Story Highlights: Cari Slot · Tips · Kisah · Partner · FAQ. Use simple lavender icons.",
      "Make 9 cornerstone posts so new visitors see a complete grid.",
    ],
  },
  {
    title: "Consistency",
    weeks: "Week 3–8",
    goals: [
      "Post 4 Reels and 2 carousels a week. Reels bring new people, carousels get saved.",
      "Post 3–5 Stories a day with polls, question boxes and “Add Yours”. Stories keep current followers warm.",
      "Batch-film on one day a week. Use this studio to cross-post each Reel to TikTok, Facebook and Threads.",
      "Reply to every comment within the first hour. Early engagement tells the algorithm the post is worth pushing.",
      "Spend 20 minutes a day leaving useful comments on dialysis, kidney health, Malaysian health and startup accounts.",
    ],
  },
  {
    title: "Collaboration",
    weeks: "Week 6–12",
    goals: [
      "Do 1–2 Collab posts a month with partner dialysis centres. The post shows up on both grids and reaches their followers.",
      "Work with micro-creators: caregivers, nurses and Malaysian health doctors on IG/TikTok with 5k–50k followers.",
      "Go live once a month with a nephrologist or dietitian (Q&A in BM).",
      "Ask to be featured by SEEd.Lab, PETRONAS, TCS and the MaGIC / Cradle startup networks.",
    ],
  },
  {
    title: "Conversion & scale",
    weeks: "Month 3+",
    goals: [
      "Set up DM keyword automation (“SLOT”, “PARTNER”) that replies with the form link.",
      "Turn the best-performing Reels into Trial Reels or a small boost (RM10–30/day, targeting Malaysia, ages 30–65).",
      "Run monthly campaigns: World Kidney Day (2nd Thursday of March), Ramadan dialysis tips, festive-season “balik kampung” slots.",
      "Repurpose the top 10% of posts every quarter in a new format (carousel → Reel → Threads post).",
    ],
  },
];

export const SCHEDULE = [
  { day: "Mon", slot: "12:30pm", format: "Carousel", pillar: "Dialysis navigation tips" },
  { day: "Tue", slot: "8:30pm", format: "Reel", pillar: "Kidney health awareness" },
  { day: "Wed", slot: "8:30pm", format: "Reel", pillar: "Real stories" },
  { day: "Thu", slot: "12:30pm", format: "Carousel", pillar: "Partner spotlights" },
  { day: "Fri", slot: "9:00pm", format: "Reel", pillar: "Building DEGUP in public" },
  { day: "Sat", slot: "10:00am", format: "Reel", pillar: "Dialysis navigation tips" },
  { day: "Sun", slot: "Stories only", format: "Stories", pillar: "Weekly Q&A / poll" },
];

export const HASHTAG_SETS = [
  {
    name: "BM patients",
    tags: "#dialisis #buahpinggang #pesakitbuahpinggang #hemodialisis #degupmy",
  },
  { name: "Caregivers", tags: "#penjaga #penjagapesakit #dialisis #keluarga #degupmy" },
  {
    name: "Awareness",
    tags: "#kesihatanbuahpinggang #kidneyhealth #diabetesmalaysia #darahtinggi #degupmy",
  },
  { name: "Clinicians", tags: "#dialysis #nephrology #kidneycare #healthtechmalaysia #degupmy" },
  { name: "Startup", tags: "#healthtech #startupmalaysia #socialimpact #womenfounders #degupmy" },
];

export const KPIS = [
  {
    metric: "Reach from non-followers",
    target: "> 50% on Reels",
    why: "Shows whether new people are finding you.",
  },
  {
    metric: "Saves + shares per post",
    target: "> 3% of reach",
    why: "The strongest ranking signals for carousels.",
  },
  {
    metric: "Profile visits → follows",
    target: "> 10%",
    why: "Tests the bio, highlights and grid.",
  },
  {
    metric: "DM keyword replies",
    target: "Track weekly",
    why: "Real slot requests. This is the business metric.",
  },
  {
    metric: "Net follower growth",
    target: "+5–10% / month",
    why: "A realistic pace for a niche health account.",
  },
];

export const COMPLIANCE = [
  "Get written consent before showing any patient's face, name or medical details (PDPA 2010). Blur IC numbers, wristbands and screens.",
  "Don't make treatment claims or promise outcomes. Share navigation and awareness, and say “consult your doctor” on medical topics.",
  "Use “Paid partnership” labels on sponsored or creator content.",
  "Keep a reply template for medical questions in DMs that points people to their nephrologist or the centre.",
];

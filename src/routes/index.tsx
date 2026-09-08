import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Award, Briefcase, Scale, ArrowRight, Mail, Linkedin, HeartPulse, ChevronDown } from "lucide-react";
import sceneCourt from "../assets/scene-court.jpg";
import sceneOffice from "../assets/scene-office.jpg";
import sceneClinic from "../assets/scene-clinic.jpg";
import sceneLab from "../assets/scene-lab.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Athirah Abd Sattar | Lawyer & Healthcare Startup Builder" },
      { name: "description", content: "An interactive scroll journey from courtroom to healthcare startup: 7+ years across insurance litigation, legal aid, and co-founding DEGUP through PETRONAS SEEd.Lab." },
      { property: "og:title", content: "Athirah Abd Sattar | Lawyer & Healthcare Startup Builder" },
      { property: "og:description", content: "An interactive scroll journey from courtroom to healthcare startup: insurance litigation, legal aid, and building DEGUP." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const LINKEDIN_URL = "https://www.linkedin.com/in/athirahabdsattar";
const EMAIL = "athirahlegal@gmail.com";

type Chapter = {
  id: string;
  label: string;
  image: string;
  icon: typeof Scale;
  period: string;
  title: string;
  organization: string;
  description: string;
  facts: string[];
  dark?: boolean;
};

const chapters: Chapter[] = [
  {
    id: "courtroom",
    label: "Courtroom",
    image: sceneCourt,
    icon: Scale,
    period: "May 2019 – Mar 2021",
    title: "Legal Assistant / Lawyer",
    organization: "Messrs Syariful & Wan Zul, Kota Bharu",
    description:
      "Where it began. Personal injury and running-down matters on the plaintiff's side, alongside criminal and civil litigation and conveyancing — investigations, evidence gathering with medical experts, drafting, negotiation and court advocacy.",
    facts: ["Plaintiff personal injury", "Criminal, civil & conveyancing", "Admitted to the Bar 16.04.2019"],
  },
  {
    id: "litigation",
    label: "Litigation",
    image: sceneOffice,
    icon: Briefcase,
    period: "Apr 2021 – Jan 2025",
    title: "Legal Assistant / Lawyer",
    organization: "Messrs Kenneth William & Associates, Kota Bharu",
    description:
      "Nearly four years of insurance defence work in personal injury and running-down claims, run independently for nine major insurers — from investigation and legal opinion to strategic negotiation and full trial. Settlements approaching half a million ringgit, secured single-handedly.",
    facts: ["Defendant's insurance work", "9 insurers represented", "Solo file management"],
    dark: true,
  },
  {
    id: "service",
    label: "Legal aid",
    image: sceneClinic,
    icon: HeartPulse,
    period: "May 2025 – Dec 2025",
    title: "Legal Assistant / Lawyer",
    organization: "Messrs Zuhaidie Akmal & Co · YBGK legal aid",
    description:
      "Pro bono and government-compensated criminal legal aid under Yayasan Bantuan Guaman Kebangsaan — mitigating bail conditions and sentences, opposing remand applications and carrying a substantial caseload for underprivileged clients.",
    facts: ["Criminal defence", "Bail, remand & mitigation", "YBGK Part I & II certified"],
  },
  {
    id: "degup",
    label: "DEGUP",
    image: sceneLab,
    icon: Award,
    period: "Nov 2025 – Present",
    title: "Co-Founder, Degup PLT",
    organization: "SEEd.Lab · powered by PETRONAS & TCS",
    description:
      "Leading a patient-centric healthcare navigation platform that improves access to dialysis and related support services — engaging dialysis centres, stakeholders and patients, designing referral and slot-discovery workflows, and driving research, partnerships and community engagement.",
    facts: ["Dialysis access platform", "Provider partnerships", "Ops & referral workflows"],
    dark: true,
  },
];

const highlights = [
  {
    tag: "2018",
    title: "1st Place, Techstars Startup Weekend",
    description: "Winner at Techstars Startup Weekend Kota Bharu — the first taste of building ventures.",
  },
  {
    tag: "2018",
    title: "2nd Runner-Up, Business Pitching",
    description: "Kelantan Transit Tour at the Beehive International Social Innovation Conference, UMK Kota Bharu.",
  },
  {
    tag: "2018",
    title: "Activism Award",
    description: "Awarded by Persatuan Belia Harmoni Bandaraya Melaka for community activism.",
  },
  {
    tag: "2017",
    title: "Best Service Program Award",
    description: "MMU Awards recognition as Director of the MMU Melaka Career Fair 2017.",
  },
  {
    tag: "2016",
    title: "Compassionate Leader Award",
    description: "Presented by the Students' College Committee, MMU Melaka.",
  },
  {
    tag: "2015",
    title: "Female Outstanding Performance",
    description: "Committee award at the MMU Melaka Career Fair.",
  },
];

const credentials = [
  {
    title: "Bachelor of Law (LLB)",
    detail: "Multimedia University (MMU), Malaysia · 2018",
  },
  {
    title: "Advocate & Solicitor",
    detail: "Admitted to the High Court of Malaya · 16 April 2019",
  },
  {
    title: "YBGK Legal Aid Certified",
    detail: "Passed Part I & Part II assessments · 2021",
  },
];

const skillGroups = [
  {
    title: "Legal expertise",
    items: [
      "Legal research, litigation & dispute resolution",
      "Personal injury and running-down claims",
      "Criminal & civil litigation, conveyancing",
    ],
  },
  {
    title: "Communication",
    items: [
      "Excellent written and verbal communication",
      "Explaining complex legal concepts clearly",
      "Client, stakeholder and community engagement",
    ],
  },
  {
    title: "Adaptability & innovation",
    items: [
      "Tailored legal strategies for unique cases",
      "Innovative problem solving under pressure",
      "Market research and ecosystem mapping",
    ],
  },
];

const languages = [
  { name: "Malay", level: "A in SPM 2011" },
  { name: "English", level: "MUET Band 4 (Good User)" },
  { name: "Japanese", level: "Certified Beginner, Japan Foundation KL" },
  { name: "Mandarin", level: "MMU language course, 2013/2014" },
];

const leadership = [
  { year: "2013", role: "Student Welfare Division, MMU Melaka Students' Representative Council" },
  { year: "2014", role: "Director, MMU Melaka March Intake Orientation Programme" },
  { year: "2014", role: "President, Students' College Committee (MMU Melaka Hostel)" },
  { year: "2017", role: "Director, Multimedia University Melaka Career Fair 2017" },
];

const training = [
  { year: "2009", name: "Certified First Aider, St. John Ambulans Malaysia" },
  { year: "2010", name: "Kursus Membina Laman Web & E-Commerce, DPMM" },
  { year: "2012", name: "Training of Facilitator, MMU University Peer Group" },
  { year: "2013", name: "7th Malaysian Student Leaders Summit, UK Education Centre" },
  { year: "2013", name: "Student Leadership Symposium, EYE Project" },
  { year: "2014", name: "Youth Exchange Programme Malaysia–Brunei, KBS" },
  { year: "2015", name: "6th University Scholars Leadership Symposium, Hong Kong" },
  { year: "2017", name: "YSEALI Workshop, Hanoi, Vietnam" },
  { year: "2017", name: "Personal Data Protection Act Seminar, KKMM" },
  { year: "2018", name: "Criminal Trial Advocacy Workshop, MMU Melaka" },
  { year: "2018", name: "Civil Advocacy Course, Bar Council Malaysia" },
];

const insurers = [
  "Generali",
  "Liberty",
  "Berjaya Sompo",
  "Chubb",
  "Etiqa Takaful",
  "Etiqa General",
  "RHB",
  "Tokio Marine",
  "Zurich",
];


/** Returns 0 → 1 progress of an element travelling through the viewport. */
function useSceneProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      if (total <= 0) return;
      const p = Math.min(1, Math.max(0, -rect.top / total));
      setProgress(p);
    };
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return { ref, progress };
}

function Index() {
  const [entered, setEntered] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {!entered && <Intro onEnter={() => setEntered(true)} />}
      <ChapterRail />
      <Header />
      <main>
        <Opening />
        <PressBand />
        {chapters.map((chapter, i) => (
          <ChapterScene key={chapter.id} chapter={chapter} index={i} />
        ))}
        <Highlights />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

function Intro({ onEnter }: { onEnter: () => void }) {
  const [leaving, setLeaving] = useState(false);

  const enter = () => {
    setLeaving(true);
    window.setTimeout(onEnter, 650);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center overflow-hidden gradient-band px-6 text-center ${leaving ? "intro-leaving" : ""}`}
    >
      <div className="aurora -top-24 -left-16 h-96 w-96 bg-white/40" />
      <div className="aurora bottom-0 right-0 h-96 w-96 bg-white/30" />
      <div className="dot-grid absolute top-16 right-12 hidden h-28 w-28 text-white/40 md:block" />
      <div className="dot-grid absolute bottom-16 left-12 hidden h-28 w-28 text-white/40 md:block" />
      <div className="relative">
        <p className="intro-rise text-xs font-semibold uppercase tracking-[0.4em] text-white/80">
          Lawyer · Entrepreneur
        </p>
        <h1
          className="intro-rise mt-6 text-balance text-4xl font-extrabold leading-[1.05] text-white sm:text-6xl lg:text-7xl"
          style={{ animationDelay: "0.15s" }}
        >
          ATHIRAH
          <br />
          ABDULL SATTAR
        </h1>
        <p
          className="intro-rise mx-auto mt-6 max-w-md text-base text-white/85 sm:text-lg"
          style={{ animationDelay: "0.3s" }}
        >
          Scroll through the journey — from courtroom to dialysis clinic to startup lab.
        </p>

        <button
          type="button"
          onClick={enter}
          className="intro-rise mt-10 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-primary shadow-2xl shadow-black/20 transition-all hover:-translate-y-0.5"
          style={{ animationDelay: "0.45s" }}
        >
          Start the journey
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="container-tight flex h-20 items-center justify-between">
        <Link to="/" className="text-xl font-extrabold tracking-tight gradient-text">
          Athirah A. Sattar
        </Link>
        <nav className="hidden items-center gap-9 md:flex">
          {[
            { label: "Start", to: "#start" },
            ...chapters.map((c) => ({ label: c.label, to: `#${c.id}` })),
            { label: "Highlights", to: "#highlights" },
          ].map((link) => (
            <a
              key={link.label}
              href={link.to}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className="inline-flex items-center justify-center rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:bg-primary/90"
        >
          Get in touch
        </a>
      </div>
    </header>
  );
}

function ChapterRail() {
  const [active, setActive] = useState("start");

  useEffect(() => {
    const ids = ["start", ...chapters.map((c) => c.id), "highlights", "contact"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  const points = [
    { id: "start", label: "Start" },
    ...chapters.map((c) => ({ id: c.id, label: c.label })),
    { id: "highlights", label: "Highlights" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <div className="fixed left-6 top-1/2 z-40 hidden -translate-y-1/2 lg:block">
      <div className="flex flex-col gap-4">
        {points.map((p) => (
          <a key={p.id} href={`#${p.id}`} className="group flex items-center gap-3">
            <span
              className={`h-2.5 w-2.5 rounded-full transition-all ${
                active === p.id ? "scale-150 bg-primary" : "bg-primary/25 group-hover:bg-primary/60"
              }`}
            />
            <span
              className={`text-xs font-semibold uppercase tracking-widest transition-all ${
                active === p.id
                  ? "text-primary opacity-100"
                  : "text-muted-foreground opacity-0 group-hover:opacity-100"
              }`}
            >
              {p.label}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}

function Opening() {
  return (
    <section id="start" className="relative overflow-hidden section-padding">
      <div className="aurora -top-24 -left-20 h-80 w-80 bg-primary/40" />
      <div className="aurora top-10 right-0 h-96 w-96 bg-chart-2/35" />
      <div className="aurora bottom-0 left-1/3 h-72 w-72 bg-chart-5/40" />
      <div className="container-tight relative text-center">
        <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary">
          Lawyer · Startup Builder · Kuala Lumpur
        </p>
        <h1 className="mx-auto max-w-4xl text-balance text-4xl leading-[1.1] font-extrabold text-foreground sm:text-5xl lg:text-6xl">
          From litigation lawyer to <span className="gradient-text">healthcare startup builder</span>.
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Seven years solving complex problems across law, healthcare and entrepreneurship. Six of them in
          insurance civil litigation. Today I co-found DEGUP through PETRONAS SEEd.Lab, improving access to
          dialysis care.
        </p>
        <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          Law taught me how to think. Startups are teaching me how to build.
        </p>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-10 border-t border-border pt-8">
          <div>
            <p className="text-3xl font-extrabold gradient-text">7+</p>
            <p className="text-sm text-muted-foreground">Years across law & startups</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold gradient-text">RM450K</p>
            <p className="text-sm text-muted-foreground">Settlement negotiated solo</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold gradient-text">8</p>
            <p className="text-sm text-muted-foreground">Major insurers represented</p>
          </div>
        </div>

        <a
          href={`#${chapters[0]!.id}`}
          className="mt-14 inline-flex flex-col items-center gap-2 text-sm font-semibold text-primary"
        >
          Scroll to begin the journey
          <ChevronDown className="h-5 w-5 animate-bounce" />
        </a>
      </div>
    </section>
  );
}

function PressBand() {
  return (
    <section className="gradient-band py-7">
      <div className="container-tight">
        <p className="mb-4 text-center text-xs font-semibold uppercase tracking-[0.3em] text-primary-foreground/70">
          Insurers represented in litigation
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-3">
          {insurers.map((logo) => (
            <span key={logo} className="text-base font-semibold tracking-wide text-primary-foreground/90">
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function ChapterScene({ chapter, index }: { chapter: Chapter; index: number }) {
  const { ref, progress } = useSceneProgress<HTMLDivElement>();
  const Icon = chapter.icon;

  // eased reveal of the card between 15% and 55% of the scene
  const reveal = Math.min(1, Math.max(0, (progress - 0.12) / 0.35));
  const exit = Math.min(1, Math.max(0, (progress - 0.82) / 0.18));
  const cardOpacity = reveal * (1 - exit);
  const cardShift = (1 - reveal) * 60 - exit * 40;
  const bgShift = -12 + progress * 24;
  const bgScale = 1.12 + progress * 0.08;

  return (
    <section id={chapter.id} ref={ref} className="relative h-[260vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <img
          src={chapter.image}
          alt={`Illustrated scene: ${chapter.title}`}
          loading="lazy"
          width={1920}
          height={1088}
          className="absolute inset-0 h-full w-full object-cover will-change-transform"
          style={{ transform: `translate3d(0, ${bgShift}%, 0) scale(${bgScale})` }}
        />
        <div
          className={`absolute inset-0 ${
            chapter.dark
              ? "bg-gradient-to-r from-black/80 via-black/55 to-transparent"
              : "bg-gradient-to-r from-white/92 via-white/70 to-transparent"
          }`}
        />

        <div className="container-tight relative flex h-full items-center">
          <div
            className="max-w-xl will-change-transform"
            style={{ opacity: cardOpacity, transform: `translate3d(0, ${cardShift}px, 0)` }}
          >
            <div
              className={`inline-flex items-center gap-3 rounded-full px-4 py-2 text-xs font-bold uppercase tracking-[0.25em] ${
                chapter.dark ? "bg-white/15 text-white" : "bg-primary/10 text-primary"
              }`}
            >
              <span>Chapter {index + 1}</span>
              <span className="opacity-60">{chapter.period}</span>
            </div>

            <div
              className={`mt-6 flex h-14 w-14 items-center justify-center rounded-2xl ${
                chapter.dark ? "bg-white/15 text-white" : "bg-primary text-primary-foreground shadow-xl shadow-primary/30"
              }`}
            >
              <Icon className="h-7 w-7" />
            </div>

            <h2
              className={`mt-6 text-3xl font-extrabold leading-tight sm:text-5xl ${
                chapter.dark ? "text-white" : "text-foreground"
              }`}
            >
              {chapter.title}
            </h2>
            <p className={`mt-2 text-lg font-semibold ${chapter.dark ? "text-white/80" : "text-primary"}`}>
              {chapter.organization}
            </p>
            <p
              className={`mt-5 text-base leading-relaxed sm:text-lg ${
                chapter.dark ? "text-white/85" : "text-muted-foreground"
              }`}
            >
              {chapter.description}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              {chapter.facts.map((fact, i) => (
                <span
                  key={fact}
                  className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                    chapter.dark
                      ? "border-white/25 bg-white/10 text-white"
                      : "border-border bg-card text-card-foreground shadow-sm"
                  }`}
                  style={{
                    opacity: Math.min(1, Math.max(0, (progress - 0.3 - i * 0.06) / 0.15)) * (1 - exit),
                    transform: `translate3d(0, ${(1 - Math.min(1, Math.max(0, (progress - 0.3 - i * 0.06) / 0.15))) * 16}px, 0)`,
                  }}
                >
                  {fact}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* scene progress bar */}
        <div className="absolute inset-x-0 bottom-0 h-1.5 bg-black/10">
          <div className="gradient-band h-full origin-left" style={{ transform: `scaleX(${progress})` }} />
        </div>
      </div>
    </section>
  );
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) setShown(true);
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="transition-all duration-700 ease-out"
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "translateY(0)" : "translateY(32px)",
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function Highlights() {
  return (
    <section id="highlights" className="section-padding relative overflow-hidden bg-secondary/40">
      <div className="dot-grid absolute top-10 right-10 hidden h-28 w-28 text-primary/30 md:block" />
      <div className="container-tight relative">
        <Reveal>
          <div className="mb-12 max-w-2xl text-center md:mx-auto">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              Highlights & Recognition
            </p>
            <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
              Milestones that mark the path.
            </h2>
            <p className="mt-4 text-muted-foreground">
              Wins from the courtroom, the startup floor, and the community.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {highlights.map((item, i) => (
            <Reveal key={item.title} delay={i * 100}>
              <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-all hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/15">
                <div className="gradient-band absolute inset-x-0 top-0 h-1.5" />
                <span className="mt-2 mb-4 inline-flex w-fit rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                  {item.tag}
                </span>
                <h3 className="text-lg font-bold text-card-foreground">{item.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="section-padding gradient-band text-primary-foreground">
      <div className="container-tight">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-extrabold sm:text-4xl">The next chapter starts with a conversation.</h2>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-primary-foreground/80">
              Whether you’re a healthcare provider, a founder, an investor, or a team looking for legal and
              operational firepower — I’d love to hear from you.
            </p>
            <p className="mt-6 text-sm text-primary-foreground/70">
              LLB (Hons), Multimedia University · Based in Kuala Lumpur, Malaysia
            </p>
          </div>
          <div className="flex flex-col justify-center gap-6">
            <a
              href={`mailto:${EMAIL}`}
              className="group flex items-center gap-4 rounded-2xl border border-primary-foreground/25 bg-primary-foreground/10 p-5 transition-all hover:bg-primary-foreground/20"
            >
              <Mail className="h-6 w-6" />
              <div>
                <p className="text-sm font-medium text-primary-foreground/70">Email</p>
                <p className="font-semibold">{EMAIL}</p>
              </div>
            </a>
            <div className="flex flex-wrap gap-4">
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-5 py-2.5 text-sm font-semibold transition-all hover:bg-primary-foreground/20"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="container-tight flex flex-col items-center justify-between gap-4 sm:flex-row">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} Athirah Abd Sattar. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
            <Linkedin className="h-5 w-5" />
            <span className="sr-only">LinkedIn</span>
          </a>
          <a href={`mailto:${EMAIL}`} className="text-muted-foreground hover:text-foreground">
            <Mail className="h-5 w-5" />
            <span className="sr-only">Email</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

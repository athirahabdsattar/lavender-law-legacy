import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Award, Briefcase, Scale, ArrowRight, Mail, Linkedin } from "lucide-react";
import heroVisual from "../assets/hero-visual.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Athirah Abd Sattar | Lawyer & Healthcare Startup Builder" },
      { name: "description", content: "Athirah Abd Sattar — a lawyer turned entrepreneur. Awards, recognitions, and a career built at the intersection of law, strategy, and innovation." },
      { property: "og:title", content: "Athirah Abd Sattar | Lawyer & Healthcare Startup Builder" },
      { property: "og:description", content: "Athirah Abd Sattar — a lawyer turned entrepreneur. Awards, recognitions, and a career built at the intersection of law, strategy, and innovation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
});

const LINKEDIN_URL = "https://www.linkedin.com/in/athirahabdsattar";


const navLinks = [
  { label: "About", to: "#about" },
  { label: "Highlights", to: "#awards" },
  { label: "Journey", to: "#journey" },
  { label: "Contact", to: "#contact" },
];

const awards = [
  {
    year: "RM450,000",
    title: "Landmark Settlement",
    category: "Negotiated single-handedly",
    description: "Secured a RM450,000 settlement plus 10% costs without proceeding to a full trial.",
  },
  {
    year: "2025",
    title: "PETRONAS SEEd.Lab",
    category: "Social Entrepreneurship",
    description: "Selected to build DEGUP through PETRONAS SEEd.Lab, improving access to dialysis care in Malaysia.",
  },
  {
    year: "2017",
    title: "Best Service Program",
    category: "MMU Melaka Career Fair",
    description: "Honoured for leading the best service programme at the Multimedia University Melaka Career Fair.",
  },
  {
    year: "Pro Bono",
    title: "Legal Aid Advocate",
    category: "Criminal Defence",
    description: "Represented underprivileged clients in criminal matters, advocating for fair bail, remand and sentencing outcomes.",
  },
];

const journey = [
  {
    icon: Scale,
    period: "2018 – 2021",
    title: "Pupil to Legal Assistant",
    organization: "Messrs Syariful & Wan Zul, Kota Bharu",
    description: "Ran personal injury and running-down matters from first consultation through trial and settlement — investigations, evidence, drafting, negotiation and court advocacy.",
  },
  {
    icon: Briefcase,
    period: "2021 – 2025",
    title: "Lawyer / Legal Assistant",
    organization: "Messrs Kenneth William & Associates",
    description: "Independently managed insurance litigation for Generali, Liberty, Berjaya Sompo, Chubb, Etiqa, RHB, Tokio Marine and Zurich — including a RM450,000 settlement plus 10% costs.",
  },
  {
    icon: Scale,
    period: "2025",
    title: "Lawyer / Legal Assistant",
    organization: "Messrs Zuhaidie Akmal & Co, Kota Bharu",
    description: "Delivered pro bono and government-compensated legal aid in criminal matters, protecting clients' rights on bail, remand and sentencing.",
  },
  {
    icon: Award,
    period: "2025 – Present",
    title: "Co-Founder · Legal & Clinical Operations",
    organization: "DEGUP · PETRONAS SEEd.Lab",
    description: "Building a healthcare technology startup connecting dialysis patients with suitable treatment options and available slots — leading legal and clinical operations while driving customer discovery, provider partnerships and business model validation.",
  },
];

const pressLogos = ["Generali", "Liberty", "Berjaya Sompo", "Etiqa", "Tokio Marine", "Zurich"];


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
          From lawyer to healthcare startup builder. Building DEGUP.
        </p>

        <button
          type="button"
          onClick={enter}
          className="intro-rise mt-10 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-primary shadow-2xl shadow-black/20 transition-all hover:-translate-y-0.5"
          style={{ animationDelay: "0.45s" }}
        >
          Enter
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function Index() {
  const [entered, setEntered] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {!entered && <Intro onEnter={() => setEntered(true)} />}
      <Header />
      <main>
        <Hero />
        <PressBand />
        <Awards />
        <Journey />
        <Contact />
      </main>
      <Footer />
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
          {navLinks.map((link) => (
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

function Hero() {
  return (
    <section className="relative overflow-hidden section-padding">
      <div className="aurora -top-24 -left-20 h-80 w-80 bg-primary/40" />
      <div className="aurora top-10 right-0 h-96 w-96 bg-chart-2/35" />
      <div className="aurora bottom-0 left-1/3 h-72 w-72 bg-chart-5/40" />
      <div className="container-tight relative">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="order-2 lg:order-1" id="about">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary">
              Lawyer · Startup Builder · Kuala Lumpur
            </p>
            <h1 className="text-balance text-4xl leading-[1.1] font-extrabold text-foreground sm:text-5xl lg:text-6xl">
              From litigation lawyer to <span className="gradient-text">healthcare startup builder</span>.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Seven years solving complex problems across law, healthcare and entrepreneurship. Six of them in insurance civil litigation — running-down and personal injury, plaintiff and defendant, from legal opinion to full trial. Today I co-found DEGUP through PETRONAS SEEd.Lab, improving access to dialysis care.
            </p>
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Law taught me how to think. Startups are teaching me how to build.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#awards"
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-xl shadow-primary/30 transition-all hover:-translate-y-0.5 hover:bg-primary/90"
              >
                View highlights
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-7 py-3.5 text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:border-primary/40"
              >
                Work with me
              </a>
            </div>
            <div className="mt-12 flex flex-wrap items-center gap-10 border-t border-border pt-8">
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
          </div>

          <div className="relative order-1 lg:order-2">
            <div className="dot-grid absolute -top-6 -right-4 h-24 w-24 text-primary/40" />
            <div className="dot-grid absolute -bottom-6 -left-6 h-24 w-24 text-chart-2/40" />
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-accent shadow-2xl shadow-primary/20 lg:aspect-square">
              <img
                src={heroVisual}
                alt="Abstract visual representing law, entrepreneurship, and innovation in soft purple and white tones"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
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
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 md:justify-between">
          {pressLogos.map((logo) => (
            <span
              key={logo}
              className="text-lg font-semibold tracking-wide text-primary-foreground/90"
            >
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function Awards() {
  return (
    <section id="awards" className="section-padding relative overflow-hidden bg-secondary/40">
      <div className="container-tight relative">
        <div className="mb-12 max-w-2xl text-center md:mx-auto">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">Highlights & Recognition</p>
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
            Milestones that mark the path.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Wins from the courtroom, the startup floor, and the community.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {awards.map((award) => (
            <article
              key={award.title}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-all hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/15"
            >
              <div className="gradient-band absolute inset-x-0 top-0 h-1.5" />
              <span className="mt-2 mb-4 inline-flex w-fit rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
                {award.year}
              </span>
              <h3 className="text-lg font-bold text-card-foreground">{award.title}</h3>
              <p className="mt-1 text-sm font-medium text-primary">{award.category}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                {award.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


function Journey() {
  return (
    <section id="journey" className="section-padding">
      <div className="container-tight">
        <div className="mb-16 max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">The Journey</p>
          <h2 className="text-3xl font-extrabold text-foreground sm:text-4xl">
            Law was the foundation. Entrepreneurship is the frontier.
          </h2>
        </div>
        <div className="relative">
          <div className="absolute top-0 left-8 bottom-0 hidden w-px bg-border lg:block" />
          <div className="space-y-12">
            {journey.map((step) => (
              <div key={step.title} className="relative grid gap-6 lg:grid-cols-[12rem_1fr] lg:gap-12">
                <div className="hidden items-center gap-4 lg:flex">
                  <span className="text-sm font-semibold text-muted-foreground">{step.period}</span>
                  <span className="h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
                </div>
                <div className="rounded-2xl border border-border/70 bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10 sm:p-8">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <step.icon className="h-5 w-5" />
                  </div>
                  <span className="mb-2 block text-sm font-semibold text-primary lg:hidden">{step.period}</span>
                  <h3 className="text-xl font-bold text-card-foreground">{step.title}</h3>
                  <p className="mt-1 font-medium text-muted-foreground">{step.organization}</p>
                  <p className="mt-4 leading-relaxed text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
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
            <h2 className="text-3xl font-extrabold sm:text-4xl">Let’s build something meaningful.</h2>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-primary-foreground/80">
              Whether you’re a healthcare provider, a founder, an investor, or a team looking for legal and operational firepower — I’d love to hear from you.
            </p>
            <p className="mt-6 text-sm text-primary-foreground/70">
              LLB (Hons), Multimedia University · Based in Kuala Lumpur, Malaysia
            </p>
          </div>
          <div className="flex flex-col justify-center gap-6">
            <a
              href="mailto:athirahlegal@gmail.com"
              className="group flex items-center gap-4 rounded-2xl border border-primary-foreground/25 bg-primary-foreground/10 p-5 transition-all hover:bg-primary-foreground/20"
            >
              <Mail className="h-6 w-6" />
              <div>
                <p className="text-sm font-medium text-primary-foreground/70">Email</p>
                <p className="font-semibold">athirahlegal@gmail.com</p>
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
          <a href="mailto:athirahlegal@gmail.com" className="text-muted-foreground hover:text-foreground">
            <Mail className="h-5 w-5" />
            <span className="sr-only">Email</span>
          </a>

        </div>
      </div>
    </footer>
  );
}

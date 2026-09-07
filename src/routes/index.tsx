import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, Briefcase, Scale, ArrowRight, Mail, Linkedin, Twitter } from "lucide-react";
import heroVisual from "../assets/hero-visual.jpg";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Alexandra Chen | Lawyer & Entrepreneur" },
      { name: "description", content: "A lawyer turned entrepreneur. Explore awards, recognitions, and a career built at the intersection of law, strategy, and innovation." },
      { property: "og:title", content: "Alexandra Chen | Lawyer & Entrepreneur" },
      { property: "og:description", content: "A lawyer turned entrepreneur. Explore awards, recognitions, and a career built at the intersection of law, strategy, and innovation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: heroVisual },
      { name: "twitter:image", content: heroVisual },
    ],
  }),
});

const navLinks = [
  { label: "About", to: "#about" },
  { label: "Awards", to: "#awards" },
  { label: "Journey", to: "#journey" },
  { label: "Contact", to: "#contact" },
];

const awards = [
  {
    year: "2024",
    title: "Forbes 30 Under 30",
    category: "Law & Policy",
    description: "Recognized for building a legal-tech platform that reshapes access to corporate counsel.",
  },
  {
    year: "2023",
    title: "Women in Business Award",
    category: "Entrepreneurship",
    description: "Honored by the National Association of Women Business Owners for scaling a mission-driven venture.",
  },
  {
    year: "2022",
    title: "Rising Star",
    category: "Legal Practice",
    description: "Selected by a leading legal directory for exceptional work in technology transactions and venture finance.",
  },
  {
    year: "2021",
    title: "Pro Bono Champion",
    category: "Public Service",
    description: "Awarded for founding a clinic that provided free counsel to over 200 early-stage founders.",
  },
];

const journey = [
  {
    icon: Scale,
    period: "2016 – 2020",
    title: "Senior Associate, Technology & Venture Capital",
    organization: "Morrison & Vale LLP",
    description: "Advised growth-stage companies on financings, M&A, and regulatory strategy. Closed more than $800M in transactions.",
  },
  {
    icon: Briefcase,
    period: "2020 – 2022",
    title: "General Counsel",
    organization: "Northbridge Labs",
    description: "Built the legal function from the ground up, led the Series B, and structured international expansion into three markets.",
  },
  {
    icon: Award,
    period: "2022 – Present",
    title: "Founder & CEO",
    organization: "Lexora",
    description: "Founded a platform that automates legal operations for startups. Now serving 1,200+ companies across 12 countries.",
  },
];

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
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
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
      <div className="container-tight flex h-16 items-center justify-between">
        <Link to="/" className="font-heading text-lg font-bold text-foreground">
          A. Chen
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.to}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <a
          href="#contact"
          className="inline-flex items-center justify-center rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
        >
          Get in touch
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section className="section-padding overflow-hidden">
      <div className="container-tight">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="order-2 lg:order-1">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary">
              Lawyer · Entrepreneur · Strategist
            </p>
            <h1 className="text-balance text-4xl leading-tight font-bold text-foreground sm:text-5xl lg:text-6xl">
              From courtroom counsel to <span className="text-primary">founder</span>.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              I built a career interpreting risk for others — then took one myself. Today I run a legal-tech company, advise founders, and champion access to justice.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a
                href="#awards"
                className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90"
              >
                View recognitions
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-6 py-3 text-sm font-semibold text-foreground transition-all hover:bg-accent"
              >
                Work with me
              </a>
            </div>
            <div className="mt-12 flex items-center gap-8 border-t border-border pt-8">
              <div>
                <p className="text-3xl font-bold text-foreground">$800M+</p>
                <p className="text-sm text-muted-foreground">Transactions advised</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">1,200+</p>
                <p className="text-sm text-muted-foreground">Companies served</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">12</p>
                <p className="text-sm text-muted-foreground">Countries reached</p>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-accent shadow-2xl shadow-primary/10 lg:aspect-square">
              <img
                src={heroVisual}
                alt="Abstract visual representing law, entrepreneurship, and innovation in soft purple and white tones"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Awards() {
  return (
    <section id="awards" className="section-padding bg-secondary/50">
      <div className="container-tight">
        <div className="mb-12 max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">Awards & Recognition</p>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Milestones that mark the path.
          </h2>
          <p className="mt-4 text-muted-foreground">
            A selection of honors from legal practice, entrepreneurship, and public service.
          </p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {awards.map((award) => (
            <article
              key={award.title}
              className="group flex flex-col rounded-2xl border border-border bg-card p-6 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
            >
              <span className="mb-4 inline-flex w-fit rounded-full bg-accent px-3 py-1 text-xs font-semibold text-accent-foreground">
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
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
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
                <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
                  <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
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
    <section id="contact" className="section-padding bg-primary text-primary-foreground">
      <div className="container-tight">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold sm:text-4xl">Let’s build something meaningful.</h2>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-primary-foreground/80">
              Whether you’re a founder seeking counsel, a publication planning a profile, or an organization looking for a speaker, I’d love to hear from you.
            </p>
          </div>
          <div className="flex flex-col justify-center gap-6">
            <a
              href="mailto:hello@alexandrachen.example"
              className="group flex items-center gap-4 rounded-2xl border border-primary-foreground/20 bg-primary-foreground/10 p-5 transition-all hover:bg-primary-foreground/20"
            >
              <Mail className="h-6 w-6" />
              <div>
                <p className="text-sm font-medium text-primary-foreground/70">Email</p>
                <p className="font-semibold">hello@alexandrachen.example</p>
              </div>
            </a>
            <div className="flex flex-wrap gap-4">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-5 py-2.5 text-sm font-semibold transition-all hover:bg-primary-foreground/20"
              >
                <Linkedin className="h-4 w-4" />
                LinkedIn
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/10 px-5 py-2.5 text-sm font-semibold transition-all hover:bg-primary-foreground/20"
              >
                <Twitter className="h-4 w-4" />
                Twitter
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
          © {new Date().getFullYear()} Alexandra Chen. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
            <Linkedin className="h-5 w-5" />
            <span className="sr-only">LinkedIn</span>
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
            <Twitter className="h-5 w-5" />
            <span className="sr-only">Twitter</span>
          </a>
        </div>
      </div>
    </footer>
  );
}

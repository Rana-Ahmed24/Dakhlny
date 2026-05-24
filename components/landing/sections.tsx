import Link from "next/link";
import { ArrowRight, Shield, Phone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

const steps = [
  {
    step: "01",
    title: "Submit your request",
    description:
      "Share your village, date, and guest details in under a minute.",
  },
  {
    step: "02",
    title: "Personal coordination",
    description:
      "Our team reaches you on phone or WhatsApp — no bots, no waiting.",
  },
  {
    step: "03",
    title: "Access confirmed",
    description:
      "Once arranged, you receive clear confirmation for your visit.",
  },
];

const trustPoints = [
  {
    icon: Shield,
    title: "Trusted coordination",
    description:
      "Every request is handled personally by our North Coast operations team.",
  },
  {
    icon: Phone,
    title: "Direct & fast",
    description:
      "We contact you quickly via phone or WhatsApp during peak season.",
  },
  {
    icon: Sparkles,
    title: "Premium destinations",
    description:
      "Access to Marassi, Hacienda, La Vista, and Egypt's finest villages.",
  },
];

const faqs = [
  {
    q: "How long does it take to get access?",
    a: "Most requests are coordinated within a few hours during peak season. We prioritize fast personal follow-up.",
  },
  {
    q: "Do I contact the provider directly?",
    a: "No. Our team handles all coordination. You never need to contact providers yourself.",
  },
  {
    q: "Which villages do you support?",
    a: "We support major North Coast villages including Marina, Marassi, Hacienda, Amwaj, La Vista, and more.",
  },
  {
    q: "How do I become a provider?",
    a: "Submit a provider application. Our team reviews it and contacts you if approved.",
  },
];

export function LandingHero() {
  return (
    <section className="relative min-h-[92vh] overflow-hidden luxury-gradient text-white">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(94,180,212,0.18),transparent)]" />
      <div className="absolute -right-24 top-32 h-72 w-72 rounded-full bg-ocean-glow/10 blur-[100px]" />
      <div className="absolute -left-16 bottom-20 h-56 w-56 rounded-full bg-sand/10 blur-[80px]" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-cream to-transparent" />

      <div className="relative mx-auto flex min-h-[92vh] max-w-6xl flex-col justify-center px-4 pb-28 pt-24 sm:px-6 sm:pb-32">
        <p className="animate-fade-in-up text-xs font-semibold uppercase tracking-[0.3em] text-sand-light/90">
          North Coast Egypt
        </p>
        <h1 className="animate-fade-in-up mt-6 max-w-[14ch] font-display text-[2.75rem] font-light leading-[1.05] tracking-tight sm:max-w-none sm:text-6xl lg:text-7xl">
          Luxury access,
          <span className="mt-1 block text-sand-light">personally arranged</span>
        </h1>
        <p className="animate-fade-in-delay mt-8 max-w-md text-base leading-relaxed text-white/65 sm:text-lg">
          Dakhlny coordinates guest access to Egypt&apos;s most exclusive coastal
          villages — with the care of a private concierge.
        </p>

        <div className="animate-fade-in-delay mt-12 hidden flex-wrap gap-4 sm:flex">
          <Button asChild size="xl" variant="sand">
            <Link href="/request-access">
              Request Access
              <ArrowRight />
            </Link>
          </Button>
          <Button asChild size="xl" variant="luxury">
            <Link href="/become-provider">Become a Provider</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-cream px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-ocean">
            The experience
          </p>
          <h2 className="mt-3 font-display text-4xl font-light tracking-tight text-navy sm:text-5xl">
            How it works
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Simple, fast, and personal — no automated matching or complicated
            systems.
          </p>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-3 sm:gap-6">
          {steps.map((item, i) => (
            <div
              key={item.step}
              className="group rounded-[1.75rem] border border-white/80 bg-white p-7 shadow-[0_16px_48px_rgba(7,16,24,0.05)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_24px_60px_rgba(7,16,24,0.08)]"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              <span className="font-display text-4xl font-light text-ocean/25">
                {item.step}
              </span>
              <h3 className="mt-5 font-display text-2xl font-light text-navy">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TrustSection() {
  return (
    <section className="px-4 py-20 sm:px-6 sm:py-28">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-ocean">
            Why Dakhlny
          </p>
          <h2 className="mt-3 font-display text-4xl font-light tracking-tight text-navy sm:text-5xl">
            Why trust us
          </h2>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-3 sm:gap-6">
          {trustPoints.map((point) => (
            <div
              key={point.title}
              className="rounded-[1.75rem] border border-border/50 bg-white/70 p-7 backdrop-blur-sm"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-sand-muted">
                <point.icon className="h-5 w-5 text-ocean" strokeWidth={1.5} />
              </div>
              <h3 className="font-display text-xl font-light text-navy">
                {point.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {point.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FAQSection() {
  return (
    <section id="faq" className="luxury-gradient px-4 py-20 text-white sm:px-6 sm:py-28">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sand-light/80">
            FAQ
          </p>
          <h2 className="mt-3 font-display text-4xl font-light tracking-tight sm:text-5xl">
            Common questions
          </h2>
        </div>

        <div className="mt-12 space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-5 backdrop-blur-sm transition-colors open:bg-white/[0.07]"
            >
              <summary className="cursor-pointer list-none font-medium tracking-tight marker:hidden [&::-webkit-details-marker]:hidden">
                {faq.q}
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-white/60">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

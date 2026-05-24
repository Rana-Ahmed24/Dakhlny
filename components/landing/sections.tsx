import Link from "next/link";
import { ArrowRight, Shield, Phone, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SUPPORTED_VILLAGES } from "@/lib/constants";

const steps = [
  {
    step: "01",
    title: "Submit your request",
    description:
      "Fill out a quick form with your village, date, and guest details.",
  },
  {
    step: "02",
    title: "We coordinate manually",
    description:
      "Our team contacts you via phone or WhatsApp to confirm availability.",
  },
  {
    step: "03",
    title: "Access confirmed",
    description:
      "Once everything is arranged, you receive confirmation for your visit.",
  },
];

const trustPoints = [
  {
    icon: Shield,
    title: "Trusted coordination",
    description:
      "Every request is handled personally by our experienced North Coast team.",
  },
  {
    icon: Phone,
    title: "Direct communication",
    description:
      "We reach you quickly via phone or WhatsApp — no waiting on automated systems.",
  },
  {
    icon: Users,
    title: "Premium villages",
    description:
      "Access to Egypt's most sought-after coastal compounds and resorts.",
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
    a: "We support major North Coast villages including Marina, Marassi, Hacienda, Amwaj, and more.",
  },
  {
    q: "How do I become a provider?",
    a: "Submit a provider application. Our team reviews it and contacts you if approved.",
  },
];

export function LandingHero() {
  return (
    <section className="relative overflow-hidden bg-navy px-4 pb-20 pt-12 text-white sm:px-6 sm:pb-28 sm:pt-20">
      <div className="absolute inset-0 bg-gradient-to-br from-ocean/20 via-transparent to-transparent" />
      <div className="absolute -right-20 top-20 h-64 w-64 rounded-full bg-ocean/10 blur-3xl" />
      <div className="absolute -left-10 bottom-10 h-48 w-48 rounded-full bg-sand/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-sand">
          North Coast Egypt
        </p>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          Premium guest access,{" "}
          <span className="text-sand">personally coordinated</span>
        </h1>
        <p className="mt-6 max-w-xl text-lg text-white/70">
          Request access to North Coast villages or apply to become a provider.
          Our team handles every detail manually for a seamless experience.
        </p>

        <div className="mt-10 hidden flex-wrap gap-4 sm:flex">
          <Button asChild size="xl" variant="sand">
            <Link href="/request-access">
              Request Access
              <ArrowRight />
            </Link>
          </Button>
          <Button asChild size="xl" variant="outline" className="border-white/30 text-white hover:bg-white/10">
            <Link href="/become-provider">Become a Provider</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          How it works
        </h2>
        <p className="mt-3 max-w-lg text-muted-foreground">
          Simple, fast, and personal — no automated matching or complicated
          booking systems.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {steps.map((item) => (
            <div
              key={item.step}
              className="rounded-2xl border border-border/60 bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <span className="text-3xl font-bold text-primary/30">
                {item.step}
              </span>
              <h3 className="mt-4 text-xl font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function VillagesSection() {
  return (
    <section id="villages" className="bg-muted/40 px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Supported villages
        </h2>
        <p className="mt-3 max-w-lg text-muted-foreground">
          We coordinate access across Egypt&apos;s premier North Coast
          destinations.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          {SUPPORTED_VILLAGES.filter((v) => v !== "Other").map((village) => (
            <span
              key={village}
              className="rounded-full border border-border bg-white px-5 py-2.5 text-sm font-medium shadow-sm"
            >
              {village}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TrustSection() {
  return (
    <section className="px-4 py-16 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Why trust us
        </h2>
        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {trustPoints.map((point) => (
            <div
              key={point.title}
              className="rounded-2xl border border-border/60 bg-card p-6"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <point.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">{point.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
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
    <section id="faq" className="bg-navy px-4 py-16 text-white sm:px-6 sm:py-24">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Frequently asked questions
        </h2>
        <div className="mt-12 space-y-4">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <summary className="cursor-pointer list-none text-lg font-semibold marker:hidden">
                {faq.q}
              </summary>
              <p className="mt-3 text-white/70">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

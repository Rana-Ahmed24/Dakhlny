import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Shield, Phone, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SECTION_IMAGES } from "@/lib/visual-assets";

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

export function HowItWorks() {
  return (
    <section id="how-it-works" className="relative overflow-hidden bg-cream">
      <div className="mx-auto max-w-6xl lg:grid lg:grid-cols-2 lg:gap-0">
        <div className="relative min-h-[280px] lg:min-h-full">
          <Image
            src={SECTION_IMAGES.howItWorks}
            alt="Golden hour on the beach"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cream via-transparent to-[#071018]/30 lg:bg-gradient-to-r lg:from-transparent lg:to-cream" />
        </div>

        <div className="px-4 py-16 sm:px-8 sm:py-24 lg:py-28">
          <p className="type-eyebrow text-ocean">
            The experience
          </p>
          <h2 className="type-display-xl mt-5 text-navy">
            Effortless access
          </h2>
          <p className="type-body-lead mt-5 max-w-md text-muted-foreground">
            Like a private concierge — we handle the details so you only enjoy
            the summer.
          </p>

          <div className="mt-12 space-y-8">
            {steps.map((item) => (
              <div key={item.step} className="flex gap-5 border-l border-sand pl-6">
                <span className="font-display text-3xl font-light leading-none text-ocean/30">
                  {item.step}
                </span>
                <div>
                  <h3 className="font-display text-xl font-light text-navy">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function TrustSection() {
  return (
    <section className="relative min-h-[520px] overflow-hidden py-20 sm:py-28">
      <Image
        src={SECTION_IMAGES.trust}
        alt="Aerial Mediterranean coastline"
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-[#071018]/82" />
      <div className="film-grain pointer-events-none absolute inset-0 opacity-25" />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-xl">
          <p className="type-eyebrow text-sand-light/80">
            Why Dakhlny
          </p>
          <h2 className="type-display-xl mt-5 text-white">
            White-glove coordination
          </h2>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-3 sm:gap-6">
          {trustPoints.map((point) => (
            <div
              key={point.title}
              className="rounded-2xl border border-white/10 bg-white/[0.06] p-7 backdrop-blur-md transition-colors hover:bg-white/[0.1]"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
                <point.icon className="h-5 w-5 text-sand-light" strokeWidth={1.5} />
              </div>
              <h3 className="type-display-md text-white">
                {point.title}
              </h3>
              <p className="type-body mt-3 text-white/60">
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
    <section id="faq" className="relative overflow-hidden py-20 sm:py-28">
      <Image
        src={SECTION_IMAGES.faq}
        alt="Coastal evening atmosphere"
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#071018]/90 via-[#0c1829]/88 to-[#071018]/95" />
      <div className="film-grain pointer-events-none absolute inset-0 opacity-20" />

      <div className="relative z-10 mx-auto max-w-3xl px-4 sm:px-6">
        <div className="text-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-sand-light/70">
            FAQ
          </p>
          <h2 className="mt-4 font-display text-4xl font-light tracking-tight text-white sm:text-5xl">
            Before you arrive
          </h2>
        </div>

        <div className="mt-12 space-y-3">
          {faqs.map((faq) => (
            <details
              key={faq.q}
              className="group rounded-2xl border border-white/10 bg-black/20 px-6 py-5 backdrop-blur-md open:border-sand/20 open:bg-black/30"
            >
              <summary className="cursor-pointer list-none text-[0.9375rem] font-semibold tracking-[-0.02em] text-white marker:hidden sm:text-base [&::-webkit-details-marker]:hidden">
                {faq.q}
              </summary>
              <p className="type-body mt-3 text-white/55">{faq.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Button asChild size="lg" variant="sand">
            <Link href="/request-access">
              Start your summer
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

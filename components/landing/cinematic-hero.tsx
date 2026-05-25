"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { HERO_IMAGES } from "@/lib/visual-assets";

export function CinematicHero() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const parallax = Math.min(scrollY * 0.35, 180);

  return (
    <section className="relative h-[100svh] min-h-[640px] w-full overflow-hidden bg-[#071018]">
      {/* Primary cinematic plate */}
      <div
        className="absolute inset-0 will-change-transform"
        style={{ transform: `translate3d(0, ${parallax * 0.4}px, 0) scale(1.05)` }}
      >
        <div className="absolute inset-0 animate-ken-burns">
          <Image
            src={HERO_IMAGES.primary}
            alt={HERO_IMAGES.alt}
            fill
            priority
            sizes="100vw"
            className="hero-photo-primary object-cover object-center"
          />
        </div>
      </div>

      {/* Secondary depth — ocean accent layer */}
      <div
        className="absolute inset-0 opacity-[0.35] mix-blend-screen"
        style={{ transform: `translate3d(0, ${parallax * 0.2}px, 0)` }}
      >
        <Image
          src={HERO_IMAGES.secondary}
          alt=""
          fill
          sizes="100vw"
          className="hero-photo-secondary object-cover object-right-top"
          aria-hidden
        />
      </div>

      {/* Cinematic navy / ocean grade */}
      <div className="hero-vignette pointer-events-none absolute inset-0 z-[1]" />
      <div className="hero-ocean-tint pointer-events-none absolute inset-0 z-[2]" />
      <div className="hero-navy-depth pointer-events-none absolute inset-0 z-[2]" />
      <div className="hero-ocean-veil pointer-events-none absolute inset-0 z-[2]" />
      <div className="hero-ocean-glow pointer-events-none absolute inset-0 z-[2]" />
      <div className="hero-coastal-light pointer-events-none absolute inset-0 z-[2]" />
      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-r from-[#071018]/70 via-transparent to-[#1a3d52]/50" />
      <div className="film-grain pointer-events-none absolute inset-0 z-[3] opacity-[0.18] mix-blend-overlay" />

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-end px-4 pb-32 pt-28 sm:px-6 sm:pb-36 lg:justify-center lg:pb-28">
        <div className="mx-auto w-full max-w-6xl">
          <p className="type-eyebrow animate-fade-in-up text-sand-light/90">
            North Coast Egypt · Summer
          </p>
          <h1 className="type-display-hero animate-fade-in-up mt-6 max-w-[11ch] text-[#faf7f2] sm:max-w-none">
            Your key to the
            <span className="mt-1 block bg-gradient-to-r from-[#e4d5bc] via-[#faf7f2] to-[#c9b896] bg-clip-text text-transparent sm:mt-2">
              coast
            </span>
          </h1>
          <p className="type-body-lead animate-fade-in-delay mt-7 max-w-md text-[#e4d5bc]/85">
            Yacht clubs. Private beaches. Exclusive villages. Dakhlny arranges
            your access with white-glove coordination.
          </p>

          <div className="animate-fade-in-delay mt-10 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Button asChild size="xl" variant="sand" className="w-full sm:w-auto">
              <Link href="/request-access">
                Request Access
                <ArrowRight />
              </Link>
            </Button>
            <Button asChild size="xl" variant="luxury" className="w-full sm:w-auto">
              <Link href="/become-provider">Become a Provider</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <a
        href="#villages"
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-[#e4d5bc]/45 transition-colors hover:text-sand-light"
        aria-label="Scroll to destinations"
      >
        <span className="type-eyebrow text-[0.6rem] tracking-[0.3em]">
          Explore
        </span>
        <ChevronDown className="h-5 w-5 animate-bounce" />
      </a>

      {/* Fade into next section */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 z-[4] h-32 bg-gradient-to-t from-[#0a0f14] via-[#071018]/80 to-transparent" />
    </section>
  );
}

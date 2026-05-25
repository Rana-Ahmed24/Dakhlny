"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SHOWCASE_VILLAGES } from "@/lib/village-showcase";

function DestinationCard({
  village,
}: {
  village: (typeof SHOWCASE_VILLAGES)[number];
}) {
  return (
    <Link
      href="/request-access"
      className="group relative flex h-[22rem] w-[17rem] shrink-0 snap-center overflow-hidden rounded-[1.25rem] sm:h-[24rem] sm:w-[19rem]"
    >
      <Image
        src={village.image}
        alt={village.imageAlt}
        fill
        sizes="(max-width: 640px) 85vw, 320px"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#071018] via-[#071018]/50 to-[#071018]/10 transition-opacity duration-500 group-hover:via-[#071018]/40" />
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `linear-gradient(135deg, ${village.accent}22 0%, transparent 55%)`,
        }}
      />
      <div className="film-grain pointer-events-none absolute inset-0 opacity-20" />

      <div className="relative z-10 flex h-full flex-col justify-end p-6">
        <div>
          <h3
            className="type-display-lg text-white"
            style={{ textShadow: "0 4px 30px rgba(0,0,0,0.5)" }}
          >
            {village.name}
          </h3>
          <p className="type-eyebrow mt-2 text-[0.6rem] tracking-[0.2em] text-white/55">
            {village.developer}
          </p>
          <p className="type-body mt-2 text-white/70">{village.tagline}</p>
          <div
            className="type-eyebrow mt-5 flex items-center gap-1.5 text-[0.625rem] tracking-[0.2em] text-white/80 transition-colors group-hover:text-sand-light"
          >
            Request access
            <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}

export function VillageCarousel() {
  return (
    <section
      id="villages"
      className="relative overflow-hidden bg-[#0a0f14] py-20 sm:py-28"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(26,95,122,0.15),transparent)]" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <div className="max-w-xl">
          <p className="type-eyebrow text-ocean-glow/90">
            Destinations
          </p>
          <h2 className="type-display-xl mt-5 text-white">
            The North Coast,
            <span className="block text-sand-light">curated for you</span>
          </h2>
          <p className="type-body-lead mt-5 text-white/55">
            Swipe through Egypt&apos;s most exclusive summer addresses — each
            one a private world of sea, sun, and privilege.
          </p>
        </div>
      </div>

      <div className="relative mt-12">
        <div
          className="pointer-events-none absolute left-0 top-0 z-10 h-full w-10 bg-gradient-to-r from-[#0a0f14] to-transparent sm:w-20"
          aria-hidden
        />
        <div
          className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-4 sm:gap-5 sm:px-[max(1rem,calc((100vw-72rem)/2+1.5rem))]"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {SHOWCASE_VILLAGES.map((village) => (
            <DestinationCard key={village.id} village={village} />
          ))}
        </div>
        <div
          className="pointer-events-none absolute right-0 top-0 z-10 h-full w-10 bg-gradient-to-l from-[#0a0f14] to-transparent sm:w-20"
          aria-hidden
        />
      </div>

      <p className="type-eyebrow relative mt-8 text-center tracking-[0.22em] text-white/40">
        Swipe to explore →
      </p>
    </section>
  );
}

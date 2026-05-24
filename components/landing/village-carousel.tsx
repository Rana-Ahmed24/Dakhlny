"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SHOWCASE_VILLAGES } from "@/lib/village-showcase";
import { cn } from "@/lib/utils";

function VillageLogo({ name, accent }: { name: string; accent: string }) {
  return (
    <div className="relative">
      <p
        className="font-display text-[2rem] font-light leading-none tracking-[0.08em] text-white sm:text-[2.25rem]"
        style={{ textShadow: `0 2px 24px ${accent}40` }}
      >
        {name}
      </p>
      <div
        className="mt-3 h-px w-12"
        style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
      />
    </div>
  );
}

function VillageCard({
  village,
  className,
}: {
  village: (typeof SHOWCASE_VILLAGES)[number];
  className?: string;
}) {
  return (
    <Link
      href="/request-access"
      className={cn(
        "group relative flex h-[17rem] w-[15rem] shrink-0 snap-center flex-col justify-between overflow-hidden rounded-[1.75rem] p-6 transition-transform duration-500 active:scale-[0.98] sm:h-[19rem] sm:w-[16.5rem] sm:hover:scale-[1.02]",
        `bg-gradient-to-br ${village.gradient}`,
        className
      )}
    >
      <div className="absolute inset-0 coastal-shimmer opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
      <div
        className="absolute -right-8 -top-8 h-32 w-32 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-125"
        style={{ backgroundColor: `${village.accent}25` }}
      />
      <div
        className="absolute -bottom-10 -left-6 h-28 w-28 rounded-full blur-2xl"
        style={{ backgroundColor: `${village.accent}15` }}
      />

      <div className="relative">
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50">
          {village.developer}
        </p>
      </div>

      <div className="relative">
        <VillageLogo name={village.name} accent={village.accent} />
        <p className="mt-3 text-sm font-light text-white/65">{village.tagline}</p>
      </div>

      <div className="relative flex items-center gap-1 text-xs font-medium uppercase tracking-[0.15em] text-white/70 transition-colors group-hover:text-white">
        Request access
        <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

export function VillageCarousel() {
  return (
    <section id="villages" className="overflow-hidden bg-cream py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="mb-10 max-w-xl animate-fade-in-up">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-ocean">
            Destinations
          </p>
          <h2 className="mt-3 font-display text-4xl font-light tracking-tight text-navy sm:text-5xl">
            North Coast villages
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground">
            Swipe through Egypt&apos;s most exclusive coastal destinations. We
            coordinate access personally for each one.
          </p>
        </div>
      </div>

      <div className="relative">
        <div
          className="pointer-events-none absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-cream to-transparent sm:w-16"
          aria-hidden
        />
        <div
          className="hide-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:gap-5 sm:px-[max(1rem,calc((100vw-72rem)/2+1.5rem))]"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {SHOWCASE_VILLAGES.map((village) => (
            <VillageCard key={village.id} village={village} />
          ))}
        </div>
        <div
          className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-cream to-transparent sm:w-16"
          aria-hidden
        />
      </div>

      <p className="mt-6 text-center text-xs tracking-wide text-muted-foreground sm:hidden">
        Swipe to explore →
      </p>
    </section>
  );
}

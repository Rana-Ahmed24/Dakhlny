import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";
import { SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** Navbar / compact header mark — logo.png */
export function BrandMark({
  overlay = false,
  priority = false,
}: {
  overlay?: boolean;
  priority?: boolean;
}) {
  return (
    <Link
      href="/"
      className="group flex items-center gap-2.5 transition-opacity hover:opacity-90 sm:gap-3"
      aria-label={`${SITE_NAME} home`}
    >
      <BrandLogo
        variant="compact"
        priority={priority}
        onDark={overlay}
        className="h-9 w-9 sm:h-10 sm:w-10"
      />
      <span
        className={cn(
          "hidden font-display text-[1.2rem] font-semibold tracking-[-0.03em] sm:inline sm:text-[1.35rem]",
          overlay ? "text-sand-light" : "text-navy"
        )}
      >
        {SITE_NAME}
      </span>
    </Link>
  );
}

/** Footer / hero / onboarding — logo2.jpg (light mark on dark backgrounds) */
export function BrandPresentation({
  className,
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <BrandLogo
      variant="presentation"
      priority={priority}
      className={cn("h-14 w-[8.5rem] sm:h-16 sm:w-40", className)}
      imageClassName="object-contain object-left"
    />
  );
}

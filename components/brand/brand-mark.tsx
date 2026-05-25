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
        className="h-8 w-8 transition-transform duration-300 group-active:scale-95 sm:h-9 sm:w-9"
        imageClassName="drop-shadow-[0_2px_12px_rgba(0,0,0,0.25)]"
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

/** Footer / hero / onboarding — logo2.jpg */
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
      className={cn("h-9 w-[7.25rem] sm:h-10 sm:w-32", className)}
      imageClassName="object-left opacity-90"
    />
  );
}

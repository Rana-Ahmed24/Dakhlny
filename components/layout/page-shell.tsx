import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface PageShellProps {
  children: React.ReactNode;
  className?: string;
  dark?: boolean;
}

export function PageShell({ children, className, dark = false }: PageShellProps) {
  return (
    <div
      className={cn(
        "relative min-h-screen",
        dark ? "bg-navy text-white" : "bg-background text-foreground",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SiteHeader({ dark = false }: { dark?: boolean }) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b backdrop-blur-md",
        dark
          ? "border-white/10 bg-navy/90"
          : "border-border/50 bg-background/90"
      )}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2">
          <div
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold",
              dark ? "bg-ocean-light text-white" : "bg-ocean/15 text-ocean-light"
            )}
          >
            D
          </div>
          <span
            className={cn(
              "text-lg font-semibold tracking-tight",
              dark ? "text-sand-light" : "text-ocean-light"
            )}
          >
            {SITE_NAME}
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium sm:flex">
          <Link
            href="/#how-it-works"
            className={cn(
              "transition-colors hover:text-primary",
              dark ? "text-white/80" : "text-muted-foreground"
            )}
          >
            How it works
          </Link>
          <Link
            href="/#villages"
            className={cn(
              "transition-colors hover:text-primary",
              dark ? "text-white/80" : "text-muted-foreground"
            )}
          >
            Villages
          </Link>
          <Link
            href="/#faq"
            className={cn(
              "transition-colors hover:text-primary",
              dark ? "text-white/80" : "text-muted-foreground"
            )}
          >
            FAQ
          </Link>
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-border/50 bg-navy text-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ocean text-sm font-bold">
                D
              </div>
              <span className="text-lg font-semibold">{SITE_NAME}</span>
            </div>
            <p className="mt-3 max-w-xs text-sm text-white/60">
              Premium guest access coordination for North Coast Egypt.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <p className="mb-3 font-semibold text-sand">Quick links</p>
              <ul className="space-y-2 text-white/60">
                <li>
                  <Link href="/request-access" className="hover:text-white">
                    Request Access
                  </Link>
                </li>
                <li>
                  <Link href="/become-provider" className="hover:text-white">
                    Become a Provider
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="mb-3 font-semibold text-sand">Support</p>
              <p className="text-white/60">
                Our team coordinates every request manually for the best
                experience.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/40">
          © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export function StickyMobileCTA({
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
}: {
  primaryHref: string;
  primaryLabel: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/50 bg-background/95 p-4 backdrop-blur-md sm:hidden">
      <div className="flex flex-col gap-2">
        <Link
          href={primaryHref}
          className="flex h-14 items-center justify-center rounded-2xl bg-navy text-base font-semibold text-white shadow-lg transition-transform active:scale-[0.98]"
        >
          {primaryLabel}
        </Link>
        {secondaryHref && secondaryLabel ? (
          <Link
            href={secondaryHref}
            className="flex h-12 items-center justify-center rounded-xl border-2 border-primary/20 text-sm font-medium text-foreground"
          >
            {secondaryLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}

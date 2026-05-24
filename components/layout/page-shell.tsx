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
        dark ? "bg-navy text-white" : "bg-cream text-foreground",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SiteHeader({
  dark = false,
  overlay = false,
}: {
  dark?: boolean;
  overlay?: boolean;
}) {
  return (
    <header
      className={cn(
        "z-50 transition-all duration-500",
        overlay
          ? "fixed left-0 right-0 top-0 border-b border-transparent bg-transparent"
          : cn(
              "sticky top-0 border-b",
              dark
                ? "glass-dark border-white/10"
                : "glass-light border-white/40"
            )
      )}
    >
      <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between px-4 sm:h-[4.5rem] sm:px-6">
        <Link href="/" className="group flex items-center gap-3">
          <div
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold transition-transform duration-300 group-active:scale-95",
              dark || overlay
                ? "bg-white/10 text-sand-light ring-1 ring-white/20 backdrop-blur-sm"
                : "bg-navy text-white shadow-[0_8px_24px_rgba(7,16,24,0.15)]"
            )}
          >
            D
          </div>
          <span
            className={cn(
              "font-display text-2xl font-light tracking-wide transition-colors",
              dark || overlay ? "text-sand-light" : "text-navy"
            )}
          >
            {SITE_NAME}
          </span>
        </Link>
        <nav className="hidden items-center gap-8 text-xs font-semibold uppercase tracking-[0.15em] sm:flex">
          {[
            { href: "/#how-it-works", label: "How it works" },
            { href: "/#villages", label: "Villages" },
            { href: "/#faq", label: "FAQ" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "transition-colors duration-200",
                dark || overlay
                  ? "text-white/70 hover:text-sand-light"
                  : "text-muted-foreground hover:text-ocean"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="luxury-gradient border-t border-white/10 text-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-sm font-semibold ring-1 ring-white/20">
                D
              </div>
              <span className="font-display text-2xl font-light tracking-wide text-sand-light">
                {SITE_NAME}
              </span>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/50">
              Premium guest access coordination for North Coast Egypt.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-10 text-sm">
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-sand-light/80">
                Explore
              </p>
              <ul className="space-y-3 text-white/50">
                <li>
                  <Link
                    href="/request-access"
                    className="transition-colors hover:text-white"
                  >
                    Request Access
                  </Link>
                </li>
                <li>
                  <Link
                    href="/become-provider"
                    className="transition-colors hover:text-white"
                  >
                    Become a Provider
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-sand-light/80">
                Support
              </p>
              <p className="leading-relaxed text-white/50">
                Every request is coordinated manually for a seamless experience.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-white/10 pt-8 text-center text-xs tracking-wide text-white/35">
          © {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

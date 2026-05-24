import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  PageShell,
  SiteHeader,
  SiteFooter,
} from "@/components/layout/page-shell";
import { BecomeProviderForm } from "@/components/forms/become-provider-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Become a Provider",
};

export default function BecomeProviderPage() {
  return (
    <PageShell>
      <SiteHeader />
      <main className="relative mx-auto max-w-lg px-4 py-8 pb-28 sm:px-6 sm:py-14 lg:max-w-2xl">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-sand-muted/50 to-transparent" />
        <Link
          href="/"
          className="relative mb-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-ocean"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <Card className="relative overflow-hidden border-white/80 bg-white/90 backdrop-blur-sm">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-ocean via-ocean-light to-sand" />
          <CardHeader>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-ocean">
              Provider network
            </p>
            <CardTitle>Become a Provider</CardTitle>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Apply to offer guest access. Our team reviews every application
              personally.
            </p>
          </CardHeader>
          <CardContent>
            <BecomeProviderForm />
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </PageShell>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  PageShell,
  SiteHeader,
  SiteFooter,
} from "@/components/layout/page-shell";
import { AtmosphericBackdrop } from "@/components/layout/atmospheric-backdrop";
import { BecomeProviderForm } from "@/components/forms/become-provider-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Become a Provider",
};

export default function BecomeProviderPage() {
  return (
    <PageShell className="relative">
      <AtmosphericBackdrop />
      <div className="relative z-10">
        <SiteHeader />
        <main className="relative mx-auto max-w-lg px-4 py-8 pb-28 sm:px-6 sm:py-14 lg:max-w-2xl">
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-ocean"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <Card className="relative overflow-hidden border-white/60 bg-white/85 shadow-[0_24px_80px_rgba(7,16,24,0.12)] backdrop-blur-md">
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
      </div>
    </PageShell>
  );
}

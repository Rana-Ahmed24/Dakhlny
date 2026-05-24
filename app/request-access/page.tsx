import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import {
  PageShell,
  SiteHeader,
  SiteFooter,
} from "@/components/layout/page-shell";
import { RequestAccessForm } from "@/components/forms/request-access-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Request Access",
};

export default function RequestAccessPage() {
  return (
    <PageShell>
      <SiteHeader />
      <main className="relative mx-auto max-w-lg px-4 py-8 pb-28 sm:px-6 sm:py-14 lg:max-w-xl">
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
              Guest access
            </p>
            <CardTitle>Request Access</CardTitle>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Submit your details and our team will contact you to coordinate
              your visit.
            </p>
          </CardHeader>
          <CardContent>
            <RequestAccessForm />
          </CardContent>
        </Card>
      </main>
      <SiteFooter />
    </PageShell>
  );
}

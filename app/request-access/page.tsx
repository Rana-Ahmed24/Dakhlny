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
      <main className="mx-auto max-w-lg px-4 py-8 pb-24 sm:px-6 sm:py-12">
        <Link
          href="/"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>
        <Card className="border-border/60 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Request Access</CardTitle>
            <p className="text-sm text-muted-foreground">
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

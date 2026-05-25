"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createAccessRequest } from "@/lib/actions/access-requests";
import { ACCESS_TYPES, SUPPORTED_VILLAGES } from "@/lib/constants";
import type { AccessType } from "@/lib/constants";

export function RequestAccessForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [village, setVillage] = useState("");
  const [accessType, setAccessType] = useState<AccessType>("Guest access");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await createAccessRequest({
      full_name: formData.get("full_name") as string,
      phone: formData.get("phone") as string,
      village,
      access_date: formData.get("access_date") as string,
      access_type: accessType,
      people_count: Number(formData.get("people_count")),
      customer_notes: (formData.get("customer_notes") as string) || undefined,
    });

    setIsSubmitting(false);

    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error);
    }
  }

  if (success) {
    return (
      <div className="animate-fade-in rounded-[1.75rem] border border-ocean/20 bg-gradient-to-b from-white to-sand-muted/30 p-10 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-ocean/10">
          <CheckCircle2 className="h-8 w-8 text-ocean" strokeWidth={1.5} />
        </div>
        <h2 className="font-display text-3xl font-light text-navy">
          Request Submitted
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Our team will contact you shortly via WhatsApp to coordinate your
          access.
        </p>
        <Button asChild variant="outline" className="mt-8">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error ? (
        <div className="rounded-2xl border border-red-200/80 bg-red-50/80 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="space-y-2.5">
        <Label htmlFor="full_name">Full name</Label>
        <Input
          id="full_name"
          name="full_name"
          required
          placeholder="Your full name"
          autoComplete="name"
        />
      </div>

      <div className="space-y-2.5">
        <Label htmlFor="phone">Phone Number (WhatsApp Preferred)</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          required
          placeholder="01xxxxxxxxx"
          autoComplete="tel"
        />
      </div>

      <div className="space-y-2.5">
        <Label htmlFor="village">Village</Label>
        <Select value={village} onValueChange={setVillage} required>
          <SelectTrigger id="village">
            <SelectValue placeholder="Select a village" />
          </SelectTrigger>
          <SelectContent>
            {SUPPORTED_VILLAGES.map((v) => (
              <SelectItem key={v} value={v}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2.5">
        <Label>Access type</Label>
        <Select
          value={accessType}
          onValueChange={(v) => setAccessType(v as AccessType)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {ACCESS_TYPES.map((t) => (
              <SelectItem key={t} value={t}>
                {t}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2.5">
          <Label htmlFor="access_date">Access date</Label>
          <Input
            id="access_date"
            name="access_date"
            type="date"
            required
            min={new Date().toISOString().split("T")[0]}
          />
        </div>
        <div className="space-y-2.5">
          <Label htmlFor="people_count">Number of people</Label>
          <Input
            id="people_count"
            name="people_count"
            type="number"
            min={1}
            max={50}
            required
            defaultValue={1}
          />
        </div>
      </div>

      <div className="space-y-2.5">
        <Label htmlFor="customer_notes">Notes (optional)</Label>
        <Textarea
          id="customer_notes"
          name="customer_notes"
          placeholder="Any special requirements or details..."
          rows={3}
        />
      </div>

      <Button
        type="submit"
        size="xl"
        variant="navy"
        className="w-full"
        disabled={isSubmitting || !village}
      >
        {isSubmitting ? "Submitting..." : "Request Access"}
        {!isSubmitting ? <ArrowRight className="ml-1" /> : null}
      </Button>
    </form>
  );
}

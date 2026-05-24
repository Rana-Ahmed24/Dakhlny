"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { createProviderApplication } from "@/lib/actions/provider-applications";
import { SUPPORTED_VILLAGES, ACCESS_TYPES } from "@/lib/constants";

export function BecomeProviderForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [selectedVillages, setSelectedVillages] = useState<string[]>([]);
  const [selectedAccessTypes, setSelectedAccessTypes] = useState<string[]>([]);

  function toggleItem(list: string[], item: string, setter: (v: string[]) => void) {
    if (list.includes(item)) {
      setter(list.filter((i) => i !== item));
    } else {
      setter([...list, item]);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await createProviderApplication({
      full_name: formData.get("full_name") as string,
      phone: formData.get("phone") as string,
      whatsapp: formData.get("whatsapp") as string,
      villages: selectedVillages,
      access_types: selectedAccessTypes,
      average_pricing: (formData.get("average_pricing") as string) || undefined,
      availability_notes:
        (formData.get("availability_notes") as string) || undefined,
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
          Application Submitted
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Our team will review your application and contact you via phone or
          WhatsApp.
        </p>
        <Button asChild variant="outline" className="mt-8">
          <Link href="/">Back to Home</Link>
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="full_name">Full name</Label>
        <Input
          id="full_name"
          name="full_name"
          required
          placeholder="Your full name"
          autoComplete="name"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Phone number</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            required
            placeholder="01xxxxxxxxx"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="whatsapp">WhatsApp number</Label>
          <Input
            id="whatsapp"
            name="whatsapp"
            type="tel"
            required
            placeholder="01xxxxxxxxx"
          />
        </div>
      </div>

      <div className="space-y-3">
        <Label>Villages supported</Label>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {SUPPORTED_VILLAGES.map((village) => (
            <label
              key={village}
              className="flex cursor-pointer items-center gap-2.5 rounded-2xl border border-border/80 bg-white/80 p-3.5 text-sm transition-all duration-200 has-[:checked]:border-ocean/40 has-[:checked]:bg-ocean/5 has-[:checked]:shadow-sm"
            >
              <Checkbox
                checked={selectedVillages.includes(village)}
                onCheckedChange={() =>
                  toggleItem(selectedVillages, village, setSelectedVillages)
                }
              />
              <span>{village}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label>Access types</Label>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {ACCESS_TYPES.map((type) => (
            <label
              key={type}
              className="flex cursor-pointer items-center gap-2.5 rounded-2xl border border-border/80 bg-white/80 p-3.5 text-sm transition-all duration-200 has-[:checked]:border-ocean/40 has-[:checked]:bg-ocean/5 has-[:checked]:shadow-sm"
            >
              <Checkbox
                checked={selectedAccessTypes.includes(type)}
                onCheckedChange={() =>
                  toggleItem(selectedAccessTypes, type, setSelectedAccessTypes)
                }
              />
              <span>{type}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="average_pricing">Average pricing</Label>
        <Input
          id="average_pricing"
          name="average_pricing"
          placeholder="e.g. 500-1500 EGP per guest"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="availability_notes">Availability notes</Label>
        <Textarea
          id="availability_notes"
          name="availability_notes"
          placeholder="Your availability, capacity, special conditions..."
          rows={4}
        />
      </div>

      <Button
        type="submit"
        size="xl"
        variant="navy"
        className="w-full"
        disabled={
          isSubmitting ||
          selectedVillages.length === 0 ||
          selectedAccessTypes.length === 0
        }
      >
        {isSubmitting ? "Submitting..." : "Apply As Provider"}
        {!isSubmitting ? <ArrowRight className="ml-1" /> : null}
      </Button>
    </form>
  );
}

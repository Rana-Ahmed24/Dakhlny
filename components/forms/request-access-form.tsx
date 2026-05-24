"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createAccessRequest } from "@/lib/actions/access-requests";
import { SUPPORTED_VILLAGES } from "@/lib/constants";

export function RequestAccessForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [carAccess, setCarAccess] = useState(false);
  const [village, setVillage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await createAccessRequest({
      full_name: formData.get("full_name") as string,
      phone: formData.get("phone") as string,
      whatsapp: formData.get("whatsapp") as string,
      village,
      access_date: formData.get("access_date") as string,
      people_count: Number(formData.get("people_count")),
      car_access: carAccess,
      notes: (formData.get("notes") as string) || undefined,
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
      <div className="animate-fade-in rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
          <CheckCircle2 className="h-8 w-8 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-semibold text-emerald-900">
          Request Submitted
        </h2>
        <p className="mt-3 text-emerald-700">
          Our team will contact you shortly via phone or WhatsApp to coordinate
          your access.
        </p>
        <Button asChild variant="outline" className="mt-6">
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
            autoComplete="tel"
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

      <div className="space-y-2">
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

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="access_date">Access date</Label>
          <Input
            id="access_date"
            name="access_date"
            type="date"
            required
            min={new Date().toISOString().split("T")[0]}
          />
        </div>
        <div className="space-y-2">
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

      <div className="flex items-center gap-3 rounded-xl border border-border bg-muted/30 p-4">
        <Checkbox
          id="car_access"
          checked={carAccess}
          onCheckedChange={(checked) => setCarAccess(checked === true)}
        />
        <Label htmlFor="car_access" className="cursor-pointer font-normal">
          Car access needed
        </Label>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (optional)</Label>
        <Textarea
          id="notes"
          name="notes"
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

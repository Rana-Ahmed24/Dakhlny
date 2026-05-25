import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Local calendar date as YYYY-MM-DD (for date inputs). */
export function getTodayDateString(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function isDateBeforeToday(dateStr: string): boolean {
  return dateStr < getTodayDateString();
}

export function formatDate(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatDateTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatPhoneLink(phone: string): string {
  const cleaned = phone.replace(/\s+/g, "");
  return cleaned.startsWith("+") ? cleaned : `+20${cleaned.replace(/^0/, "")}`;
}

export function formatWhatsAppLink(phone: string): string {
  const cleaned = phone.replace(/\D/g, "");
  const normalized = cleaned.startsWith("20")
    ? cleaned
    : `20${cleaned.replace(/^0/, "")}`;
  return `https://wa.me/${normalized}`;
}

export function joinList(items: string[]): string {
  return items.filter(Boolean).join(", ");
}

export function formatCurrency(amount: number | null | undefined): string {
  if (amount == null) return "—";
  return `${amount.toLocaleString("en-EG", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })} EGP`;
}

export function truncateText(text: string | null | undefined, max = 48): string {
  if (!text) return "—";
  return text.length > max ? `${text.slice(0, max)}…` : text;
}

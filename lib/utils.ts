import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

export function getStarLabel(stars: number): string {
  if (stars >= 5) return "Bintang 5";
  if (stars >= 4) return "Bintang 4";
  if (stars >= 3) return "Bintang 3";
  if (stars >= 2) return "Bintang 2";
  return "Bintang 1";
}

export function getRatingLabel(rating: number): string {
  if (rating >= 9) return "Luar Biasa";
  if (rating >= 8) return "Sangat Baik";
  if (rating >= 7) return "Baik";
  if (rating >= 6) return "Cukup Baik";
  return "Cukup";
}

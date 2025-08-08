import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function isValidUsdAmount(value: string): boolean {
  if (value.trim().length === 0) return false;
  return /^\d*(?:\.\d{0,2})?$/.test(value);
}



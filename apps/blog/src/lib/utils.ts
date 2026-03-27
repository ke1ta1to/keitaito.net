import { clsx } from "clsx";
import type { ClassValue } from "clsx";
import { parseISO, format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(isoDate: string) {
  const date = parseISO(isoDate);
  return format(date, "yyyy年M月d日");
}

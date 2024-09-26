import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function estimateTokens(text: string): number {
  // A very rough estimate. OpenAI uses tokens, not characters,
  // but this gives us a conservative estimate.
  return Math.ceil(text.length / 4);
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges multiple class names into a single string, handling conditional classes
 * and resolving Tailwind CSS class name conflicts.
 *
 * @param inputs - A list of class names or conditional class objects.
 * @returns A single string of merged and resolved class names.
 *
 * Example usage:
 * ```ts
 * const className = cn(
 *   "text-center",
 *   isActive && "text-blue-500",
 *   "bg-white"
 * );
 * ```
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

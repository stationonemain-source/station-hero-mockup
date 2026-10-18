import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// The classic shadcn helper. shadcn's init installed the newer `cn` package instead,
// but Vite 8's production build corrupts the packed tables inside it (non-ASCII
// characters come out as U+FFFD), which throws at run time in built pages.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

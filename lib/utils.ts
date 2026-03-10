import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

const TWmerge = extendTailwindMerge({
  extend: {
    theme: {
      text: [
        "h0-xl",
        "h0-m",
        "h1-xl",
        "h1-m",
        "h2-xl",
        "h3-m",
        "h3-xl",
        "h3-m",
        "accent-xl",
        "accent-m",
        "regular-xl",
        "regular-m",
        "supersmall-xl",
        "supersmall-m",
        "small-xl",
        "small-m",
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return TWmerge(clsx(inputs));
}

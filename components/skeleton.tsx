import type { ClassValue } from "clsx";
import { cn } from "@/lib/utils";

type Props = {
  className?: ClassValue;
};

export default function Skeleton({ className }: Props) {
  return <div className={cn("animate-pulse rounded-2xl bg-current", className)} />;
}

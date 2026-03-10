import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type Props = {
  children: ReactNode;
  className?: string;
};

export default function FieldSeparator({ children, className }: Props) {
  return (
    <div className={cn("text-gray relative flex w-full justify-center", className)}>
      <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 bg-current" />
      <span className="text-small-xl relative z-10 bg-white px-32">{children}</span>
    </div>
  );
}

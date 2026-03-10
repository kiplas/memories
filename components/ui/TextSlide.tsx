import { ClassValue } from "clsx";
import { PropsWithChildren } from "react";
import { cn } from "@/lib/utils";

type Props = {
  className?: ClassValue;
};

export default function TextSlide({ children, className }: PropsWithChildren<Props>) {
  const value = String(children);

  return (
    <span className={cn("group/slide ease-slow relative inline-block overflow-clip duration-400", className)}>
      <div className="duration-[inherit] ease-[inherit] group-hover/slide:-translate-y-[120%]">{value}</div>
      <div className="absolute inset-0 translate-y-[120%] duration-[inherit] ease-[inherit] group-hover/slide:translate-0">{value}</div>
    </span>
  );
}

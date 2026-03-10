import { PropsWithChildren, ReactNode } from "react";
import TextSlide from "./TextSlide";
import { ClassValue } from "clsx";
import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes } from "react";

type Props = {
  className?: ClassValue;
  icon?: ReactNode;
  direction?: "ltr" | "rtl";
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({ children, className, icon, direction = "ltr", ...rest }: PropsWithChildren<Props>) {
  return (
    <button
      className={cn(
        "group/slide text-accent-xl flex h-62 cursor-pointer items-center justify-center gap-10 rounded-full border border-current px-24 py-10 disabled:pointer-events-none",
        direction === 'rtl' && 'flex-row-reverse',
        className,
      )}
      {...rest}
    >
      <TextSlide className="w-full text-center">{children}</TextSlide>
      {icon}
    </button>
  );
}

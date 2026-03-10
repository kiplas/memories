import Close from "@/icons/close";
import { ClassValue } from "clsx";
import { cn } from "@/lib/utils";
import { PropsWithChildren } from "react";

type Props = {
  onRemove: () => unknown;
  className?: ClassValue;
};

export default function Tag({ className, children, onRemove }: PropsWithChildren<Props>) {
  return (
    <div className={cn("flex items-center gap-x-10 rounded-full border border-black p-6 pl-16", className)}>
      <span className="text-accent-xl">{children}</span>
      <button className="cursor-pointer" onClick={onRemove}>
        <Close className="text-black" />
      </button>
    </div>
  );
}

import Arrow from "@/icons/arrow";
import { type ClassValue } from "clsx";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Illustration } from "@/types";

type SelectProps = {
  className?: ClassValue;
  illustrations: Illustration[];
  onChange: (illustration: Illustration) => unknown;
};

export default function Select({ className, illustrations, onChange }: SelectProps) {
  const [index, setIndex] = useState(0);

  function next() {
    if (index >= illustrations.length - 1) return;

    setIndex(index + 1);
    onChange(illustrations[index + 1]);
  }

  function previous() {
    if (index === 0) return;

    setIndex(index - 1);
    onChange(illustrations[index - 1]);
  }

  return (
    <div
      className={cn(
        "hover:shadow-widget-active shadow-widget ease-slow flex h-85 w-full overflow-clip rounded-full border border-current bg-white text-[#BBBBBB] duration-600",
        className,
      )}
    >
      <button
        className="ease-slow grid w-85 shrink-0 cursor-pointer place-content-center border-r border-r-current duration-600 hover:bg-black hover:text-white"
        onClick={previous}
      >
        <Arrow className="rotate-180" />
      </button>

      <div className="flex w-full items-center justify-center text-black">{illustrations[index].label}</div>

      <button className="ease-slow grid w-85 shrink-0 cursor-pointer place-content-center border-l border-l-current duration-600 hover:bg-black hover:text-white" onClick={next}>
        <Arrow />
      </button>
    </div>
  );
}

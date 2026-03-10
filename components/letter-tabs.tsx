import ArrowRounded from "@/icons/arrow-rounded";
import { type ClassValue } from "clsx";
import { cn } from "@/lib/utils";
import { useLetter, useLetterControls } from "@/state/letter";
import { Fragment } from "react/jsx-runtime";

const tabs = [
  {
    slugs: ["message", "variant"],
    label: "Letter",
  },
  {
    slugs: ["recipients"],
    label: "Recipients",
  },
  {
    slugs: ["delivery"],
    label: "Delivery",
  },
  {
    slugs: ["payment"],
    label: "Payment",
  },
] as const;

type Props = {
  className?: ClassValue;
};

export default function Tabs({ className }: Props) {
  const { stage, canProcessToStage } = useLetter();
  const { setStage } = useLetterControls();

  return (
    <div className={cn("scrollbar-none flex h-54 w-full items-center gap-x-32 overflow-auto bg-black px-32 text-white md:justify-center", className)}>
      {tabs.map(({ slugs, label }, index) => (
        <Fragment key={label}>
          {index > 0 && <ArrowRounded className="shrink-0" />}
          <button
            className="text-accent-xl cursor-pointer disabled:cursor-default data-active:font-bold data-active:text-[#D4F4FF]"
            data-active={(stage && slugs.some((slug) => slug === stage.name)) || null}
            onClick={() => setStage({ name: slugs[0] })}
            disabled={!canProcessToStage({ name: slugs[0] })}
          >
            {label}
          </button>
        </Fragment>
      ))}
    </div>
  );
}

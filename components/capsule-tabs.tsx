import ArrowRounded from "@/icons/arrow-rounded";
import { cn } from "@/lib/utils";
import { useCapsule, useCapsuleControls } from "@/state/capsule";
import { type ClassValue } from "clsx";
import { Fragment } from "react/jsx-runtime";

const tabs = [
  {
    slugs: ["upload", "variant", "message"],
    label: "Design",
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
  const { stage, canProcessToStage } = useCapsule();
  const { setStage } = useCapsuleControls();

  return (
    <div className={cn("scrollbar-none flex h-54 w-full items-center gap-x-16 overflow-auto bg-black px-32 text-white md:justify-center md:gap-x-32", className)}>
      {tabs.map(({ slugs, label }, index) => (
        <Fragment key={label}>
          {index > 0 && <ArrowRounded className="shrink-0 text-white opacity-50" />}
          <button
            className="text-accent-xl font-normal cursor-pointer disabled:cursor-default opacity-50 data-active:font-bold data-active:opacity-100"
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

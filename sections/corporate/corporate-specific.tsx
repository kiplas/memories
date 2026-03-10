import Arrow from "@/icons/arrow";
import Lotus from "@/icons/lotus";
import Plane from "@/icons/plane";
import Target from "@/icons/target";
import Wave from "@/icons/wave";
import { useState } from "react";

const icons = {
  plane: Plane,
  wave: Wave,
  lotus: Lotus,
  target: Target,
};

const mock = [
  {
    title: "Onboarding",
    text: "Employees write goals and future notes to self.",
    icon: "plane",
    color: "#FF6F1B",
  },
  {
    title: "Offboarding",
    text: "Departing leaders leave legacy messages for their teams.",
    icon: "wave",
    color: "#CDFF50",
  },
  {
    title: "Retreats",
    text: "Shared capsules that capture the spirit of an event.",
    icon: "lotus",
    color: "#60DAFF",
  },
  {
    title: "Goal-Setting",
    text: "Employees reflect and future-cast with emotion.",
    icon: "target",
    color: "#5B60FF",
  },
] as const;

type Props = {
  title: string;
  text: string;
  color: string;
  icon: keyof typeof icons;
};

function Card({ title, text, color, icon }: Props) {
  const Icon = icons[icon];

  return (
    <div className="group relative flex h-381 w-343 shrink-0 flex-col gap-y-40 overflow-clip rounded-[44px] bg-white px-48 pt-80 pb-48 md:h-460" style={{ "--color": color }}>
      <div className="ease-gentle absolute inset-0 size-full bg-linear-to-b from-white to-(--color)/20 opacity-0 duration-200 group-hover:opacity-100" />
      <h4 className="text-h1-m md:text-h2-xl relative z-1">{title}</h4>
      <p className="text-h3-m md:text-h3-xl relative z-1">{text}</p>
      <Icon className="relative mt-auto z-1 size-96 text-(--color)" />
    </div>
  );
}

export default function CorporateSpecific() {
  const [index, setIndex] = useState(0);

  const hasPrev = index > 0;
  const hasNext = index < mock.length - 1;

  function next() {
    if (hasNext) setIndex(index + 1);
  }

  function prev() {
    if (hasPrev) setIndex(index - 1);
  }

  return (
    <section className="overflow-clip md:sticky top-0 bg-[#F4F4F4] py-40 md:py-80">
      <hgroup className="px-32">
        <h2 className="text-h3-m md:text-h3-xl mb-24 text-center">Corporate-Specific</h2>
        <div className="text-h1-m md:text-h1-xl text-center">Built for HR, Leaders, and Teams.</div>
      </hgroup>

      <div className="mx-auto mt-30 max-w-1012 md:mt-80">
        <div className="mb-40 flex -translate-x-[calc(343px*var(--index)+20px*var(--index))] gap-20 px-32 duration-300 ease-out" style={{ "--index": index }}>
          {mock.map((card) => (
            <Card key={card.title} {...card} />
          ))}
        </div>

        <div className="flex gap-20 px-32">
          <button className="grid size-54 cursor-pointer place-content-center rounded-full bg-[#e1e1e1] disabled:opacity-40" disabled={!hasPrev} onClick={prev}>
            <Arrow className="rotate-180" />
          </button>

          <button className="grid size-54 cursor-pointer place-content-center rounded-full bg-[#e1e1e1] disabled:opacity-40" disabled={!hasNext} onClick={next}>
            <Arrow />
          </button>
        </div>
      </div>
    </section>
  );
}

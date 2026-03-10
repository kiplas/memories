import Arrow from "@/icons/arrow";
import Crown from "@/icons/crown";
import Group from "@/icons/group";
import Heart from "@/icons/heart";
import Rocket from "@/icons/rocket";
import Sentimental from "@/icons/sentimental";
import { useState } from "react";

const icons = {
  rocket: Rocket,
  group: Group,
  heart: Heart,
  crown: Crown,
  sentimental: Sentimental,
};

const mock = [
  {
    title: "Boost retention and engagement",
    text: "Employees who feel emotionally connected are more likely to stay and grow within the company.",
    icon: "rocket",
  },
  {
    title: "Strengthen culture & belonging",
    text: "Shared memories create a sense of unity and trust across teams and generations.",
    icon: "group",
  },
  {
    title: "Enable storytelling across time",
    text: "Capsules turn milestones into a shared narrative that lives beyond the moment.",
    icon: "heart",
  },
  {
    title: "Create leadership legacies",
    text: "Departing leaders leave behind inspiration and guidance that continues to motivate.",
    icon: "crown",
  },
  {
    title: "Elevate employer branding",
    icon: "sentimental",
    text: "Show that your company values people, not just performance — a powerful message for hiring and reputation.",
  },
] as const;

type Props = {
  title: string;
  text: string;
  icon: keyof typeof icons;
};

function Card({ title, text, icon }: Props) {
  const Icon = icons[icon];

  return (
    <div className="ease-gentle flex h-400 w-338 flex-col gap-y-32 rounded-[44px] border bg-white p-48 pb-63 duration-200 hover:bg-black hover:text-white md:h-500 md:w-343">
      <Icon className="size-48" />
      <h4 className="text-h2-m md:text-h2-xl">{title}</h4>
      <p className="text-h3-m md:text-h3-xl w-247">{text}</p>
    </div>
  );
}

export default function Perks() {
  const [index, setIndex] = useState(0);

  const hasNext = index < mock.length - 1;
  const hasPrev = index > 0;

  function next() {
    if (hasNext) setIndex(index + 1);
  }

  function prev() {
    if (hasPrev) setIndex(index - 1);
  }

  return (
    <section className="relative z-10 mx-auto overflow-hidden bg-white px-32 py-40 md:py-64">
      <div style={{ "--index": index }} className="mx-auto mb-40 flex w-948 -translate-x-[calc(343px*var(--index)+20px*var(--index))] gap-20 duration-300 ease-out">
        {mock.map((card) => (
          <Card key={card.title} {...card} />
        ))}
      </div>

      <div className="mx-auto flex w-948 gap-20">
        <button className="grid size-54 cursor-pointer place-content-center rounded-full bg-[#e1e1e1] data-inactive:opacity-40" data-inactive={!hasPrev || null} onClick={prev}>
          <Arrow className="rotate-180" />
        </button>

        <button className="grid size-54 cursor-pointer place-content-center rounded-full bg-[#e1e1e1] data-inactive:opacity-40" data-inactive={!hasNext || null} onClick={next}>
          <Arrow />
        </button>
      </div>
    </section>
  );
}

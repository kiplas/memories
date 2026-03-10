import Button from "@/components/ui/button";
import Image from "next/image";
import Heart from "@/icons/heart";
import Dimond from "@/icons/dimond";
import Rocket from "@/icons/rocket";
import Lightbulb from "@/icons/lightbulb";

const icons = {
  heart: Heart,
  rocket: Rocket,
  dimond: Dimond,
  lightbulb: Lightbulb,
};

const list = [
  {
    content: "Reflection",
    icon: "heart",
  },
  {
    content: "Legacy",
    icon: "dimond",
  },
  {
    content: "Growth",
    icon: "rocket",
  },
  {
    content: "Insight",
    icon: "lightbulb",
  },
] as const;

export default function Deck() {
  return (
    <section className="relative flex flex-col bg-white md:h-1620 md:gap-y-100">
      <div className="mx-auto w-full max-w-1234 grow px-32 pt-48 max-md:relative max-md:h-800 md:pt-100">
        <div className="relative z-1 w-full max-w-338 md:sticky md:top-100 md:ml-auto md:max-w-585 md:text-white md:mix-blend-difference">
          <h2 className="text-h1-m md:text-h1-xl mb-24">In a world of KPIs, give your people something timeless.</h2>
          <p className="text-accent-m md:text-accent-xl">
            Corporate life moves fast. Important moments get lost. Memories helps teams pause, reflect, and create connections that stay forever. It’s not just a tool — it’s a
            cultural experience that builds legacy and belonging.
          </p>
        </div>

        <Image className="absolute bottom-0 left-0 max-h-1152 w-full object-cover object-top" src="/mock/corporate/deck-bg.jpg" alt="" width="1512" height="1209" />
      </div>

      <div className="relative z-1 mx-auto w-full max-w-1234 px-11 md:px-32 md:pb-100">
        <div className="mx-auto w-full md:mr-0 md:max-w-585">
          <div className="scrollbar-none mb-24 flex justify-center md:justify-start overflow-auto py-21 max-[500px]:justify-between min-[500px]:gap-28 md:justify-center md:px-0 md:py-15">
            {list.map(({ content, icon }) => {
              const Icon = icons[icon];

              return (
                <div key={content} className="md:text-accent-xl flex shrink-0 items-center gap-4 md:text-white">
                  <Icon className="size-20 md:size-32" />
                  <span>{content}</span>
                </div>
              );
            })}
          </div>

          <Button className="mt-24 block border-none bg-black text-white max-md:mx-auto md:bg-white md:text-black">Download Deck</Button>
        </div>
      </div>
    </section>
  );
}

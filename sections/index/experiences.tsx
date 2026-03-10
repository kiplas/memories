import Image from "next/image";
import Plus from "@/icons/plus";
import Link from "next/link";

const capsules = [
  {
    name: "Digital Capsule",
    summary: "A future message, delivered instantly when the time is right.",
    cover: "/mock/index/capsules/a.png",
    href: "/create/digital/capsule",
    action: {
      label: "Start Free",
    },
  },
  {
    name: "Printed Capsule",
    summary: "A museum-grade keepsake that lasts for generations.",
    cover: "/mock/index/capsules/b.png",
    href: "/create/printed/capsule",
    action: {
      label: "Explore Prints",
    },
  },
  {
    name: "Corporate Legacy Tools",
    summary: "Build culture and connection with meaningful team rituals.",
    cover: "/mock/index/capsules/c.jpg",
    href: "/corporate",
    action: {
      label: "For Companies",
    },
  },
  {
    name: "A Letter That Waits",
    summary: "Write what matters today. Let the future open it for you.",
    cover: "/mock/index/capsules/d.jpg",
    href: "/create/digital/letter",
    action: {
      label: "Create Yours ",
    },
  },
];

export default function Capsules() {
  return (
    <section className="relative z-1 bg-white [background:linear-gradient(180deg,#fff7f4_0%,#fff_100%)]">
      <hgroup className="text-orange mx-auto max-w-(--w-viewport) pt-40 text-center md:pt-0">
        <h2 className="xl:text-h0-xl text-[4rem] font-bold min-[410px]:text-h0-m md:text-[7rem]/[1.5em] lg:text-[10rem]/[1.5em]">Experiences</h2>
        <div className="md:text-h2-xl text-h2-m mt-24">Choose Your Capsule</div>
      </hgroup>

      <div className="mx-auto mt-56 md:mt-112 flex max-w-(--w-viewport) grid-cols-2 grid-rows-2 flex-col gap-20 px-32 md:grid">
        {capsules.map(({ name, summary, cover, action, href }) => (
          <article className="group aspect-338/450 w-full overflow-clip rounded-[44px] md:aspect-706/660" key={name}>
            <Link href={href} className="relative flex size-full flex-col items-center p-48 lg:p-40">
              <hgroup className="relative z-10 max-w-242 text-center text-white md:max-w-380">
                <span className="text-accent-m lg:text-accent-xl">{summary}</span>
                <h3 className="text-h2-m lg:text-h2-xl mt-24">{name}</h3>
              </hgroup>

              <span className="text-accent-xl relative z-10 mt-auto flex h-62 items-center gap-x-18 rounded-full bg-white px-24">
                {action.label} <Plus />
              </span>

              <Image
                className="ease-slow absolute inset-0 h-full w-full object-cover brightness-80 duration-600 group-hover:scale-110"
                src={cover}
                alt=""
                width="706"
                height="660"
              />
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

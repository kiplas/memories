"use client";

import HeaderLogo from "@/icons/header-logo";
import Image from "next/image";
import { useTheme, useThemeControls } from "@/state/theme";
import { useLayoutEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { Draggable, gsap } from "@/client/gsap";

const locations = [
  {
    name: "Africa",
    cover: "/mock/locations/africa.png",
    enabled: true,
  },
  {
    name: "Antarctica & \n The Arctic",
    cover: "/mock/locations/antarctica-n-arctic.png",
  },
  {
    name: "Asia",
    cover: "/mock/locations/asia.png",
  },
  {
    name: "Australasia",
    cover: "/mock/locations/australasia.png",
  },
  {
    name: "Central America",
    cover: "/mock/locations/central-america.png",
  },
  {
    name: "Europe",
    cover: "/mock/locations/europe.png",
  },
  {
    name: "Indian Ocean",
    cover: "/mock/locations/indian-ocean.png",
  },
  {
    name: "Middle East & North Africa",
    cover: "/mock/locations/middle-east-n-north-africa.png",
  },
  {
    name: "North America",
    cover: "/mock/locations/north-america.png",
  },
  {
    name: "South America",
    cover: "/mock/locations/south-america.png",
  },
  {
    name: "The Caribbean",
    cover: "/mock/locations/caribbean.png",
  },
];

function View() {
  const { opened } = useTheme();
  const { setTheme } = useThemeControls();
  const list = useRef<HTMLDivElement>(null);
  const container = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const resize = () => {
      if (!list.current) return console.error("Unable to resize font as no list element was found");

      list.current.style.setProperty("--height-ratio", `${list.current.clientHeight / 870}`);
      list.current.style.setProperty("--width-ratio", `${list.current.clientWidth / 370}`);
    };

    resize();

    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(width > 650px)", () => {
        Draggable.create(".list", {
          type: "x",
          bounds: ".wrapper",
          inertia: true,
          edgeResistance: 0.85,
        });
      });
    },
    { scope: container },
  );

  return (
    <section ref={container} className="scrollbar-none fixed inset-0 z-999 flex size-full flex-col bg-white pt-13 pb-24 max-md:overflow-auto">
      <hgroup className="flex items-center justify-between gap-y-12 px-42 max-md:flex-col md:items-end">
        <HeaderLogo className="aspect-132/28 h-auto w-112 text-black contain-layout data-active:[view-transition-name:logo] md:w-192" data-active={opened || null} />
        <div className="text-accent-m md:text-accent-xl pb-6">Hold the World. Send the World!</div>
      </hgroup>

      <div className="wrapper mt-20 h-full md:mt-34">
        <div ref={list} className="list scrollbar-none flex h-fit w-full gap-4 px-16 max-md:flex-col max-md:pb-12 md:h-full md:w-fit md:px-40" style={{ "--height-ratio": "1" }}>
          {locations.map(({ name, cover, enabled }) => (
            <button
              key={cover}
              className="group relative flex aspect-370/180 shrink-0 overflow-hidden rounded-full bg-black/2 not-disabled:cursor-pointer max-md:w-full md:aspect-301/870 md:h-full"
              data-active={opened || null}
              onClick={() => setTheme("placeholder")}
              disabled={!enabled}
            >
              <div className="absolute top-1/2 left-1/2 z-10 w-full -translate-1/2 text-[calc(var(--width-ratio)*32px)] leading-[1.1em] font-semibold -tracking-tighter whitespace-pre-wrap text-white md:text-[calc(var(--height-ratio)*40px)]">
                {name}
              </div>

              <div className="ease-gentle absolute bottom-171/870 left-1/2 z-10 hidden h-[calc(var(--height-ratio)*62px)] -translate-x-1/2 place-content-center rounded-full bg-white px-[calc(var(--height-ratio)*32px)] text-[calc(var(--ratio)*18px)] font-semibold -tracking-tighter opacity-0 duration-1000 group-hover:opacity-100 md:grid">
                {enabled ? "Let's Go!" : "Unavailable"}
              </div>

              <Image className="ease-gentle size-full object-cover duration-1500 group-hover:scale-120" src={cover} width="301" height="870" alt={name} />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function ThemeSelector() {
  const { opened } = useTheme();

  return opened ? <View /> : null;
}

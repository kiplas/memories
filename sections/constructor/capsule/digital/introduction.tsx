"use client";

import Image from "next/image";
import Link from "next/link";
import { useCapsuleControls } from "@/state/capsule";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import gsap from "@/client/gsap";

export default function Intro() {
  const container = useRef<HTMLDivElement>(null);
  const { setNextStage } = useCapsuleControls();

  useGSAP(
    () => {
      const timeline = gsap.timeline({ defaults: { duration: 1, ease: "power3.out" } });

      gsap.set([".mobile", ".tablet", ".laptop", ".footer"], { visibility: "visible" });

      const base = window.innerWidth / 2;

      timeline.from(".mobile", { x: base });
      timeline.from(".tablet", { x: base + 150 }, "<");
      timeline.from(".laptop", { x: base + 450 }, "<");
      timeline.from(".footer", { y: 200 }, "<");
    },
    { scope: container },
  );

  return (
    <section ref={container} className="relative mx-auto flex h-[calc(100svh-98px)] min-h-760 max-w-1512 flex-col p-32 pt-75 contain-layout md:min-h-820 md:p-40 md:pt-113">
      <h1 className="text-[2.5rem]/[1em] font-bold -tracking-wider md:text-[6.25rem]/[1em]">
        Moments <br /> That <br /> Matter
      </h1>

      <div className="absolute top-154 left-195 w-385 md:top-113 md:left-807 md:w-770">
        <Image
          className="mobile invisible absolute -bottom-10 -left-162 z-2 block aspect-162/332 w-72 md:-left-336 md:w-162"
          src="/digital-capsule-mocks/mobile.png"
          width="332"
          height="162"
          alt=""
        />
        <Image
          className="tablet invisible absolute bottom-0 -left-121 z-1 block aspect-512/369 w-256 md:-left-243 md:w-512"
          src="/digital-capsule-mocks/tablet.png"
          width="512"
          height="369"
          alt=""
        />
        <Image className="laptop invisible block aspect-770/544 w-920" src="/digital-capsule-mocks/desktop.png" width="920" height="557" alt="" />
      </div>

      <div className="footer invisible z-10 mt-auto flex flex-col items-center justify-between gap-32 min-[960px]:flex-row md:items-start">
        <button
          className="group text-orange relative h-81 w-full max-w-405 cursor-pointer overflow-clip rounded-full border border-current text-[1.375rem] font-semibold -tracking-tighter"
          onClick={setNextStage}
        >
          <div className="ease-slow relative z-1 duration-600 group-hover:scale-120 group-hover:text-white">Create Your First Capsule</div>
          <div className="ease-slow bg-orange absolute top-[150%] left-1/2 size-760 origin-center -translate-x-1/2 -translate-y-1/2 scale-10 rounded-full duration-500 group-hover:scale-100" />
        </button>

        <div className="flex flex-col justify-end gap-y-16 min-[960px]:items-end md:gap-y-24">
          <div className="flex flex-col items-center gap-x-20 gap-y-4 md:flex-row">
            <span className="text-[1rem] font-bold -tracking-tighter md:text-[1.5rem]">$19.99 per card</span>
            <span className="text-orange text-[0.75rem] -tracking-tighter md:text-[0.875rem]">Or</span>
            <Link href='/purchase-package' className="cursor-pointer text-[1rem] font-bold -tracking-tighter underline md:text-[1.5rem]">Save with package*</Link>
          </div>

          <span className="text-center text-[0.75rem] font-medium -tracking-tighter md:text-[0.875rem]">*Buy a package and pay less per card (requires a free account)</span>
        </div>
      </div>
    </section>
  );
}

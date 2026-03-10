"use client";

import Button from "@/components/ui/button";
import { gsap, useGSAP, SplitText } from "@/client/gsap";
import { useDialogControls } from "@/state/dialog";
import { useRef } from "react";

export default function Demo() {
  const container = useRef<HTMLDivElement>(null);
  const { open } = useDialogControls();

  useGSAP(
    () => {
      const title = new SplitText(".title", { type: "words" });
      const subtitle = new SplitText(".subtitle", { type: "words" });

      const timeline = gsap.timeline();

      timeline.set(".hgroup", { visibility: "visible" });

      timeline.from(title.words, {
        duration: 1,
        opacity: 0,
        yPercent: 50,
        filter: "blur(5px)",
        stagger: 0.035,
        ease: "power3.out",
      });

      timeline.from(
        subtitle.words,
        {
          duration: 1,
          opacity: 0,
          yPercent: 50,
          filter: "blur(5px)",
          stagger: 0.035,
          ease: "power3.out",
        },
        ">-=50%",
      );
    },
    {
      scope: container,
    },
  );

  return (
    <section ref={container} className="relative h-svh min-h-800 bg-black/10 md:max-h-982 md:min-h-660">
      <video className="absolute inset-0 size-full object-cover" src="/mock/corporate/intro.mp4" autoPlay playsInline muted loop width="1512" height="982" />

      <div className="hgroup invisible absolute top-1/2 left-1/2 w-full max-w-450 -translate-1/2 px-32 text-center text-white md:max-w-706">
        <h1 className="title text-h2-m md:text-h2-xl mb-24">Turn Every Corporate Milestone into a Lasting Memory.</h1>

        <p className="subtitle text-accent-m md:text-accent-xl mx-30">Give your teams more than KPIs — give them moments of reflection, gratitude, and belonging that last.</p>
      </div>

      <div className="absolute bottom-149 left-1/2 flex -translate-x-1/2 flex-col justify-center gap-16 md:bottom-100 md:flex-row">
        <Button className="bg-blue w-178 border-none text-white" onClick={() => open({ name: "demo" })}>
          Request Demo
        </Button>
        <Button className="w-178 border-none bg-white">Book a Call</Button>
      </div>
    </section>
  );
}

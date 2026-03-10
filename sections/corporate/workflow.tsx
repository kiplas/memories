import Plane from "@/icons/paper-plane";
import Image from "next/image";
import { gsap, useGSAP, ScrollTrigger } from "@/client/gsap";
import { useRef } from "react";

const mock = [
  {
    title: "Choose the Moment",
    quote: "Onboarding, offboarding, retreats, recognition, milestones.",
    imgurl: "/mock/corporate/workflow-icons/1.jpg",
  },
  {
    title: "Record the Message",
    quote: "Write, speak, or upload a video — to yourself, your team, or loved ones.",
    imgurl: "/mock/corporate/workflow-icons/2.jpg",
  },
  {
    title: "Choose the Moment",
    quote: "On the date you choose — 1 month, 1 year, even 5 years later.",
    imgurl: "/mock/corporate/workflow-icons/3.jpg",
  },
];

type Props = {
  title: string;
  quote: string;
  imgurl: string;
};

function ExplanationCard({ title, quote, imgurl }: Props) {
  return (
    <article className="card lg:blur- translate-y-1/8 overflow-hidden rounded-4xl bg-black text-center text-white md:rounded-[44px] lg:opacity-0">
      <Image className="aspect-464/380 h-auto w-full object-cover" src={imgurl} alt="" width="464" height="380" />

      <div className="py-27 pt-42 pb-60 md:px-64 md:pt-48 md:pb-90">
        <h3 className="text-accent-m md:text-accent-xl mb-10">{title}</h3>

        <p className="text-h3-m md:text-h3-xl mb-20">{quote}</p>
      </div>
    </article>
  );
}

export default function WorkFlow() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width:1024px)", () => {
        ScrollTrigger.create({
          trigger: ".list",
          start: "top bottom",
          animation: gsap.to(".card", { autoAlpha: 1, y: 0, stagger: 0.125, duration: 0.75, ease: "sine.out", filter: "blur(0px)" }),
        });
      });
    },
    {
      scope: container,
    },
  );

  return (
    <section ref={container} id="workflow">
      <div className="text-h0-m md:text-h0-xl relative mx-auto mt-80 mb-24 w-fit max-w-338 px-32 md:max-w-none md:px-40 md:leading-[0.875em]">
        <h2 className="text-center">
          How It&nbsp;
          <span className="relative">
            Works
            <Plane className="absolute top-0 -right-40 size-32 min-[1260px]:top-0 min-[1260px]:right-0 md:top-30 md:-right-60 md:size-60" />
          </span>
        </h2>
      </div>

      <p className="text-h2-m md:text-h2-xl mx-auto mb-80 max-w-338 px-32 text-center md:max-w-none md:px-40">Three Simple Steps. A Lasting Impact.</p>

      <div className="list scrollbar-none mx-auto mb-80 grid max-w-1432 grid-cols-[repeat(3,338)] gap-10 px-32 max-lg:overflow-auto md:grid-cols-[repeat(3,464px)] md:gap-20 md:px-40 lg:grid-cols-3">
        {mock.map(({ title, quote, imgurl }) => (
          <ExplanationCard key={imgurl} title={title} quote={quote} imgurl={imgurl} />
        ))}
      </div>
    </section>
  );
}

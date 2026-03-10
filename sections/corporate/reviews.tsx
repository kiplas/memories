import Arrow from "@/icons/arrow";
import Image from "next/image";
import { useState } from "react";

const mock = [
  {
    id: 1,
    text: "This gave our people something we didn’t know we were missing — a future emotional bond.",
    position: "HR Director, Global Tech Company",
    imgurl: "/mock/corporate/reviews-slider-icons/1.jpg",
    color: "#FF6F1B",
  },
  {
    id: 2,
    text: "We used Memories during our leadership retreat, and it became the highlight of the event.",
    position: "VP People, Consulting Firm",
    imgurl: "/mock/corporate/reviews-slider-icons/2.jpg",
    color: "#5B60FF",
  },
  {
    id: 3,
    text: "Simple, human, and powerful. It changed how we think about employee connection.",
    position: "Head of HR, Retail Brand",
    imgurl: "/mock/corporate/reviews-slider-icons/3.jpg",
    color: "#FF3FDC",
  },
  {
    id: 4,
    text: "Simple, human, and powerful. It changed how we think about employee connection.",
    position: "Head of HR, Retail Brand",
    imgurl: "/mock/corporate/reviews-slider-icons/3.jpg",
    color: "#FF3FDC",
  },
];

type Props = {
  text: string;
  position: string;
  imgurl: string;
  color: string;
};

function Card({ text, position, imgurl, color }: Props) {
  return (
    <div className="w-338 shrink-0 rounded-[40px] bg-white px-40 pt-24 pb-48 md:w-464">
      <Image className="mb-32 size-100" src={imgurl} alt="" width="100" height="100" />
      <h4 className="text-h3-xl mb-20" style={{ color }}>
        {text}
      </h4>
      <p className="text-small-xl">{position}</p>
    </div>
  );
}

export default function Reviews() {
  const [index, setIndex] = useState(0);

  const hasNext = index < mock.length - 2;
  const hasPrev = index > 0;

  function next() {
    if (hasNext) setIndex(index + 1);
  }

  function prev() {
    if (hasPrev) setIndex(index - 1);
  }

  return (
    <section className="overflow-hidden relative z-10 bg-[#f4f4f4] px-32 py-100 pb-40 md:py-80">
      <h2 className="text-h0-m mx-auto max-w-340 text-center font-bold -tracking-tighter md:max-w-none md:text-[10rem]/[1em]">
        What our clients
        <div className="mx-auto h-[1.1em] w-fit bg-linear-[90deg,#ff6f1b_0%,#5b60ff_53.85%,#ff3fdc_100%] bg-clip-text text-transparent">say…</div>
      </h2>

      <div className="mx-auto mt-64 max-w-1432 md:mt-80">
        <div style={{ "--index": index }} className="mb-40 flex -translate-x-[calc(464px*var(--index)+20px*var(--index))] gap-10 duration-300 ease-out md:gap-20">
          {mock.map(({ id, text, position, imgurl, color }) => (
            <Card key={id} text={text} position={position} imgurl={imgurl} color={color} />
          ))}
        </div>

        <div className="flex justify-center gap-20">
          <button className="grid size-54 cursor-pointer place-content-center rounded-full bg-[#e1e1e1] data-inactive:opacity-40" data-inactive={!hasPrev || null} onClick={prev}>
            <Arrow className="rotate-180" />
          </button>

          <button className="grid size-54 cursor-pointer place-content-center rounded-full bg-[#e1e1e1] data-inactive:opacity-40" data-inactive={!hasNext || null} onClick={next}>
            <Arrow />
          </button>
        </div>
      </div>
    </section>
  );
}

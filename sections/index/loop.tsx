import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap, { ScrollTrigger } from "@/client/gsap";

const images = [
  "/mock/index/loop/1.png",
  "/mock/index/loop/2.png",
  "/mock/index/loop/3.png",
  "/mock/index/loop/4.png",
  "/mock/index/loop/5.png",
  "/mock/index/loop/6.png",
  "/mock/index/loop/7.png",
  "/mock/index/loop/8.png",
  "/mock/index/loop/9.png",
  "/mock/index/loop/10.png",
];

export default function Preview() {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const animation = gsap.to(".row", {
        x: "var(--target-x)",
        duration: 7,
      });

      ScrollTrigger.create({
        trigger: container.current,
        start: "top 90%",
        animation,
      });
    },
    { scope: container },
  );

  return (
    <section className="relative z-1 overflow-clip bg-white py-80">
      <div ref={container} className="mx-auto flex w-1512 flex-col gap-y-24">
        <div className="row mx-auto flex -translate-x-1100 gap-x-20 [--target-x:-1470px]">
          <Image className="h-145 w-300 shrink-0 rounded-full" src={images[0]} alt="" width="300" height="145" />
          <Image className="h-145 w-300 shrink-0 rounded-full" src={images[0]} alt="" width="300" height="145" />
          <Image className="h-145 w-300 shrink-0 rounded-full" src={images[0]} alt="" width="300" height="145" />
          <Image className="h-145 w-300 shrink-0 rounded-full" src={images[0]} alt="" width="300" height="145" />
          <Image className="h-145 w-300 shrink-0 rounded-full" src={images[1]} alt="" width="300" height="145" />
          <span className="text-[200px] leading-145 font-bold -tracking-wider text-[#383433]">Moments</span>
          <Image className="h-145 w-300 shrink-0 rounded-full" src={images[2]} alt="" width="300" height="145" />
          <Image className="h-145 w-300 shrink-0 rounded-full" src={images[3]} alt="" width="300" height="145" />
          <Image className="h-145 w-300 shrink-0 rounded-full" src={images[3]} alt="" width="300" height="145" />
        </div>
        <div className="row flex -translate-x-1140 gap-x-20 [--target-x:-775px]">
          <Image className="h-145 w-300 shrink-0 rounded-full" src={images[4]} alt="" width="300" height="145" />
          <Image className="h-145 w-300 shrink-0 rounded-full" src={images[5]} alt="" width="300" height="145" />
          <Image className="h-145 w-300 shrink-0 rounded-full" src={images[5]} alt="" width="300" height="145" />
          <Image className="h-145 w-300 shrink-0 rounded-full" src={images[6]} alt="" width="300" height="145" />
          <Image className="h-145 w-300 shrink-0 rounded-full" src={images[6]} alt="" width="300" height="145" />
          <span className="text-[200px] leading-145 font-bold -tracking-wider text-[#383433]">That</span>
          <Image className="h-145 w-300 shrink-0 rounded-full" src={images[7]} alt="" width="300" height="145" />
          <Image className="h-145 w-300 shrink-0 rounded-full" src={images[8]} alt="" width="300" height="145" />
          <Image className="h-145 w-300 shrink-0 rounded-full" src={images[8]} alt="" width="300" height="145" />
          <Image className="h-145 w-300 shrink-0 rounded-full" src={images[8]} alt="" width="300" height="145" />
        </div>
        <div className="row flex -translate-x-788 gap-x-20 [--target-x:-1245px]">
          <Image className="h-145 w-300 shrink-0 rounded-full" src={images[9]} alt="" width="300" height="145" />
          <Image className="h-145 w-300 shrink-0 rounded-full" src={images[9]} alt="" width="300" height="145" />
          <Image className="h-145 w-300 shrink-0 rounded-full" src={images[9]} alt="" width="300" height="145" />
          <Image className="h-145 w-300 shrink-0 rounded-full" src={images[0]} alt="" width="300" height="145" />
          <Image className="h-145 w-300 shrink-0 rounded-full" src={images[1]} alt="" width="300" height="145" />
          <span className="text-[200px] leading-145 font-bold -tracking-wider text-[#383433]">Matter</span>
          <Image className="h-145 w-300 shrink-0 rounded-full" src={images[2]} alt="" width="300" height="145" />
          <Image className="h-145 w-300 shrink-0 rounded-full" src={images[2]} alt="" width="300" height="145" />
          <Image className="h-145 w-300 shrink-0 rounded-full" src={images[2]} alt="" width="300" height="145" />
          <Image className="h-145 w-300 shrink-0 rounded-full" src={images[3]} alt="" width="300" height="145" />
        </div>
      </div>

      <div className="text-orange text-h3-xl mt-80 text-center">Because the best gifts are felt, not bought.</div>
    </section>
  );
}

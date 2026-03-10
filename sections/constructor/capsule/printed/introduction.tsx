import Image from "next/image";
import { useCapsuleControls } from "@/state/capsule";

export default function Introduction() {
  const { setNextStage } = useCapsuleControls();

  return (
    <section className="flex min-h-[calc(100svh-98px)] flex-col items-center justify-center px-32 contain-layout md:pt-116">
      <div className="group relative h-68 w-full max-w-338 rounded-full md:h-163 md:max-w-811">
        <button
          className="text-orange ease-gentle group-hover:bg-orange group-hover:shadow-printed-cta border-orange relative z-10 size-full cursor-pointer rounded-full border bg-white text-[1.125rem] font-semibold -tracking-tighter duration-800 group-hover:text-white md:text-[2.75rem]"
          onClick={setNextStage}
        >
          <div className="ease-gentle duration-800 group-hover:scale-130">Create Your Printed Capsule</div>
        </button>

        <Image
          className="shadow-printed-shard ease-gentle pointer-events-none absolute top-1/2 left-1/2 hidden -translate-1/2 scale-50 duration-800 group-hover:-top-130 group-hover:-left-190 group-hover:scale-100 group-hover:-rotate-30 md:block"
          src="/mock/printed-capsule-introduction-shards/a.png"
          alt=""
          width="360"
          height="250"
        />

        <Image
          className="shadow-printed-shard ease-gentle pointer-events-none absolute top-1/2 left-1/2 hidden -translate-1/2 scale-50 duration-800 group-hover:-top-300 group-hover:left-600 group-hover:scale-100 group-hover:rotate-15 md:block"
          src="/mock/printed-capsule-introduction-shards/b.png"
          alt=""
          width="360"
          height="250"
        />

        <Image
          className="shadow-printed-shard ease-gentle pointer-events-none absolute top-1/2 left-1/2 hidden -translate-1/2 scale-50 duration-800 group-hover:top-390 group-hover:left-70 group-hover:scale-100 group-hover:rotate-15 md:block"
          src="/mock/printed-capsule-introduction-shards/c.png"
          alt=""
          width="360"
          height="250"
        />

        <Image
          className="shadow-printed-shard ease-gentle pointer-events-none absolute top-1/2 left-1/2 hidden -translate-1/2 scale-50 duration-800 group-hover:top-360 group-hover:left-1010 group-hover:scale-100 group-hover:-rotate-15 md:block"
          src="/mock/printed-capsule-introduction-shards/d.png"
          alt=""
          width="360"
          height="250"
        />
      </div>

      <div className="absolute z-10 mt-24 max-md:bottom-97 max-md:left-1/2 max-md:-translate-x-1/2 md:relative">
        <div className="flex flex-col items-center gap-x-20 gap-y-4 md:flex-row">
          <span className="text-[1rem] font-bold -tracking-tighter md:text-[1.5rem]">$19.99 per card</span>
          <span className="text-orange text-[0.75rem] font-medium -tracking-tighter md:text-[0.875rem]">Or </span>
          <span className="text-[1rem] font-bold -tracking-tighter md:text-[1.5rem]">Save with package*</span>
        </div>

        <div className="mt-16 text-center text-[0.75rem] md:mt-48">*Buy a package and pay less per card (requires a free account)</div>
      </div>
    </section>
  );
}

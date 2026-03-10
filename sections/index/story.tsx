"use client";

import { useDialogControls } from "@/state/dialog";

export default function Story() {
  const { open } = useDialogControls();

  return (
    <section className="relative z-10 bg-white">
      <hgroup className="text-orange top-0 mx-auto px-32 pt-56 text-center md:sticky md:py-112">
        <h2 className="mx-auto max-w-1131 text-[3.125rem]/[3.25rem] font-bold -tracking-wider wrap-anywhere max-md:max-w-338 lg:text-[10rem]/[1em]">
          Your story deserves to be remembered.
        </h2>
        <div className="text-h2-m md:text-h2-xl mx-auto mt-32 max-md:max-w-338 md:mt-64">Create your first capsule today — it’s free to start.</div>
      </hgroup>

      <div className="relative z-10 px-32 md:bg-white/1 md:mask-[linear-gradient(transparent,black_30%)] md:py-276 md:backdrop-blur-2xl">
        <button
          className="group bg-orange md:text-orange shadow-story-cta relative mx-auto mt-84 grid aspect-1288/260 w-338 max-w-1288 cursor-pointer place-content-center overflow-clip rounded-full border-current text-[1.25rem] font-semibold -tracking-tighter text-white md:w-full md:border md:bg-transparent md:text-[4.875rem] md:shadow-none"
          onClick={() => open({ name: "capsule-popup" })}
        >
          <div className="ease-slow relative z-1 duration-600 group-hover:scale-120 group-hover:text-white">Create Your First Capsule</div>
          <div className="ease-slow bg-orange absolute top-[140%] left-1/2 hidden size-1400 origin-center -translate-x-1/2 -translate-y-1/2 scale-10 rounded-full duration-500 group-hover:scale-100 md:block"></div>
        </button>
      </div>
    </section>
  );
}

"use client";

import Pause from "@/icons/pause";
import Play from "@/icons/play-rounded";
import Fullscreen from "@/icons/fullscreen";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";

export default function Preview() {
  const video = useRef<HTMLVideoElement>(null);
  const container = useRef<HTMLDivElement>(null);
  const [initiated, setInitiated] = useState(false);
  const [paused, setPaused] = useState(true);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);

  function play() {
    setInitiated(true);
    setPaused(false);

    onLoadedMetadata();
    video.current?.play();
  }

  function pause() {
    setPaused(true);

    video.current?.pause();
  }

  function toggle() {
    setPaused(!paused);

    if (paused) video.current?.play();
    else video.current?.pause();
  }

  function format(timestamp: number) {
    const minutes = String(Math.floor(timestamp / 60));
    const seconds = String(Math.floor(timestamp % 60));

    return `${minutes}:${seconds.padStart(2, "0")}`;
  }

  function onLoadedMetadata() {
    setDuration(video.current?.duration || 0);
  }

  function onTimeUpdate() {
    setProgress(video.current?.currentTime || 0);
  }

  function toggleFullscreen() {
    if (document.fullscreenElement) document.exitFullscreen();
    else container.current?.requestFullscreen();
  }

  return (
    <section className="relative z-1 bg-white px-32 pt-112 pb-64" id="preview">
      <hgroup className="text-center">
        <h2 className="text-h1-m md:text-h1-xl">See How It Works</h2>
        <span className="text-accent-xl mt-24">Watch a quick demo of creating your first capsule.</span>
      </hgroup>

      <div ref={container} className="relative mx-auto mt-64 aspect-338/400 max-w-1190 overflow-hidden rounded-[44px] md:aspect-1190/700">
        <video
          className="size-full object-cover"
          src="/mock/index/preview.mp4"
          poster="/mock/index/preview-poster.webp"
          ref={video}
          onPause={pause}
          onPlay={play}
          onTimeUpdate={onTimeUpdate}
          onLoadedMetadata={onLoadedMetadata}
        />

        <button
          className={cn(
            "group ease-slow absolute inset-0 z-10 m-auto size-125 cursor-pointer rounded-full bg-white text-black duration-600 hover:scale-95 lg:size-250",
            initiated && "pointer-events-none opacity-0",
          )}
          onClick={play}
        >
          <div className="ease-slow text-[1.25rem] font-medium -tracking-tighter duration-600 group-hover:scale-180 lg:text-[2.5rem]">Play</div>
        </button>

        <div
          className={cn(
            "ease-slow absolute bottom-24 left-1/2 z-10 flex h-78 w-15/16 max-w-582 -translate-x-1/2 items-center gap-x-24 rounded-full bg-[#383433]/60 px-32 text-white backdrop-blur-2xl duration-600 md:bottom-40 md:gap-x-48",
            !initiated && "opacity-0",
          )}
        >
          <button className="grid cursor-pointer [grid-areas:.]" onClick={toggle}>
            <Pause className={cn("ease-slow size-32 duration-200 [grid-area:1/1/2/2]", paused && "opacity-0")} />
            <Play className={cn("ease-slow size-32 duration-200 [grid-area:1/1/2/2]", !paused && "opacity-0")} />
          </button>

          <div className="w-full pt-16">
            <div className="h-2 w-full bg-white/40">
              <div className="bg-green ease-slow size-full origin-left scale-x-(--progress) duration-200" style={{ "--progress": progress / duration }}></div>
            </div>

            <div className="text-small-m mt-8 flex justify-between">
              <span>{format(progress)}</span>
              <span>{format(duration)}</span>
            </div>
          </div>

          <button className="cursor-pointer" onClick={toggleFullscreen}>
            <Fullscreen />
          </button>
        </div>
      </div>
    </section>
  );
}

"use client";

import Play from "@/icons/play";
import Image from "next/image";
import { useRef, useState } from "react";

type CommentWithImage = { name: string; quote: string; background: { mime: "image/png"; url: string; poster?: undefined | null } };
type CommentWithVideo = { name: string; quote: string; background: { mime: "video/mp4"; url: string; poster: string } };
type CommentWithBackground = CommentWithVideo | CommentWithImage;
type CommentWithAuthor = { name: string; quote: string; author: { mime: "image/png"; url: string } };
type Comment = CommentWithBackground | CommentWithAuthor;

const comments: Comment[] = [
  {
    name: "Olivia W.",
    quote: "I opened a letter from my mom on my wedding day. She wrote it five years earlier.",
    background: {
      mime: "video/mp4",
      url: "/mock/index/preview.mp4",
      poster: "/mock/index/preview-poster.webp",
    },
  },
  {
    name: "Ethan R.",
    quote: "Seeing my own video from college, sent to myself at 30, felt surreal.",
    author: {
      mime: "image/png",
      url: "/mock/index/comments/author.png",
    },
  },
  {
    name: "Grace T.",
    quote: "A simple message to my future self gave me strength when I needed it most.",
    background: {
      mime: "image/png",
      url: "/mock/index/comments/background.png",
    },
  },
  {
    name: "Jacob H.",
    quote: "My dad left me a birthday note when I turned 18. It’s framed on my desk now.",
    background: {
      mime: "image/png",
      url: "/mock/index/comments/background.png",
    },
  },
  {
    name: "Daniel M.",
    quote: "I wrote a letter to my son when he was 6. He opened it at graduation. He said it was the best gift.",
    author: {
      mime: "image/png",
      url: "/mock/index/comments/author.png",
    },
  },
  {
    name: "Sophia & Mark L.",
    quote: "We recorded a message for our first anniversary. Watching it ten years later made us laugh and cry.",
    background: {
      mime: "video/mp4",
      url: "/mock/index/preview.mp4",
      poster: "/mock/index/preview-poster.webp",
    },
  },
];

type PlayerProps = {
  src: string;
  poster: string;
};

function Player({ src, poster }: PlayerProps) {
  const video = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(true);

  function play() {
    setPaused(false);
    video.current?.play();
  }

  function pause() {
    setPaused(true);
    video.current?.pause();
  }

  function toggle() {
    if (paused) play();
    else pause();
  }

  return (
    <div className="absolute inset-0">
      <video ref={video} className="size-full object-cover brightness-80" src={src} onPause={pause} poster={poster} />

      <button className="group absolute inset-0 z-10 cursor-pointer" data-paused={paused || null} onClick={toggle}>
        <div className="ease-slow absolute inset-0 m-auto grid size-84 place-content-center rounded-full bg-white opacity-0 duration-500 group-data-paused:opacity-100">
          <Play className="duration-[inherit] ease-[inherit] group-hover:scale-120" />
        </div>
      </button>
    </div>
  );
}

function CommentWithBackground({ comment: { background, name, quote } }: { comment: CommentWithBackground }) {
  return (
    <div className="relative flex h-400 min-w-300 flex-col justify-between overflow-clip rounded-3xl p-24">
      <span className="relative z-10 text-[0.75rem] font-medium -tracking-tighter text-white">{name}</span>

      <p className="relative z-10 text-[1.125rem] font-semibold -tracking-tighter text-white before:absolute before:-translate-x-full before:content-['“'] after:absolute after:content-['”']">
        {quote}
      </p>

      {background.mime.startsWith("video") && background.poster ? (
        <Player src={background.url} poster={background.poster} />
      ) : (
        <Image className="absolute inset-0 size-full object-cover" src={background.url} alt="" width="343" height="400" />
      )}
    </div>
  );
}

function CommentWithAuthor({ comment: { author, name, quote } }: { comment: CommentWithAuthor }) {
  return (
    <div className="flex min-w-300 gap-x-16 rounded-3xl bg-[#35302E]/10 p-12">
      <Image className="size-60 rounded-full" src={author.url} alt="" height="60" width="60" />

      <div className="mt-4">
        <span className="text-[0.75rem] font-medium -tracking-tighter text-[#685E58]">{name}</span>

        <p className="relative mt-6 text-[1.5rem] font-semibold -tracking-tighter before:absolute before:-translate-x-full before:content-['“'] after:absolute after:content-['”']">
          {quote}
        </p>
      </div>
    </div>
  );
}

function Comment({ comment }: { comment: Comment }) {
  return "background" in comment ? <CommentWithBackground comment={comment} /> : <CommentWithAuthor comment={comment} />;
}

export default function Comments() {
  return (
    <div className="sticky top-0 z-1 bg-white py-64 lg:bg-[#F5F5F5]">
      <div className="t scrollbar-none mx-auto grid max-w-(--w-viewport) grid-cols-[repeat(4,minmax(300px,1fr))] gap-x-20 overflow-auto px-32 lg:px-40">
        <div className="flex h-full flex-col gap-y-20 lg:justify-center">
          <Comment comment={comments[0]} />
        </div>
        <div className="flex h-full flex-col gap-y-20 lg:justify-center">
          <Comment comment={comments[1]} />
          <Comment comment={comments[2]} />
        </div>
        <div className="flex h-full flex-col gap-y-20 lg:justify-center">
          <Comment comment={comments[3]} />
          <Comment comment={comments[4]} />
        </div>
        <div className="flex h-full flex-col gap-y-20 lg:justify-center">
          <Comment comment={comments[5]} />
        </div>
      </div>
    </div>
  );
}

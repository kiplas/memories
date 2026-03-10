"use client";

import Close from "@/icons/close";
import { useState } from "react";
import { createPortal } from "react-dom";

const entry = {
  name: "How to Start Your First Capsule Step by Step",
  summary: "A clear guide for beginners.",
  content: [
    {
      content:
        "Sorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem sollicitudin lacus, ut interdum tellus elit sed risus. Maecenas eget condimentum velit, sit amet feugiat lectus. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Praesent auctor purus luctus enim egestas, ac scelerisque ante pulvinar. Donec ut rhoncus ex. Suspendisse ac rhoncus nisl, eu tempor urna. Curabitur vel bibendum lorem. Morbi convallis convallis diam sit amet lacinia. Aliquam in elementum tellus.",
    },
    {
      content:
        "Curabitur tempor quis eros tempus lacinia. Nam bibendum pellentesque quam a convallis. Sed ut vulputate nisi. Integer in felis sed leo vestibulum venenatis. Suspendisse quis arcu sem. Aenean feugiat ex eu vestibulum vestibulum. Morbi a eleifend magna. Nam metus lacus, porttitor eu mauris a, blandit ultrices nibh. Mauris sit amet magna non ligula vestibulum eleifend. Nulla varius volutpat turpis sed lacinia. Nam eget mi in purus lobortis eleifend. Sed nec ante dictum sem condimentum ullamcorper quis venenatis nisi. Proin vitae facilisis nisi, ac posuere leo.",
    },
    {
      content:
        "Nam pulvinar blandit velit, id condimentum diam faucibus at. Aliquam lacus nisi, sollicitudin at nisi nec, fermentum congue felis. Quisque mauris dolor, fringilla sed tincidunt ac, finibus non odio. Sed vitae mauris nec ante pretium finibus. Donec nisl neque, pharetra ac elit eu, faucibus aliquam ligula. Nullam dictum, tellus tincidunt tempor laoreet, nibh elit sollicitudin felis, eget feugiat sapien diam nec nisl. Aenean gravida turpis nisi, consequat dictum risus dapibus a. Duis felis ante, varius in neque eu, tempor suscipit sem. Maecenas ullamcorper gravida sem sit amet cursus. Etiam pulvinar purus vitae justo pharetra consequat. Mauris id mi ut arcu feugiat maximus. Mauris consequat tellus id tempus aliquet.",
    },
    {
      content:
        "Vestibulum dictum ultrices elit a luctus. Sed in ante ut leo congue posuere at sit amet ligula. Pellentesque eget augue nec nisl sodales blandit sed et sem. Aenean quis finibus arcu, in hendrerit purus. Praesent ac aliquet lorem. Morbi feugiat aliquam ligula, et vestibulum ligula hendrerit vitae. Sed ex lorem, pulvinar sed auctor sit amet, molestie a nibh. Ut euismod nisl arcu, sed placerat nulla volutpat aliquet. Ut id convallis nisl. Ut mauris leo, lacinia sed elit id, sagittis rhoncus odio. Pellentesque sapien libero, lobortis a placerat et, malesuada sit amet dui. Nam sem sapien, congue eu rutrum nec, pellentesque eget ligula.",
    },
    {
      content:
        "Vestibulum dictum ultrices elit a luctus. Sed in ante ut leo congue posuere at sit amet ligula. Pellentesque eget augue nec nisl sodales blandit sed et sem. Aenean quis finibus arcu, in hendrerit purus. Praesent ac aliquet lorem. Morbi feugiat aliquam ligula, et vestibulum ligula hendrerit vitae. Sed ex lorem, pulvinar sed auctor sit amet, molestie a nibh. Ut euismod nisl arcu, sed placerat nulla volutpat aliquet. Ut id convallis nisl. Ut mauris leo, lacinia sed elit id, sagittis rhoncus odio. Pellentesque sapien libero, lobortis a placerat et, malesuada sit amet dui. Nam sem sapien, congue eu rutrum nec, pellentesque eget ligula.",
    },
    {
      content:
        "Vestibulum dictum ultrices elit a luctus. Sed in ante ut leo congue posuere at sit amet ligula. Pellentesque eget augue nec nisl sodales blandit sed et sem. Aenean quis finibus arcu, in hendrerit purus. Praesent ac aliquet lorem. Morbi feugiat aliquam ligula, et vestibulum ligula hendrerit vitae. Sed ex lorem, pulvinar sed auctor sit amet, molestie a nibh. Ut euismod nisl arcu, sed placerat nulla volutpat aliquet. Ut id convallis nisl. Ut mauris leo, lacinia sed elit id, sagittis rhoncus odio. Pellentesque sapien libero, lobortis a placerat et, malesuada sit amet dui. Nam sem sapien, congue eu rutrum nec, pellentesque eget ligula.",
    },
    {
      content:
        "Vestibulum dictum ultrices elit a luctus. Sed in ante ut leo congue posuere at sit amet ligula. Pellentesque eget augue nec nisl sodales blandit sed et sem. Aenean quis finibus arcu, in hendrerit purus. Praesent ac aliquet lorem. Morbi feugiat aliquam ligula, et vestibulum ligula hendrerit vitae. Sed ex lorem, pulvinar sed auctor sit amet, molestie a nibh. Ut euismod nisl arcu, sed placerat nulla volutpat aliquet. Ut id convallis nisl. Ut mauris leo, lacinia sed elit id, sagittis rhoncus odio. Pellentesque sapien libero, lobortis a placerat et, malesuada sit amet dui. Nam sem sapien, congue eu rutrum nec, pellentesque eget ligula.",
    },
    {
      content:
        "Vestibulum dictum ultrices elit a luctus. Sed in ante ut leo congue posuere at sit amet ligula. Pellentesque eget augue nec nisl sodales blandit sed et sem. Aenean quis finibus arcu, in hendrerit purus. Praesent ac aliquet lorem. Morbi feugiat aliquam ligula, et vestibulum ligula hendrerit vitae. Sed ex lorem, pulvinar sed auctor sit amet, molestie a nibh. Ut euismod nisl arcu, sed placerat nulla volutpat aliquet. Ut id convallis nisl. Ut mauris leo, lacinia sed elit id, sagittis rhoncus odio. Pellentesque sapien libero, lobortis a placerat et, malesuada sit amet dui. Nam sem sapien, congue eu rutrum nec, pellentesque eget ligula.",
    },
  ],
};

const faq = [
  {
    ...entry,
    id: "a",
  },
  {
    ...entry,
    id: "b",
  },
  {
    ...entry,
    id: "c",
  },
];

type HeaderProps = {
  name: string;
  summary: string;
  onClick: () => unknown;
};

function Header({ name, summary, onClick }: HeaderProps) {
  return (
    <button
      className="hover:bg-pink ease-slow hover:border-pink flex h-124 w-full cursor-pointer items-center justify-center rounded-full border border-[#BBBBBB] p-12 px-48 duration-600 md:justify-between md:px-12 md:pl-64"
      onClick={onClick}
    >
      <div className="text-center md:text-left">
        <div className="text-h3-xl">{name}</div>
        <div className="text-accent-m md:text-accent-xl mt-4 text-black/40">{summary}</div>
      </div>

      <div className="bg-pink hidden aspect-square h-full place-content-center rounded-full text-[1.25rem] font-bold -tracking-tighter text-white md:grid">Read</div>
    </button>
  );
}

type PanelProps = (typeof faq)[number] & { onClose: () => unknown };

function Panel({ name, summary, content, onClose }: PanelProps) {
  return (
    <article className="scrollbar-none fixed inset-0 z-100 overflow-auto bg-black/70 py-18">
      <div className="relative mx-auto max-w-658 bg-white px-64 py-32">
        <hgroup className="max-w-430">
          <h3 className="text-h3-xl">{name}</h3>
          <div className="text-accent-xl mt-12 text-black/40">{summary}</div>
        </hgroup>

        <button
          className="absolute top-32 right-64 grid size-36 cursor-pointer place-content-center rounded-full bg-black text-white duration-200 ease-out hover:rotate-180"
          onClick={onClose}
        >
          <Close />
        </button>

        <div className="text-small-xl mt-32 flex flex-col gap-y-[1em]">
          {content.map(({ content }, index) => (
            <p key={index}>{content}</p>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function FAQ() {
  const [active, setActive] = useState<(typeof faq)[number] | null>(null);

  return (
    <section className="relative z-1 bg-linear-to-b from-white to-[#FFF7F4] px-32 py-64">
      <hgroup className="text-center">
        <h2 className="text-h1-m md:text-h1-xl text-pink mx-auto max-w-780">Write the letter your future self needs.</h2>
        <div className="text-accent-xl mt-32">Ideas and prompts to help you start writing today.</div>
      </hgroup>

      <div className="mx-auto mt-64 flex max-w-948 flex-col gap-y-12">
        {faq.map((entry) => (
          <Header key={entry.id} name={entry.name} summary={entry.summary} onClick={() => setActive(entry)} />
        ))}
      </div>

      {active && createPortal(<Panel {...active} onClose={() => setActive(null)} />, document.documentElement)}
    </section>
  );
}

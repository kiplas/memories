"use client";

import Facebook from "@/icons/facebook";
import FullLogo from "@/icons/full-logo";
import Instagram from "@/icons/instgram";
import Youtube from "@/icons/youtube";
import Plane from "@/icons/paper-plane";
import TextSlide from "@/components/ui/TextSlide";
import Link from "next/link";
import Arrow from "@/icons/arrow";
import { useState } from "react";
import { subscribe } from "@/actions/newsletter";
import z from "zod";

const sections = [
  {
    name: "Product",
    anchors: [
      { label: "How It Works", href: "/#workflow" },
      { label: "Pricing", href: "/#pricing" },
    ],
  },
  {
    name: "Experiences",
    anchors: [
      { label: "Digital Capsule", href: "/create/digital/capsule" },
      { label: "Printed Capsule", href: "/create/printed/capsule" },
      { label: "Letter to the Future", href: "/create/digital/letter" },
      { label: "Corporate", href: "/corporate" },
    ],
  },
  {
    name: "Legal",
    anchors: [
      { label: "Privacy", href: "" },
      { label: "Terms", href: "" },
    ],
  },
];

function Newsletter() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string>();

  async function action() {
    setError(undefined);

    const parsedEmail = z.email().safeParse(email);

    if (parsedEmail.error) return setError("Invalid e-mail");

    const response = await subscribe({ email });

    if (response.success) return setSuccess(true);
    else setError(response.error);
  }

  return (
    <div className="ga-y- flex flex-col items-center pt-40 pb-32 md:pb-48">
      <Plane className="size-48 md:size-90" />

      {success ? (
        <div className="text-green text-h3-m md:text-h3-xl mx-32 mt-24 text-center md:mt-45">You’re in. Beautiful moments are now on their way to your future inbox.</div>
      ) : (
        <>
          <h2 className="text-accent-m md:text-h3-xl mt-32 md:mt-40">Get prompts & inspiration monthly.</h2>

          <form className="relative mt-45 w-full max-w-762 text-[1.125rem] md:text-[1.5rem]" action={action}>
            <input
              className="data-error:border-orange h-90 w-full rounded-full bg-[#F3F3F3] px-32 -tracking-tighter text-black outline-none placeholder:text-black md:h-97"
              type="text"
              placeholder="Enter your e-mail"
              value={email}
              data-error={error || null}
              onInput={({ currentTarget }) => setEmail(currentTarget.value)}
            />

            <button className="absolute top-4 right-4 grid size-82 cursor-pointer place-content-center rounded-full bg-black text-white md:h-89 md:w-202">
              <span className="hidden md:inline">Subscribe</span>
              <Arrow className="md:hidden" />
            </button>
          </form>
        </>
      )}
    </div>
  );
}

function Socials() {
  return (
    <nav className="flex gap-32">
      <a>
        <Facebook />
      </a>
      <a>
        <Instagram />
      </a>
      <a>
        <Youtube />
      </a>
    </nav>
  );
}

export default function Outro() {
  return (
    <section className="relative z-1 bg-white px-20">
      <Newsletter />

      <div className="by-black by-solid mx-auto grid max-w-1190 grid-cols-2 justify-between gap-y-32 border-y py-32 md:py-48 lg:grid-cols-[repeat(4,222px)]">
        {sections.map(({ name, anchors }) => (
          <section className="lg:last:justify-self-end lg:last:text-right" key={name}>
            <h2 className="text-accent-m md:text-h3-xl">{name}</h2>

            <nav className="md:text-accent-xl mt-16 flex flex-col gap-y-8 md:mt-24">
              {anchors.map(({ label, href }) => (
                <Link className="group/slide w-fit" href={href} key={label}>
                  <TextSlide>{label}</TextSlide>
                </Link>
              ))}
            </nav>
          </section>
        ))}
      </div>

      <div className="mx-auto mt-32 flex max-w-1190 flex-col-reverse justify-between gap-y-32 md:mt-48 md:flex-row">
        <div className="flex flex-col gap-y-10">
          <span className="text-supersmall-xl">© {new Date().getFullYear()} Memories. All rights reserved.</span>
          <span className="text-accent-xl">Hold the World. Send the World!</span>
        </div>

        {/* <Socials /> */}
      </div>

      <FullLogo className="mx-auto mt-32 aspect-356/75 h-auto w-full max-w-1190 md:mt-7" />
    </section>
  );
}

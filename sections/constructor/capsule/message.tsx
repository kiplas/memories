"use client";

import Image from "next/image";
import Card from "@/components/capsule";
import Controls from "@/components/capsule-stage-controls";
import Tabs from "@/components/capsule-tabs";
import Inspect from "@/icons/inspect";
import { useCapsule, useCapsuleControls } from "@/state/capsule";
import { useMemo, useState } from "react";
import { createObjectURL } from "@/lib/media";
import { cn } from "@/lib/utils";
import Chevron from "@/icons/chevron";

type ReturnProps = {
  className?: string;
  onClick: () => unknown;
};

function Return({ className, onClick }: ReturnProps) {
  return (
    <button className={cn("flex size-48 cursor-pointer items-center justify-center rounded-full bg-white", className)} onClick={onClick}>
      <Chevron />
    </button>
  );
}

type PreviewProps = {
  onClose: () => unknown;
};

function Preview({ onClose }: PreviewProps) {
  const { uploads, illustration, message } = useCapsule();

  const images = useMemo(() => uploads.filter((upload) => !!upload).map((upload) => (upload instanceof File ? createObjectURL(upload) : upload.url)), [uploads]);

  return (
    <div className="absolute inset-0 size-full bg-black/90 px-17">
      <Return className="absolute top-40 left-40" onClick={onClose} />
      <Card className="absolute top-1/2 left-1/2 max-w-700 -translate-1/2" images={images} illustration={illustration} message={message} />
    </div>
  );
}

type HGroupProps = {
  className?: string;
};

function HGroup({ className }: HGroupProps) {
  return (
    <hgroup className={cn("flex flex-col items-center", className)}>
      <Image src="/pencil.png" alt="" width="48" height="48" />
      <h2 className="text-h3-m md:text-h3-xl">Add Message</h2>
    </hgroup>
  );
}

export default function Message() {
  const [preview, setPreview] = useState(false);
  const { uploads, illustration, message } = useCapsule();
  const { setMessage } = useCapsuleControls();

  const images = useMemo(() => uploads.filter((upload) => !!upload).map((upload) => (upload instanceof File ? createObjectURL(upload) : upload.url)), [uploads]);

  return (
    <section className="relative min-h-[calc(100svh-98px)] pb-40">
      <Tabs />

      <div className="mt-24 px-32">
        <div className="mx-auto flex max-w-1192 flex-col gap-x-50 gap-y-24 rounded-[44px] md:bg-[#F5F5F5] md:p-32 lg:mt-40 lg:h-453 lg:flex-row">
          <HGroup className="lg:hidden" />

          <div className="aspect-550/389 w-full shrink-0 overflow-clip rounded-2xl bg-black/5 lg:w-550">
            <Card images={images} illustration={illustration} message={message} />
          </div>

          <div className="flex w-full flex-col justify-between">
            <HGroup className="hidden lg:flex" />

            <textarea
              className="hover:shadow-constructor-input ease-slow h-141 resize-none rounded-[20px] border border-[#BBBBBB] bg-white px-24 py-20 duration-600"
              placeholder="Write your message here ..."
              name=""
              maxLength={200}
              rows={3}
              onInput={({ currentTarget }) => setMessage(currentTarget.value)}
            />

            <button
              className="bg-blue mx-auto flex cursor-pointer items-center gap-x-4 rounded-full p-8 text-[1rem] font-medium -tracking-tighter text-white"
              onClick={() => setPreview(true)}
            >
              <Inspect />
              <span>Preview</span>
            </button>

            <div className="text-accent-xl mt-24 text-center md:mb-16">Max 200 characters — Short notes look best.</div>
          </div>
        </div>

        <Controls className="mt-24 md:mt-40" />
      </div>

      {preview && <Preview onClose={() => setPreview(false)} />}
    </section>
  );
}

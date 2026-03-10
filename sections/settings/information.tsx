"use client";

import Edit from "@/icons/edit";
import Upload from "@/icons/upload";
import Image from "next/image";
import Input from "@/components/input";
import Close from "@/icons/close";
import gsap, { Draggable } from "@/client/gsap";
import z from "zod";
import { useGSAP } from "@gsap/react";
import { createRef, useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { capitalize } from "@/lib/strings";
import { createObjectURL } from "@/lib/media";
import { updateEmail, updateName, updateImage } from "@/actions/user";
import { useControlledInput } from "@/hooks/use-controlled-input";
import { useTRPC } from "@/state/trpc";
import { useQuery, useQueryClient } from "@tanstack/react-query";

type ScaleRangeProps = {
  onChange: (scale: number) => unknown;
};

function ScaleRange({ onChange }: ScaleRangeProps) {
  const thumbRef = createRef<HTMLButtonElement>();
  const rangeRef = createRef<HTMLDivElement>();

  useGSAP(() => {
    const thumb = thumbRef.current;
    const range = rangeRef.current;

    if (!thumb || !range) return;

    Draggable.create(thumb, {
      type: "x",
      bounds: range,
      onDrag: function () {
        const maxX = this.maxX as number;
        const x = this.x as number;

        const ratio = x / maxX;
        const modifier = 1 * ratio;

        onChange(modifier);
      },
    });
  });

  return (
    <div ref={rangeRef} className="relative mt-10">
      <button ref={thumbRef} className="relative z-10 size-32 cursor-grab rounded-full bg-black active:cursor-grabbing"></button>
      <div className="absolute top-1/2 left-0 h-1 w-full -translate-y-1/2 bg-[#D9D9D9]"></div>
    </div>
  );
}

type ImageEditorProps = {
  onClose: () => unknown;
  file: File;
};

function getBounds(container: HTMLElement, element: HTMLElement) {
  const containerBounds = container.getBoundingClientRect();
  const elementBounds = element.getBoundingClientRect();

  return {
    top: containerBounds.y - elementBounds.y,
    right: elementBounds.width - (containerBounds.x - elementBounds.x) - containerBounds.width,
    bottom: elementBounds.height - (containerBounds.y - elementBounds.y) - containerBounds.height,
    left: containerBounds.x - elementBounds.x,
  };
}

function ImageEditor({ onClose, file }: ImageEditorProps) {
  const MULTIPLIER = 1.5;
  const TARGET_SIZE = 300;
  const [scale, setScale] = useState(1);
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const container = useRef<HTMLDivElement>(null);
  const image = useRef<HTMLImageElement>(null);
  const ellipse = useRef<HTMLDivElement>(null);

  const url = createObjectURL(file);

  async function onSave() {
    const canvas = new OffscreenCanvas(TARGET_SIZE, TARGET_SIZE);
    const ctx = canvas.getContext("2d");

    if (!ctx) throw new Error("Context is undefined");

    const c = container.current;
    const i = image.current;
    const e = ellipse.current;

    if (!c || !i || !e) throw new Error("Unable to get elements");

    const bounds = getBounds(e, i);
    const rect = i.getBoundingClientRect();

    const coefficient = i.naturalHeight / rect.height;

    const sx = bounds.left * coefficient;
    const sy = bounds.top * coefficient;
    const sWidth = TARGET_SIZE * coefficient;
    const sHeight = TARGET_SIZE * coefficient;

    ctx.drawImage(i, sx, sy, sWidth, sHeight, 0, 0, TARGET_SIZE, TARGET_SIZE);

    const blob = await canvas.convertToBlob({ type: "image/webp", quality: 1 });

    const { url } = await updateImage(blob);

    queryClient.invalidateQueries({ queryKey: trpc.session.user.queryKey() });
    onClose();
  }

  function onScale(s: number) {
    setScale(1 + s);

    const c = container.current;
    const i = image.current;

    if (!c || !i) return;

    const bounds = getBounds(c, i);

    if (bounds.bottom < 0) gsap.set(i, { y: `+=${-bounds.bottom}` });
    if (bounds.top < 0) gsap.set(i, { y: `-=${-bounds.top}` });
    if (bounds.left < 0) gsap.set(i, { x: `-=${-bounds.left}` });
    if (bounds.right < 0) gsap.set(i, { x: `+=${-bounds.right}` });
  }

  useEffect(() => {
    let locked = true;
    let touch = { x: 0, y: 0 };

    function mousedown({ clientX, clientY }: MouseEvent) {
      locked = false;

      const c = container.current;
      const i = image.current;

      if (!c || !i) return;

      touch = {
        x: clientX,
        y: clientY,
      };
    }

    function mouseup() {
      locked = true;
    }

    function mousemove({ clientX, clientY }: MouseEvent) {
      if (locked) return;

      const c = container.current;
      const i = image.current;

      if (!c || !i) return;

      const bounds = getBounds(c, i);

      const delta = {
        x: (clientX - touch.x) * MULTIPLIER,
        y: (clientY - touch.y) * MULTIPLIER,
      };

      touch = {
        x: clientX,
        y: clientY,
      };

      if (delta.x > bounds.left || delta.x < -bounds.right) return;
      if (delta.y > bounds.top || delta.y < -bounds.bottom) return;

      gsap.set(i, {
        x: `+=${delta.x}`,
        y: `+=${delta.y}`,
      });
    }

    const controller = new AbortController();

    container.current?.addEventListener("mousedown", mousedown, { signal: controller.signal });
    document.addEventListener("mousemove", mousemove, { signal: controller.signal });
    document.addEventListener("mouseup", mouseup, { signal: controller.signal });

    return () => controller.abort();
  }, [container, image]);

  return (
    <aside className="fixed inset-0 z-20 flex items-center justify-center bg-black/70 px-16">
      <div className="flex aspect-713/590 w-full max-w-713 flex-col gap-y-10 rounded-3xl bg-white px-16 pt-20 pb-32 md:px-24">
        <header className="flex items-center justify-between">
          <h3 className="text-h3-xl">Crop your photo</h3>

          <button className="grid size-36 cursor-pointer place-content-center rounded-full bg-black text-white" onClick={onClose}>
            <Close />
          </button>
        </header>

        <div
          ref={container}
          className="relative aspect-338/260 w-full shrink-2 cursor-grab justify-center overflow-clip rounded-3xl bg-black/70 select-none active:cursor-grabbing md:aspect-665/420"
          draggable="false"
        >
          <Image
            ref={image}
            draggable="false"
            style={{ scale }}
            className="pointer-events-none absolute top-1/2 left-1/2 h-auto min-h-full w-full min-w-full origin-center -translate-1/2 object-cover"
            src={url}
            alt=""
            width="665"
            height="420"
          />

          <div ref={ellipse} className="absolute top-1/2 left-1/2 z-10 size-300 -translate-1/2 rounded-full" />

          <svg className="pointer-events-none absolute inset-0 z-9999" width="100%" height="100%">
            <defs>
              <mask id="hole-rc-1">
                <rect width="100%" height="100%" fill="white"></rect>
                <ellipse cx="50%" cy="50%" rx="150" ry="150" fill="black"></ellipse>
              </mask>
            </defs>

            <rect fill="black" fillOpacity="0.5" width="100%" height="100%" mask="url(#hole-rc-1)"></rect>
          </svg>
        </div>

        <div className="flex items-end gap-x-42 max-md:mt-10 max-md:flex-col">
          <div className="w-full">
            <span>Zoom</span>
            <ScaleRange onChange={onScale} />
          </div>

          <div className="grid shrink-0 grid-cols-2 gap-4 max-md:mx-auto max-md:mt-20">
            <button className="bg-green h-36 w-100 cursor-pointer rounded-full text-[0.75rem]/[1.0752rem] font-normal text-white" onClick={onSave}>
              Save
            </button>
            <button className="h-36 w-100 cursor-pointer rounded-full bg-[#E2E2E2] text-[0.75rem]/[1.0752rem] font-normal" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

type EditorProps = { onClose: () => unknown };

function Editor({ onClose }: EditorProps) {
  const trpc = useTRPC();
  const { data: user } = useQuery(trpc.session.user.queryOptions());
  const queryClient = useQueryClient();

  if (!user) throw new Error("Unathorized");

  const input = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isImageEditorOpened, setImageEditorOpened] = useState(false);
  const [name, nameError, setName, setNameError] = useControlledInput(user.name);
  const [email, emailError, setEmail, setEmailError] = useControlledInput(user.email);

  async function update() {
    setNameError(null);
    setEmailError(null);

    if (name.length < 3) return setNameError("Enter correct name");
    if (z.email().safeParse(email).error) return setNameError("Incorrect e-mail address");

    if (user?.email !== email) await updateEmail(email);
    if (user?.name !== name) await updateName(name);

    queryClient.invalidateQueries({ queryKey: trpc.session.user.queryKey() });
    onClose();
  }

  function onImageEditorClose() {
    setImageEditorOpened(false);

    const inputElement = input.current;
    if (inputElement) inputElement.value = "";
  }

  return (
    <>
      <div className="mx-auto mt-24 flex w-full max-w-400 flex-col items-center">
        <div className="relative">
          <div className="shadow-avatar size-120 overflow-clip rounded-full border-3 border-white">
            <Image className="object-cover" src={user?.image ? user.image : "/pattern.png"} alt="" width="120" height="120" />
          </div>

          <label className="absolute -bottom-10 left-1/2 grid h-28 w-44 -translate-x-1/2 cursor-pointer place-content-center rounded-full bg-black">
            <Upload />

            <input
              ref={input}
              className="pointer-events-none absolute opacity-0"
              type="file"
              accept="image/png, image/jpeg, image/webp, image/avif"
              onInput={({ currentTarget }) => {
                const files = currentTarget.files;

                if (!files) return;

                setFile(files[0]);
                setImageEditorOpened(true);
              }}
            />
          </label>
        </div>

        <Input
          value={name}
          onChange={({ currentTarget }) => setName(currentTarget.value)}
          error={nameError}
          type="name"
          className="mt-24 w-full"
          label="Full name"
          placeholder="Margaret Anderson"
          name="name"
        />

        <Input
          value={email}
          onChange={({ currentTarget }) => setEmail(currentTarget.value)}
          error={emailError}
          type="email"
          className="mt-8 w-full"
          label="Your e-mail"
          placeholder="email@example.com"
          name="email"
        />

        <div className="mt-24 flex justify-center gap-x-8">
          <button className="bg-green h-36 w-100 cursor-pointer rounded-full text-[0.875rem] text-white md:text-base" onClick={update}>
            Save
          </button>

          <button className="bg-blue h-36 w-100 cursor-pointer rounded-full text-[0.875rem] text-white md:text-base" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>

      {file && isImageEditorOpened && createPortal(<ImageEditor file={file} onClose={onImageEditorClose} />, document.body)}
    </>
  );
}

type PreviewProps = {
  edit: () => unknown;
};

function Preview({ edit }: PreviewProps) {
  const trpc = useTRPC();
  const { data: user } = useQuery(trpc.session.user.queryOptions());

  if (!user) throw new Error("Unathorized");

  const { name, email } = user;

  return (
    <div className="mt-24 flex gap-y-24 max-md:flex-col md:items-center">
      <div className="flex items-center">
        <Image className="shadow-avatar size-80 rounded-full border-3 border-white md:size-120" src={user.image ? user.image : "/pattern.png"} alt="" width="120" height="120" />

        <div className="ml-24">
          <div className="text-accent-xl font-bold">{capitalize(name)}</div>
          <div className="text-small-xl text-space-gray">{email}</div>
        </div>
      </div>

      <button className="bg-blue flex h-36 w-82 cursor-pointer items-center justify-center gap-x-4 rounded-full text-[0.75rem] font-normal text-white md:ml-auto" onClick={edit}>
        <Edit />
        Edit
      </button>
    </div>
  );
}

export default function Information() {
  const [isEditView, setEditView] = useState(false);

  return (
    <section className="mt-36 px-16">
      <div className="shadow-widget mx-auto max-w-713 rounded-3xl bg-white px-16 py-20 md:px-24">
        <h2 className="text-h3-m md:text-h3-xl">Personal information</h2>

        {isEditView ? <Editor onClose={() => setEditView(false)} /> : <Preview edit={() => setEditView(true)} />}
      </div>
    </section>
  );
}

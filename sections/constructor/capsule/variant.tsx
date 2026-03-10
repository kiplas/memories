import Image from "next/image";
import Card from "@/components/capsule";
import Tabs from "@/components/capsule-tabs";
import Controls from "@/components/capsule-stage-controls";
import ChevronRight from "@/icons/chevron-right";
import Button from "@/components/ui/button";
import { Drawer } from "vaul";
import { cn } from "@/lib/utils";
import { useCapsule, useCapsuleControls } from "@/state/capsule";
import { useMemo, useRef, useState } from "react";
import { createObjectURL } from "@/lib/media";
import { Illustration } from "@/types";
import Arrow from "@/icons/arrow";
import { useGSAP, gsap } from "@/client/gsap";
import { useClickAway } from "@/hooks/use-click-away";

type HGroupProps = {
  className?: string;
};

function HGroup({ className }: HGroupProps) {
  return (
    <hgroup className={cn("flex flex-col items-center", className)}>
      <Image src="/brush.png" alt="" width="48" height="48" />
      <h2 className="text-h3-xl">Choose Design</h2>
    </hgroup>
  );
}

type SizeProps = {
  value: string;
  checked: boolean;
  name: string;
  size: { in: string; cm: string };
  label: string;
  className?: string;
  horizontal?: boolean;
  onChange: () => void;
};

function Size({ value, checked, name, label, size, horizontal, className, onChange }: SizeProps) {
  return (
    <label
      className={cn("group relative flex aspect-165/82 h-82 cursor-pointer items-center gap-x-12 rounded-[20px] border border-current pl-12 text-[#BBBBBB]", className)}
      data-checked={checked || null}
    >
      <span className="group-data-checked:text-green absolute top-0 left-1/2 block -translate-x-1/2 -translate-y-1/2 bg-white px-8 text-[0.75rem] font-medium -tracking-tighter min-[1200px]:bg-[#F5F5F5]">
        {label}
      </span>

      <input className="pointer-events-none absolute opacity-0" type="radio" value={value} name={name} onChange={onChange} />

      <div className="size-34 rounded-full border border-current bg-white p-7">{checked && <div className="bg-green size-full rounded-full" />}</div>

      <span className="text-center text-[0.875rem] font-semibold -tracking-tighter text-black">
        {size.in} in. {!horizontal && <br />} ({size.cm} cm)
      </span>
    </label>
  );
}

const sizes = {
  s: {
    label: {
      long: "Pocket size",
      short: "Pocket",
    },
    size: { in: "4x6", cm: "10x15" },
  },
  m: {
    label: {
      long: "Classic",
      short: "Classic",
    },
    size: { in: "5x7", cm: "13x18" },
  },
  l: {
    label: {
      long: "Large",
      short: "Large",
    },
    size: { in: "8x10", cm: "20x25" },
  },
};

type ResizableProps = {
  setSize: (size: keyof typeof sizes) => unknown;
  size: keyof typeof sizes;
};

function ResizableDrawer({ setSize, size: selected }: ResizableProps) {
  const [isOpened, setIsOpened] = useState(false);

  return (
    <Drawer.Root onOpenChange={setIsOpened} open={isOpened}>
      <Drawer.Trigger className="border-gray relative flex h-64 w-full items-center justify-between rounded-lg border bg-white px-20 min-[1200px]:hidden lg:mt-0">
        {sizes[selected].label.short} ({sizes[selected].size.in} in. or ${sizes[selected].size.cm} cm) <ChevronRight />
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="fixed right-0 bottom-0 left-0 h-fit rounded-t-[44px] bg-white outline-none">
          <div className="px-32 pt-24 pb-40">
            <Drawer.Title className="text-h2-m flex w-full justify-center">Choose the Size</Drawer.Title>

            <div className="mt-32 flex flex-col gap-y-20">
              {Object.entries(sizes).map(([key, { label, size }]) => (
                <Size
                  key={key}
                  label={label.long}
                  name="size"
                  value={key}
                  onChange={() => {
                    setSize(key as keyof typeof sizes);
                    setIsOpened(false);
                  }}
                  checked={selected === (key as keyof typeof sizes)}
                  size={size}
                  horizontal
                />
              ))}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

function Resizable({ setSize, size: selected }: ResizableProps) {
  return (
    <div>
      <div className="hidden grid-cols-3 gap-16 min-[1200px]:grid">
        {Object.entries(sizes).map(([key, { label, size }]) => (
          <Size
            key={key}
            label={label.long}
            name="size"
            value={key}
            onChange={() => setSize(key as keyof typeof sizes)}
            checked={selected === (key as keyof typeof sizes)}
            size={size}
          />
        ))}
      </div>

      <ResizableDrawer setSize={setSize} size={selected} />
    </div>
  );
}

function SelectDrawer({ illustration, illustrations, onChange }: SelectProps) {
  const [isOpened, setIsOpened] = useState(false);

  const select = (illustration: Illustration) => {
    setIsOpened(false);
    onChange(illustration);
  };

  return (
    <Drawer.Root onOpenChange={setIsOpened} open={isOpened}>
      <Drawer.Trigger className="border-gray relative flex h-64 w-full items-center justify-between rounded-lg border bg-white px-20 min-[1200px]:hidden lg:mt-0">
        Design: {illustration.label} <ChevronRight />
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="fixed right-0 bottom-0 left-0 h-fit rounded-t-[44px] bg-white outline-none">
          <div className="flex max-h-[70svh] flex-col px-32 pt-24">
            <Drawer.Title className="text-h2-m flex w-full justify-center">Choose the Size</Drawer.Title>

            <div className="scrollbar-none mt-32 flex flex-col gap-y-20 overflow-auto pb-40">
              {illustrations.map((i) => (
                <button key={i.id} className="flex cursor-pointer items-center py-8 hover:bg-[#F5F5F5]" onClick={() => select(i)}>
                  <Image className="width-82 height-60 shrink-0 rounded-lg" src={i.upload.url} alt="" width="96" height="68" />
                  <span className="ml-12">{i.label}</span>
                  <div className="group rder-gray ml-auto size-34 rounded-full border p-7" data-active={illustration.id === i.id || null}>
                    <div className="group-data-active:bg-green ease-gentle size-full rounded-full duration-200" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}

function SelectOptions({ illustration, illustrations, onChange }: SelectProps) {
  const [collapsed, setCollapsed] = useState(true);
  const container = useClickAway<HTMLDivElement>(() => setCollapsed(true));

  useGSAP(
    () => {
      const timeline = gsap.timeline({ defaults: { duration: 0.125 } });
      if (collapsed) {
        timeline.to(".list", { height: 0 });
        timeline.to(".illustration-name", { yPercent: 0 }, "<");
        timeline.to(".select-placeholder", { yPercent: 0 }, "<");
        timeline.to(".select-arrow", { scaleX: 1 }, "<");
      } else {
        timeline.to(".list", { height: "auto" });
        timeline.to(".illustration-name", { yPercent: -100 }, "<");
        timeline.to(".select-placeholder", { yPercent: -110 }, "<");
        timeline.to(".select-arrow", { scaleX: -1 }, "<");
      }
    },
    {
      scope: container,
      dependencies: [collapsed],
    },
  );

  const select = (illustration: Illustration) => {
    setCollapsed(true);
    onChange(illustration);
  };

  return (
    <div ref={container} className="relative z-1 h-85 w-full max-[1200px]:hidden">
      <div className="border-gray absolute top-1/2 left-0 flex max-h-489 w-full -translate-y-1/2 flex-col overflow-clip rounded-[43px] border bg-white">
        <button className="flex h-85 w-full shrink-0 cursor-pointer items-center justify-between rounded-full px-32" onClick={() => setCollapsed(!collapsed)}>
          <div className="h-[1em] overflow-clip text-left">
            <div className="illustration-name">Design: {illustration.label}</div>
            <div className="select-placeholder">Choose Design</div>
          </div>
          <Arrow className="select-arrow rotate-90" />
        </button>

        <div className="list scrollbar-none flex h-0 flex-col overflow-auto">
          {illustrations.map((i) => (
            <button key={i.id} className="flex cursor-pointer items-center px-32 py-8 hover:bg-[#F5F5F5]" onClick={() => select(i)}>
              <Image className="width-82 height-60 shrink-0 rounded-lg" src={i.upload.url} alt="" width="96" height="68" />
              <span className="ml-12">{i.label}</span>
              <div className="group rder-gray ml-auto size-34 rounded-full border p-7" data-active={illustration.id === i.id || null}>
                <div className="group-data-active:bg-green ease-gentle size-full rounded-full duration-200" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

type SelectProps = {
  illustration: Illustration;
  illustrations: Illustration[];
  onChange: (illustration: Illustration) => unknown;
};

function Select(props: SelectProps) {
  return (
    <>
      <SelectOptions {...props} />
      <SelectDrawer {...props} />
    </>
  );
}

type Props = {
  resizable?: boolean;
};

export default function Variant({ resizable }: Props) {
  const { uploads, illustration, message, illustrations, size } = useCapsule();
  const { setSize, setIllustration } = useCapsuleControls();

  const images = useMemo(() => uploads.filter((upload) => !!upload).map((upload) => (upload instanceof File ? createObjectURL(upload) : upload.url)), [uploads]);

  return (
    <section className="pb-40">
      <Tabs />

      <div className="mt-32 px-32 lg:mt-40">
        <HGroup className="mb-16 lg:hidden" />

        <div className="mx-auto flex max-w-1192 flex-col gap-32 rounded-[44px] md:bg-[#F5F5F5] md:p-32 lg:h-453 lg:flex-row lg:gap-50">
          <div className="aspect-550/389 w-full shrink-0 overflow-clip rounded-2xl bg-black/5 lg:w-550">
            <Card images={images} illustration={illustration} message={message} />
          </div>

          <div className="flex w-full flex-col justify-between">
            <HGroup className="hidden lg:flex" />

            <div className="flex flex-col gap-y-8 min-[1200px]:contents">
              <Select illustration={illustration} illustrations={illustrations} onChange={setIllustration} />

              {resizable ? (
                <Resizable setSize={setSize} size={size} />
              ) : (
                <span className="text-accent-xl hidden pb-16 text-center lg:inline">Choose the look that captures your feeling.</span>
              )}
            </div>
          </div>
        </div>

        <Controls className="mt-24" />
      </div>
    </section>
  );
}

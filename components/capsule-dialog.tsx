"use client";

import Link from "next/link";
import { useDialog, useDialogControls } from "@/state/dialog";
import { createPortal } from "react-dom";
import { useClickAway } from "@/hooks/use-click-away";

function View() {
  const { close } = useDialogControls();
  const ref = useClickAway<HTMLDivElement>(() => close({ name: "capsule-popup" }));

  return (
    <div className="justify-center fixed inset-0 z-100 px-32 flex items-center bg-black/70">
      <div ref={ref} className="text-h3-m md:text-h3-xl flex w-full max-w-450 flex-col gap-y-12 rounded-4xl bg-white p-24">
        <Link
          href="/create/printed/capsule"
          className=" grid h-70 md:h-112 w-full cursor-pointer place-content-center rounded-[20px] border border-[#d9d9d9] outline-0 duration-400 ease-out hover:bg-[#F5F5F5]"
          onClick={() => close({ name: "capsule-popup" })}
        >
          Printed Capsule
        </Link>
        <Link
          href="/create/digital/capsule"
          className=" grid h-70 md:h-112 w-full cursor-pointer place-content-center rounded-[20px] border border-[#d9d9d9] outline-0 duration-400 ease-out hover:bg-[#F5F5F5]"
          onClick={() => close({ name: "capsule-popup" })}
        >
          Digital Capsule
        </Link>
      </div>
    </div>
  );
}

export default function Dialog() {
  const { list } = useDialog();

  return list.find(({ name }) => name === "capsule-popup") && createPortal(<View />, document.documentElement);
}

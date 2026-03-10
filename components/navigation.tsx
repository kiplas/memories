"use client";

import Link from "next/link";
import TextSlide from "./ui/TextSlide";
import FullLogo from "@/icons/full-logo";
import { cn } from "@/lib/utils";
import { useClickAway } from "@/hooks/use-click-away";
import { useNavigation, useNavigationControls } from "@/state/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

const navigation = {
  product: [
    { label: "How It Works", href: "/#workflow" },
    { label: "Pricing", href: "/#pricing" },
  ],
  experiences: [
    { label: "Digital Capsule", href: "/create/digital/capsule" },
    { label: "Printed Capsule", href: "/create/printed/capsule" },
    { label: "Letter to the Future", href: "/create/digital/letter" },
    { label: "Corporate", href: "/corporate" },
  ],
};

type UnderlayDisplayProps = {
  isVisible: boolean;
};

function UnderlayDisplay({ isVisible }: UnderlayDisplayProps) {
  return (
    <div
      className="z-navigation-underlay pointer-events-none fixed inset-0 size-full bg-black/70 opacity-0 duration-200 ease-in-out data-visible:pointer-events-auto data-visible:opacity-100"
      data-visible={isVisible || null}
    />
  );
}

function Underlay() {
  const { isVisible } = useNavigation();
  const [mounted, setMounted] = useState(false);

  // eslint-disable-next-line
  useEffect(() => setMounted(true), []);

  return mounted ? createPortal(<UnderlayDisplay isVisible={isVisible} />, document.body) : null;
}

export default function Navigation() {
  const { isVisible } = useNavigation();
  const { setIsVisible } = useNavigationControls();
  const ref = useClickAway<HTMLDivElement>((event) => {
    const target = event.target as HTMLElement;
    if (target.closest("[data-navigation-clickaway-ignore]") !== null) return;
    setIsVisible(false);
  });

  return (
    <nav className={cn("z-navigation fixed top-0 right-0 left-0 overflow-clip bg-white px-32 duration-200 ease-out", isVisible ? "h-458" : "h-0")} ref={ref}>
      <Underlay />

      <div className="relative mx-auto grid min-h-458 w-full max-w-1191 grid-cols-2 py-84 lg:flex lg:gap-x-101">
        <section className="w-222">
          <h2 className="text-h3-m lg:text-h3-xl">Product</h2>
          <nav className="text-accent-m lg:text-accent mt-24 flex flex-col gap-y-9 lg:gap-y-6">
            {navigation.product.map(({ label, href }) => (
              <Link key={href} href={href} onClick={() => setIsVisible(false)}>
                <TextSlide>{label}</TextSlide>
              </Link>
            ))}
          </nav>
        </section>

        <section className="w-222">
          <h2 className="text-h3-m lg:text-h3-xl">Experiences</h2>
          <nav className="text-accent-m lg:text-accent mt-24 flex flex-col gap-y-9 lg:gap-y-6">
            {navigation.experiences.map(({ label, href }) => (
              <Link key={href} href={href} onClick={() => setIsVisible(false)}>
                <TextSlide>{label}</TextSlide>
              </Link>
            ))}
          </nav>
        </section>

        <FullLogo className="absolute bottom-0 left-1/2 aspect-1190/251 h-auto w-full max-w-1191 -translate-x-1/2 translate-y-66/251 text-black opacity-10" />
      </div>
    </nav>
  );
}

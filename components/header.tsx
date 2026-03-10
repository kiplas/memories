"use client";

import Image from "next/image";
import Link from "next/link";
import SigninIcon from "@/icons/signin";
import HeaderLogo from "@/icons/header-logo";
import TextSlide from "./ui/TextSlide";
import Globe from "@/icons/globe";
import { useEffect, useRef } from "react";
import { signout } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { useAuthControls } from "@/state/auth";
import { cn } from "@/lib/utils";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/state/trpc";
import { Maybe } from "@/types";
import { useNavigation, useNavigationControls } from "@/state/navigation";
import { useTheme, useThemeControls } from "@/state/theme";

type SigninProps = {
  className?: string;
};

function Signin({ className }: SigninProps) {
  const { setAction } = useAuthControls();

  return (
    <button className={cn("shadow-avatar 2md:size-62 grid size-48 cursor-pointer place-content-center rounded-full bg-white", className)} onClick={() => setAction("signin")}>
      <SigninIcon className="size-30 md:size-32" />
    </button>
  );
}

type AvatarProps = {
  className?: string;
  image?: Maybe<string>;
};

function Avatar({ image, className }: AvatarProps) {
  return (
    <Link href="/account" className={cn("shadow-widget 2md:size-62 size-48 cursor-pointer rounded-full", className)}>
      <Image className="rounded-full border-3 border-white" src={image ? image : "/pattern.png"} alt="" width="62" height="62" />
    </Link>
  );
}

function UserAction() {
  const trpc = useTRPC();
  const { data: user } = useQuery(trpc.session.user.queryOptions());

  return user ? <Avatar image={user.image} /> : <Signin />;
}

export function CompressedHeader() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return (
    <div className="fixed top-0 left-0 z-10 flex w-full items-center px-40 pt-18">
      <Link className="max-md:hidden" href="/">
        <HeaderLogo />
      </Link>

      <div className="ml-auto flex items-center gap-x-24">
        <Link className="text-accent-m md:text-accent-xl cursor-pointer" href="/settings">
          Settings
        </Link>

        <button
          className="text-accent-m md:text-accent-xl cursor-pointer"
          onClick={() =>
            signout().then(() => {
              queryClient.removeQueries({
                queryKey: ["session"],
                exact: false,
              });

              router.push("/");
            })
          }
        >
          Log out
        </button>

        <Avatar className="size-48 md:size-62" />
      </div>
    </div>
  );
}

type LogoProps = {
  className?: string;
  isStatic?: boolean;
  isLight?: boolean;
};

function Logo({ className, isStatic, isLight }: LogoProps) {
  const logo = useRef<HTMLAnchorElement>(null);
  const { opened } = useTheme();

  useEffect(() => {
    if (logo.current?.dataset.static) return;

    function onScroll() {
      if (document.scrollingElement!.scrollTop > 5) logo.current?.classList.add("invisible");
      else logo.current?.classList.remove("invisible");
    }

    document.addEventListener("scroll", onScroll);

    return () => document.removeEventListener("scroll", onScroll);
  });

  return (
    <Link className={cn("data-light:text-white", className)} href="/" ref={logo} data-light={isLight || null} data-static={isStatic || null}>
      <HeaderLogo className="aspect-132/28 h-auto w-112 text-current contain-layout data-active:[view-transition-name:logo] md:w-132" data-active={!opened || null} />
    </Link>
  );
}

function DesktopNavigationToggle() {
  const { isVisible } = useNavigation();
  const { setIsVisible } = useNavigationControls();

  return (
    <button
      className="group/slide max-2md:hidden text-accent-xl h-62 w-170 cursor-pointer rounded-full bg-black text-white"
      data-navigation-clickaway-ignore
      onClick={() => setIsVisible(!isVisible)}
    >
      <div className="grid place-content-center overflow-clip [grid-area:'.']">
        <TextSlide className={cn("[grid-area:1/1/2/2]", isVisible && "-translate-y-full")}>Menu</TextSlide>
        <TextSlide className={cn("[grid-area:1/1/2/2]", !isVisible && "translate-y-full")}>Close</TextSlide>
      </div>
    </button>
  );
}

function MobileNavigationToggle() {
  const { isVisible } = useNavigation();
  const { setIsVisible } = useNavigationControls();

  return (
    <button
      className="group 2md:hidden n z-10 grid size-48 place-content-center rounded-full bg-black"
      data-navigation-clickaway-ignore
      data-open={isVisible || null}
      onClick={() => setIsVisible(!isVisible)}
    >
      <div className="ease-gentle grid size-24 place-content-center gap-1 duration-800 group-data-open:rotate-135">
        <div className="h-1 w-16 bg-white"></div>
        <div className="ease-gentle h-1 w-16 bg-white duration-800 group-data-open:-translate-y-1.5 group-data-open:rotate-90"></div>
      </div>
    </button>
  );
}

function NavigationToggle() {
  return (
    <>
      <MobileNavigationToggle />
      <DesktopNavigationToggle />
    </>
  );
}

function MobileThemeToggle() {
  const { open } = useThemeControls();

  return (
    <button className="shadow-avatar 2md:hidden grid size-48 place-content-center rounded-full bg-white" onClick={open}>
      <Globe />
    </button>
  );
}

function DesktopThemeToggle() {
  const { open } = useThemeControls();

  return (
    <button className="text-orange max-2md:hidden text-accent-xl shadow-avatar h-62 cursor-pointer rounded-full bg-white px-32 font-semibold" onClick={open}>
      Country List
    </button>
  );
}

function ThemeToggle({ className }: { className?: string }) {
  return (
    <div className={className}>
      <MobileThemeToggle />
      <DesktopThemeToggle />
    </div>
  );
}

type ExtendedHeaderProps = {
  static?: boolean;
  light?: boolean;
  "contents-absolute"?: boolean;
};

export function ExtendedHeader({ static: isStatic, light: isLight, "contents-absolute": isContentsAbsolute }: ExtendedHeaderProps) {
  return (
    <div
      className="group contents h-98 w-full data-contents-absolute:contents data-static:block"
      data-static={isStatic || null}
      data-absolute={isStatic || isContentsAbsolute || null}
    >
      <ThemeToggle className="z-header-lower fixed top-18 left-32 group-data-absolute:absolute md:left-40" />

      <Logo
        className="2md:w-132 z-header-lower fixed top-32 left-1/2 hidden w-112 -translate-x-1/2 group-data-absolute:absolute min-[480px]:block"
        isLight={isLight}
        isStatic={isStatic || isContentsAbsolute}
      />

      <div className="z-header-upper fixed top-18 right-32 flex gap-x-12 group-data-absolute:absolute md:right-40">
        <NavigationToggle />
        <UserAction />
      </div>
    </div>
  );
}

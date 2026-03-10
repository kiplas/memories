import { PropsWithChildren, ReactNode } from "react";
import TextSlide from "./TextSlide";
import { ClassValue } from "clsx";
import { cn } from "@/lib/utils";
import { type ButtonHTMLAttributes } from "react";
import NextLink from "next/link";

type Props = {
  className?: ClassValue;
  icon?: ReactNode;
  href: string;
} & ButtonHTMLAttributes<HTMLAnchorElement>;

export default function Link({ children, className, icon, href, ...rest }: PropsWithChildren<Props>) {
  return (
    <NextLink
      href={href}
      className={cn("group/slide text-accent-xl flex h-62 cursor-pointer items-center justify-center gap-10 rounded-full border border-current px-24 py-10", className)}
      {...rest}
    >
      <TextSlide className="w-full text-center">{children}</TextSlide>
      {icon}
    </NextLink>
  );
}

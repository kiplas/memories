import { type MouseEvent, useState, use } from "react";
import { ClassValue } from "clsx";
import { PropsWithChildren } from "react";
import { createContext } from "react";
import { cn } from "@/lib/utils";

type RootContext = {
  selected: string | undefined;
};

type RootControlContext = {
  select: (value: string) => void;
};

const RootContext = createContext<RootContext>({
  selected: undefined,
});

const RootControlContext = createContext<RootControlContext>({
  select: () => false,
});

type RootProps = {
  selected: string;
  select: (value: string) => unknown;
  className?: ClassValue;
};

function Root({ children, className, selected, select }: PropsWithChildren<RootProps>) {
  const context = {
    selected,
  };

  const controls = {
    select,
  };

  return (
    <RootContext value={context}>
      <RootControlContext value={controls}>
        <div className={cn("flex w-full flex-col gap-y-16", className)}>{children}</div>
      </RootControlContext>
    </RootContext>
  );
}

type ItemContext = {
  value: string;
};

const ItemContext = createContext<ItemContext>({
  value: "",
});

type ItemProps = { className?: ClassValue; value: string };

export function Item({ className, children, value }: PropsWithChildren<ItemProps>) {
  const context = { value };
  const { selected } = use(RootContext);

  const data = {
    "data-closed": selected !== value || null,
    "data-opened": selected === value || null,
  };

  return (
    <ItemContext value={context}>
      <div className={cn("group", className)} {...data}>
        {children}
      </div>
    </ItemContext>
  );
}

type HeaderProps = { className?: ClassValue };

export function Header({ className, children }: PropsWithChildren<HeaderProps>) {
  const { value } = use(ItemContext);
  const { select } = use(RootControlContext);

  function onClick(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    select(value);
  }

  return (
    <button className={cn("border-green flex h-48 w-full cursor-pointer items-center gap-x-20 rounded-2xl border px-12", className)} onClick={onClick}>
      <div className="size-28 rounded-full border border-black p-7">
        <div className="bg-green size-full rounded-full group-data-closed:invisible"></div>
      </div>

      {children}
    </button>
  );
}

type PanelProps = {
  className?: ClassValue;
};

export function Panel({ className, children }: PropsWithChildren<PanelProps>) {
  const { value } = use(ItemContext);
  const { selected } = use(RootContext);

  const collapsed = value !== selected;

  return (
    <div className={cn("overflow-clip", collapsed ? "h-0" : "h-auto", className)}>
      <div className="pt-16">{children}</div>
    </div>
  );
}

const Options = {
  Root,
  Item,
  Header,
  Panel,
};

export default Options;

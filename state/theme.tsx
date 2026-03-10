"use client";

import type { Maybe } from "@/types";
import { createContext, PropsWithChildren, use, useState } from "react";
import { setCookie } from "@/lib/cookies";
import { flushSync } from "react-dom";

type ThemeContext = {
  theme: string | null;
  opened: boolean;
};

const ThemeContext = createContext<ThemeContext | null>(null);

type ThemeControlContext = {
  setTheme: (name: string) => unknown;
  open: () => unknown;
};

const ThemeControlContext = createContext<ThemeControlContext | null>(null);

export type Props = {
  theme: Maybe<string>;
};

export function Provider({ children, theme: initialTheme }: PropsWithChildren<Props>) {
  const [theme, setTheme] = useState<string | null>(initialTheme || null);
  const [opened, setOpened] = useState(theme === null);

  const context = {
    theme,
    opened,
  };

  function updateTheme(theme: string) {
    document.startViewTransition(() => {
      flushSync(() => {
        setCookie("theme", theme);
        setTheme(theme);
        setOpened(false);
        document.documentElement.style.setProperty("overflow", "auto");
      });
    });
  }

  function open() {
    document.startViewTransition(() => {
      flushSync(() => {
        setOpened(true);
        document.documentElement.style.setProperty("overflow", "hidden");
      });
    });
  }

  const controls = {
    setTheme: updateTheme,
    open,
  };

  return (
    <ThemeContext value={context}>
      <ThemeControlContext value={controls}>{children}</ThemeControlContext>
    </ThemeContext>
  );
}

export function useTheme() {
  const context = use(ThemeContext);

  if (!context) throw new Error("Unable to access theme context outside of theme provider");

  return context;
}

export function useThemeControls() {
  const context = use(ThemeControlContext);

  if (!context) throw new Error("Unable to access theme control context outside of theme provider");

  return context;
}

"use client";

import { type Dispatch, type SetStateAction, createContext, PropsWithChildren, use, useLayoutEffect, useState } from "react";

type NavigationContext = {
  isVisible: boolean;
};

const NavigationContext = createContext<NavigationContext | null>(null);

type NavigationControlContext = {
  setIsVisible: Dispatch<SetStateAction<boolean>>;
};

const NavigationControlContext = createContext<NavigationControlContext | null>(null);

export function Provider({ children }: PropsWithChildren) {
  const [isVisible, setIsVisible] = useState(false);

  const context = {
    isVisible,
  };

  useLayoutEffect(() => {
    if (isVisible) {
      document.documentElement.style.setProperty("overflow", "hidden");
      if (document.documentElement.scrollHeight > document.documentElement.clientHeight) document.documentElement.style.setProperty("scrollbar-gutter", "stable");
    } else {
      document.documentElement.style.setProperty("overflow", "auto");
      document.documentElement.style.setProperty("scrollbar-gutter", "initial");
    }
  }, [isVisible]);

  const controls = {
    setIsVisible,
  };

  return (
    <NavigationContext value={context}>
      <NavigationControlContext value={controls}>{children}</NavigationControlContext>
    </NavigationContext>
  );
}

export function useNavigation() {
  const context = use(NavigationContext);

  if (!context) throw new Error("Unable to use navigation context outside of navigation context provider");

  return context;
}

export function useNavigationControls() {
  const context = use(NavigationControlContext);

  if (!context) throw new Error("Unable to use navigation control context outside of navigation context provider");

  return context;
}

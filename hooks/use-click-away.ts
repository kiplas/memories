import { useRef, useEffect, useEffectEvent, RefObject } from "react";

export function useClickAway<T extends Element>(cb: (event: MouseEvent | TouchEvent) => unknown): RefObject<T | null> {
  const ref = useRef<T>(null);
  const callback = useEffectEvent(cb);

  useEffect(() => {
    function handler(e: MouseEvent | TouchEvent) {
      const element = ref.current;
      const target = e.target as Element;

      if (element && !element.contains(target)) callback(e);
    }

    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler);

    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, []);

  return ref;
}

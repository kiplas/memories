import type { Maybe } from "@/types";
import { useState } from "react";

export function useControlledInput<T, E = string>(v: T, e?: E) {
  const [value, setValue] = useState<T>(v);
  const [error, setError] = useState<Maybe<E>>(e);

  return [value, error, setValue, setError] as const;
}

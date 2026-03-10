import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

function createQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
      },
    },
  });
}

let cachedQueryClient: QueryClient | undefined = undefined;

export function getQueryClient() {
  if (typeof window === "undefined") return cache(createQueryClient)();
  else return !!cachedQueryClient ? cachedQueryClient : (cachedQueryClient = createQueryClient());
}

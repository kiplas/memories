"use client";

import { type PropsWithChildren, useState } from "react";
import type { Router } from "@/server/trpc";
import { QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { Provider as AuthProvider } from "@/state/auth";
import { Provider as DialogProvider } from "@/state/dialog";
import { Provider as NavigationProvider } from "@/state/navigation";
import { type Props as ThemeProps, Provider as ThemeProvider } from "./theme";
import { TRPCProvider } from "@/state/trpc";
import { getQueryClient } from "@/lib/query";
import superjson from "superjson";

type Props = {
  theme: ThemeProps;
};

export default function Shell({ children, theme }: PropsWithChildren<Props>) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    createTRPCClient<Router>({
      links: [
        httpBatchLink({
          transformer: superjson,
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/trpc`,
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        <ThemeProvider {...theme}>
          <NavigationProvider>
            <AuthProvider>
              <DialogProvider>{children}</DialogProvider>
            </AuthProvider>
          </NavigationProvider>
        </ThemeProvider>
      </TRPCProvider>
    </QueryClientProvider>
  );
}

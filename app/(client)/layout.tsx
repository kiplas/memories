export const dynamic = "force-dynamic";

import Shell from "@/state/shell";
import CapsuleDialog from "@/components/capsule-dialog";
import DemoDialog from "@/components/demo-dialog";
import ThemeSelector from "@/components/theme-selector";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { getQueryClient } from "@/lib/query";
import { trpc } from "@/server/trpc";
import "./globals.css";
import { cookies } from "next/headers";

const inter = Inter({});

export const metadata: Metadata = {
  title: "Memories",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const c = await cookies();
  const queryClient = getQueryClient();

  await queryClient.prefetchQuery(trpc.session.user.queryOptions());

  const context = {
    theme: {
      theme: c.get("theme")?.value,
    },
  };

  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.png" sizes="any" />
      </head>

      <body className={`${inter.className} font-inter text-regular-m md:text-regular-xl antialiased`}>
        <Shell {...context}>
          <HydrationBoundary state={dehydrate(queryClient)}>
            <CapsuleDialog />
            <DemoDialog />
            <ThemeSelector />
            {children}
          </HydrationBoundary>
        </Shell>
      </body>
    </html>
  );
}

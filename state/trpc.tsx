"use client";

import { createTRPCContext } from "@trpc/tanstack-react-query";
import type { Router } from "@/server/trpc";

export const { TRPCProvider, useTRPC, useTRPCClient } = createTRPCContext<Router>();

"use client";

import Button from "@/components/ui/button";
import { signout } from "@/actions/auth";
import { redirect } from "next/navigation";
import { useTRPC } from "@/state/trpc";
import { useQueryClient } from "@tanstack/react-query";

export default function SignoutButton() {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  async function onSignout() {
    await signout();
    queryClient.removeQueries({ queryKey: trpc.session.user.queryKey() });
    redirect("/");
  }

  return (
    <Button className="bg-orange mx-auto mt-16 w-400 border-none text-white" onClick={onSignout}>
      Log Out
    </Button>
  );
}

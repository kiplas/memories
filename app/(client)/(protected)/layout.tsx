import { redirect } from "next/navigation";
import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { type PropsWithChildren } from "react";

export default async function ProtectedLayout({ children }: PropsWithChildren) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) return redirect("/");

  return children;
}

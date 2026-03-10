import Authentication from "@/components/authentication";
import Navigation from "@/components/navigation";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Navigation />
      <Authentication />
      {children}
    </>
  );
}

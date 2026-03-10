"use client";

import Demo from "@/sections/corporate/demo";
import Deck from "@/sections/corporate/deck";
import WorkFlow from "@/sections/corporate/workflow";
import CorporateSpecific from "@/sections/corporate/corporate-specific";
import Value from "@/sections/corporate/value";
import Perks from "@/sections/corporate/perks";
import Reviews from "@/sections/corporate/reviews";
import DemoBottom from "@/sections/corporate/demo-bottom";
import Outro from "@/sections/outro";
import { ExtendedHeader } from "@/components/header";

export default function Corpotate() {
  return (
    <>
      <ExtendedHeader light />
      <Demo />
      <Deck />
      <WorkFlow />
      <CorporateSpecific />
      <Value />
      <Perks />
      <Reviews />
      <DemoBottom />
      <Outro />
    </>
  );
}

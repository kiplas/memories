"use client";

import Tabs from "@/components/letter-tabs";
import At from "@/icons/at";
import Form from "@/components/digital-recipients-form";
import { type useCapsule, type useCapsuleControls } from "@/state/capsule";
import { type useLetter, type useLetterControls } from "@/state/letter";
import { digitalAddressee as $digitalAddressee } from "@/schema/addressee";
import z from "zod";

type Props = {
  useConstructor: typeof useCapsule | typeof useLetter;
  useConstructorControls: typeof useCapsuleControls | typeof useLetterControls;
};

export default function Recipients({ useConstructor, useConstructorControls }: Props) {
  const { addressees } = useConstructor();
  const { setAddressees, setPreviousStage, setNextStage } = useConstructorControls();

  function onSubmit(email: string) {
    setAddressees([...addressees, { digital: { email } }]);
  }

  function onRemove(email: string) {
    setAddressees(addressees.filter(({ digital }) => digital?.email !== email));
  }

  const parsedAddressees = z.array($digitalAddressee).safeParse(addressees);

  if (parsedAddressees.error) throw new Error("Unexpected");

  return (
    <section className="relative pt-98 flex min-h-svh flex-col items-center overflow-clip bg-[#F5F5F5] pb-40">
      <Tabs />

      <div className="pointer-events-none absolute top-98 left-1/2 h-full max-h-700 w-1512 -translate-x-1/2">
        <At className="absolute top-94 right-40 size-302 text-[#eeeeee]" />
        <At className="absolute bottom-90 left-40 size-159 text-[#eeeeee]" />
      </div>

      <Form onSubmit={onSubmit} onRemove={onRemove} addressees={parsedAddressees.data} onMoveToNextStage={setNextStage} onMoveToPreviousStage={setPreviousStage} />
    </section>
  );
}

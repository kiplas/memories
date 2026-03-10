import Tabs from "@/components/capsule-tabs";
import Input from "@/components/recepient-input";
import Plus from "@/icons/plus";
import Tag from "@/components/ui/tag";
import Button from "@/components/ui/button";
import Plane from "@/icons/paper-plane";
import Image from "next/image";
import Delete from "@/icons/delete";
import type { Addressee } from "@/types";
import { useState, type MouseEvent } from "react";
import { useCapsule, useCapsuleControls } from "@/state/capsule";
import { physicalAddress as $physicalAddress } from "@/schema/addressee";
import { flattenError } from "zod";

export default function Recipients() {
  const { addressees } = useCapsule();
  const { setAddressees, setNextStage, setPreviousStage } = useCapsuleControls();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [ZIP, setZIP] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [errors, setErrors] = useState<Record<string, string[] | undefined>>({});

  function clear() {
    setErrors({});

    setName("");
    setAddress("");
    setCity("");
    setCountry("");
    setState("");
    setZIP("");
  }

  function action() {
    setErrors({});

    const parsed = $physicalAddress.safeParse({ name, address, city, country, state, zip: ZIP });

    if (!parsed.success) return setErrors(flattenError(parsed.error).fieldErrors);

    setAddressees([...addressees, { physical: parsed.data }]);
    clear();
  }

  function onRemove(addressee: Addressee) {
    setAddressees(addressees.filter((a) => a !== addressee));
  }

  function next(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    setNextStage();
  }

  const canClear = (name + city + state + ZIP + state + country + address).length > 0;
  const canMoveToNextStage = addressees.length > 0;
  const canAddPayee = $physicalAddress.safeParse({ name, address, zip: ZIP, state, country, city }).success;

  return (
    <section className="bg-constructor-gray relative min-h-[calc(100svh-98px)] overflow-clip pb-40">
      <Tabs />

      <div className="pointer-events-none absolute top-0 left-1/2 h-929 w-1512 -translate-x-1/2">
        <Plane className="absolute top-40 right-40 size-400 text-[#eeeeee]" />
        <Plane className="absolute bottom-100 left-40 size-200 text-[#eeeeee]" />
      </div>

      <hgroup className="mt-24 flex flex-col items-center px-32 text-center">
        <Image src="/envelope.png" alt="" width="48" height="48" />
        <h2 className="text-h3-xl mb-10">Recipient Info </h2>
        <div className="text-space-gray max-w-706">Enter recipient details. You can also add more recipients — each extra card adds to the total.</div>
      </hgroup>

      <form className="mx-auto mt-24 w-full md:max-w-704" action={action}>
        <div className="relative rounded-[44px] bg-white p-20">
          <button className="absolute top-20 right-20 cursor-pointer disabled:hidden" disabled={!canClear} onClick={(e) => (e.preventDefault(), clear())}>
            <Delete className="text-orange size-24" />
          </button>

          <div className="text-h3-xl mb-16 px-8">Recipient {addressees.length + 1}</div>

          <div className="flex flex-col gap-y-12">
            <Input value={name} error={errors.name?.at(0)} onInput={(value) => setName(value)} name="name" placeholder="Full Name:" type="" />
            <Input value={address} error={errors.address?.at(0)} onInput={(value) => setAddress(value)} name="address" placeholder="Address Line (for Delivery):" type="" />
          </div>

          <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-12">
            <Input value={ZIP} error={errors.ZIP?.at(0)} onInput={(value) => setZIP(value)} name="zip" placeholder="ZIP / Postal Code:" type="" />
            <Input value={country} error={errors.country?.at(0)} onInput={(value) => setCountry(value)} name="country" placeholder="Country:" type="" />
            <Input value={city} error={errors.city?.at(0)} onInput={(value) => setCity(value)} name="city" placeholder="City:" type="" />
            <Input value={state} error={errors.state?.at(0)} onInput={(value) => setState(value)} name="state" placeholder="State:" type="" />
          </div>
        </div>

        <div className="mt-24 grid gap-x-12 gap-y-12 md:grid-cols-3">
          <Button onClick={setPreviousStage}>Back to Message</Button>

          <Button className="bg-black text-white disabled:pointer-events-none disabled:opacity-40" direction="rtl" icon={<Plus />} disabled={!canAddPayee}>
            Add another
          </Button>

          <Button className="bg-green text-white disabled:pointer-events-none disabled:opacity-40" disabled={!canMoveToNextStage} onClick={next}>
            Next
          </Button>
        </div>
      </form>
    </section>
  );
}

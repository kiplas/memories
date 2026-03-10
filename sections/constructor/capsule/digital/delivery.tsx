import Image from "next/image";
import Card from "@/components/capsule";
import Tabs from "@/components/capsule-tabs";
import Radio from "@/components/delivery-radio-button";
import Clock from "@/icons/clock";
import Calendar from "@/icons/calendar";
import Controls from "@/components/capsule-stage-controls";
import DatePicker from "@/components/date-picker";
import { useCapsule, useCapsuleControls } from "@/state/capsule";
import { createObjectURL } from "@/lib/media";
import { formatDate } from "@/lib/date";
import { useMemo, useState } from "react";

function DateSection() {
  const { delivery } = useCapsule();
  const { setDelivery } = useCapsuleControls();

  return (
    <div className="mt-12 flex flex-col items-center gap-y-24 rounded-[44px] bg-white px-16 py-32 md:px-90">
      <span className="bg-blue text-accent-m flex h-27 items-center rounded-full px-12 text-white">{formatDate(delivery)}</span>

      <DatePicker delivery={delivery} setDelivery={setDelivery} />

      <span className="text-small-xl">Select a date for your message to be sent.</span>
    </div>
  );
}

export default function Delivery() {
  const { illustration, uploads, message } = useCapsule();
  const { setDelivery } = useCapsuleControls();
  const [shipping, setShipping] = useState<"delayed" | "instant">("instant");

  const images = useMemo(() => uploads.filter((upload) => !!upload).map((upload) => (upload instanceof File ? createObjectURL(upload) : upload.url)), [uploads]);

  function onInstantShipping() {
    setDelivery(new Date());
    setShipping("instant");
  }

  return (
    <section className="bg-constructor-gray relative flex min-h-[calc(100svh-98px)] flex-col items-center overflow-clip pb-40">
      <Tabs />

      <div className="pointer-events-none absolute top-0 left-1/2 h-1125 w-1512 -translate-x-1/2">
        <Calendar className="absolute bottom-90 left-40 size-350 text-[#eeeeee]" />
        <Clock className="absolute top-94 right-40 size-176 text-[#EEEEEE]" />
      </div>

      <hgroup className="text-centermt-40 mt-24 max-w-704 px-16 text-center">
        <Image className="mx-auto" src="/envelope.png" alt="" width="48" height="48" />
        <h2 className="text-h3-xl">Delivery Date</h2>
        <div className="text-space-gray mt-10">Order now for delivery within 3–5 days — or choose a future date for special occasions like birthdays or anniversaries.</div>
      </hgroup>

      <form className="w-full max-w-738 px-16">
        <div className="relative mt-108 flex h-334 flex-col justify-end gap-12 rounded-[44px] bg-white px-16 pb-32 md:mt-226 md:grid md:h-281 md:grid-cols-2 md:items-end md:px-90">
          <div className="absolute top-20 left-1/2 -translate-x-1/2 -translate-y-1/2 md:-top-10">
            <Card className="shadow-delivery-card h-auto w-227 -rotate-7 md:w-300" illustration={illustration} images={images} message={message} />
            <Image className="absolute top-120 -right-106 -translate-y-full md:top-85 md:-right-148" src="/postmark.png" alt="" width="184" height="120" />
          </div>

          <Radio
            className="max-md:h-65"
            name="shipping"
            checked={shipping === "instant"}
            title="Send now"
            subtitle="Delivered instantly"
            value="instant"
            onChange={onInstantShipping}
          />

          <Radio
            className="max-md:h-65"
            name="shipping"
            checked={shipping === "delayed"}
            title="Schedule send"
            subtitle="Choose any future date"
            value="delayed"
            onChange={() => setShipping("delayed")}
          />
        </div>

        {shipping !== "instant" && <DateSection />}

        <Controls className="mt-24" />
      </form>
    </section>
  );
}

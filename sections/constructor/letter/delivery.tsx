import Image from "next/image";
import Tabs from "@/components/letter-tabs";
import Controls from "@/components/letter-stage-controls";
import Letter from "@/components/letter";
import Radio from "@/components/delivery-radio-button";
import DatePicker from "@/components/date-picker";
import Calendar from "@/icons/calendar";
import Clock from "@/icons/clock";
import { useState } from "react";
import { useLetter, useLetterControls } from "@/state/letter";
import { formatDate } from "@/lib/date";

export default function Delivery() {
  const { illustration, message, delivery } = useLetter();
  const { setDelivery } = useLetterControls();
  const [shipping, setShipping] = useState<"delayed" | "instant">("instant");

  function onInstantShipping() {
    const now = new Date();

    setDelivery(now);
    setShipping("instant");
  }

  return (
    <section className="bg-constructor-gray relative pt-98 flex min-h-svh flex-col items-center overflow-clip pb-40">
      <Tabs />

      <div className="pointer-events-none absolute top-98 left-1/2 h-1125 w-1512 -translate-x-1/2">
        <Calendar className="absolute bottom-90 left-40 size-350 text-[#eeeeee]" />
        <Clock className="absolute top-94 right-40 size-176 text-[#EEEEEE]" />
      </div>

      <hgroup className="text-centermt-40 mt-40 max-w-706 px-32 text-center">
        <h2 className="text-h2-xl">Step 3: Delivery Date</h2>
        <div className="text-accent-xl mt-24">You can send it to your future self, or to someone else. The letter will wait quietly until its time comes.</div>
      </hgroup>

      <form className="mt-219 w-full max-w-738 px-16 md:mt-242">
        <div className="relative flex h-334 flex-col justify-end gap-12 rounded-[44px] bg-white px-16 pb-32 md:grid md:h-281 md:grid-cols-2 md:items-end md:px-90">
          <div className="shadow-letter absolute -top-190 left-1/2 -translate-x-1/2">
            <div className="shadow-letter">
              <Letter className="relative z-1 w-225" message={message} illustration={illustration} />
              <div className="absolute top-0 right-0 size-9/10 rotate-[3.4deg] bg-white/90 opacity-70"></div>
            </div>

            <Image
              className="md:184 absolute top-70 -right-60 z-10 aspect-184/120 w-85 -translate-y-full md:top-125 md:-right-186"
              src="/postmark.png"
              alt=""
              width="184"
              height="120"
            />
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

        <div className="mt-12 flex flex-col items-center gap-y-24 rounded-[44px] bg-white px-16 py-32 md:px-90">
          <span className="bg-blue text-accent-m rounded-full px-12 py-4 text-white">{formatDate(delivery)}</span>

          <DatePicker delivery={delivery} key={shipping} setDelivery={setDelivery} disabled={shipping === "instant"} />

          <span className="text-small-xl">Select a date for your message to be sent.</span>
        </div>

        <Controls className="mt-24" />
      </form>
    </section>
  );
}

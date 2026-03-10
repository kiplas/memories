import Image from "next/image";
import Tabs from "@/components/letter-tabs";
import Controls from "@/components/letter-stage-controls";
import { useLetter, useLetterControls } from "@/state/letter";

export default function Message() {
  const { message } = useLetter();
  const { setMessage } = useLetterControls();

  return (
    <section className="mt-98">
      <Tabs />

      <div className="my-24 px-32 md:my-40">
        <hgroup className="text-center">
          <Image className="mx-auto" src="/pencil.png" alt="" width="48" height="48" />
          <h2 className="text-h3-m md:text-h3-xl">Write Your Letter</h2>
          <div className="text-accent-m md:text-accent-xl mt-10">What would you say — to yourself, to someone you love, or to someone you haven’t met yet?</div>
        </hgroup>

        <textarea
          value={message}
          onInput={({ currentTarget }) => setMessage(currentTarget.value)}
          className="shadow-widget mx-auto mt-32 block h-298 w-full max-w-700 resize-none rounded-3xl border border-[#C1C1C1] bg-white px-32 py-24 md:mt-38 md:rounded-[44px]"
          name="message"
          placeholder="Write your message here ..."
        />

        <div className="mx-auto mt-32 text-center text-[0.875rem] font-medium -tracking-tighter md:mt-12">
          Take your time. You can write as much as you need — or just one line that matters
        </div>

        <Controls className="mt-32 md:mt-40" disabled={message.length <= 0} />
      </div>
    </section>
  );
}

import Select from "@/components/illustration-select";
import Tabs from "@/components/letter-tabs";
import Image from "next/image";
import Controls from "@/components/letter-stage-controls";
import Letter from "@/components/letter";
import { useLetter, useLetterControls } from "@/state/letter";
import { cn } from "@/lib/utils";

type HGroupProps = {
  className?: string;
};

function HGroup({ className }: HGroupProps) {
  return (
    <hgroup className={cn("flex flex-col items-center", className)}>
      <Image src="/brush.png" alt="" width="48" height="48" />
      <h2 className="text-h3-m md:text-h3-xl">Choose Design</h2>
    </hgroup>
  );
}

export default function Variant() {
  const { message, illustrations, illustration } = useLetter();
  const { setIllustration } = useLetterControls();

  return (
    <section className="mt-98 pb-40">
      <Tabs />

      <div className="mt-24 px-32 md:mt-64">
        <div className="mx-auto flex min-h-453 max-w-1192 flex-col gap-x-50 gap-y-32 rounded-[44px] md:bg-[#F5F5F5] md:p-32 lg:flex-row">
          <HGroup className="lg:hidden" />

          <div className="relative aspect-550/389 shrink-0 overflow-hidden rounded-2xl bg-black lg:w-550">
            <Letter className="relative z-1 mx-auto mt-38 w-427/550" message={message} illustration={illustration} />
            <div className="aspect-letter absolute top-38 right-0 left-20/550 mx-auto w-427/550 rotate-[3.5deg] bg-white/90" />
          </div>

          <div className="flex w-full flex-col justify-between">
            <HGroup className="max-lg:hidden" />

            <Select illustrations={illustrations} onChange={setIllustration} />

            <span className="text-accent-xl mt-32 pb-16 text-center">Choose the look that captures your feeling.</span>
          </div>
        </div>

        <Controls className="mt-40" />
      </div>
    </section>
  );
}

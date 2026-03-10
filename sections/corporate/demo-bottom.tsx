import Button from "@/components/ui/button";
import Image from "next/image";

export default function DemoBottom() {
  return (
    <section className="relative z-10 h-svh max-h-700 bg-white md:max-h-1031">
      <Image className="absolute -z-1 size-full object-cover" src="/mock/corporate/demo-bottom.jpg" alt="" width="1512" height="1031" />

      <div className="top-80 mx-auto flex max-w-1512 flex-col justify-end gap-y-32 px-40 pb-32 max-md:h-full md:sticky md:flex-row md:items-end md:justify-between md:px-161 md:pt-100 md:pb-64">
        <hgroup className="max-w-338 md:max-w-461">
          <h2 className="text-h1-m md:text-h1-xl mb-24 max-w-351 text-white">Build memories, not just milestones.</h2>
          <p className="text-accent-m md:text-accent-xl text-white">Every company is unique. That’s why we design custom packages that fit your culture, team size, and goals.</p>
        </hgroup>

        <Button className="bg-blue w-178 border-none text-white">Request Demo</Button>
      </div>
    </section>
  );
}

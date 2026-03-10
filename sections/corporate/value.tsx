import Image from "next/image";

export default function Value() {
  return (
    <section className="relative z-10 h-700 md:h-1164">
      <Image className="absolute inset-0 -z-1 size-full object-cover" src="/mock/corporate/value-bg.jpg" alt="" width="1512" height="1164" />

      <div className="top-0 md:sticky md:mask-[linear-gradient(black_60%,transparent)] md:backdrop-blur-xl">
        <div className="mx-auto max-w-1512 px-32 pt-40 pb-186 md:pt-100">
          <div className="max-w-338 md:max-w-724">
            <hgroup>
              <h2 className="text-h3-m md:text-h3-xl mb-24">Value to the Company</h2>
              <div className="text-h1-m md:text-h1-xl">Not just meaningful. Measurable!</div>
            </hgroup>

            <p className="text-accent-m md:text-accent-xl mt-24">
              Memories is more than a feel-good experience — it delivers real business value by strengthening culture and engagement across every stage of the employee journey.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

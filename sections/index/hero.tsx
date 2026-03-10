import Link from "@/components/ui/link";

export default function Hero() {
  return (
    <section className="sticky top-0">
      <video
        className="h-screen w-full object-cover brightness-70 data-active:[view-transition-name:hero-theme-a]"
        src="/mock/index/hero.mp4"
        poster="/mock/index/hero-poster.webp"
        playsInline
        autoPlay
        muted
        loop
      />

      <div className="absolute inset-0 grid place-content-center px-32 text-white">
        <hgroup className="max-w-338 text-center md:max-w-none">
          <h1 className="text-h1-m md:text-h1-xl">Send a message to the future.</h1>
          <span className="text-accent-m md:text-accent-xl mt-20 block">Write, record, or design a capsule — delivered to your future self or someone you love.</span>
        </hgroup>

        <nav className="mx-auto mt-40 flex flex-col justify-center gap-x-16 gap-y-12 max-md:w-full md:mt-64 md:flex-row">
          <Link className="bg-orange md:text-accent-xl border-none px-18 text-[0.875rem] max-md:h-48 max-md:w-full md:px-24" href="/create/digital/capsule">
            Send Your Capsule
          </Link>

          <Link className="bg-orange md:text-accent-xl border-none px-18 text-[0.875rem] max-md:h-48 max-md:w-full md:px-24" href="/create/digital/letter">
            Send the Letter
          </Link>

          <Link className="md:text-accent-xl border-none bg-white px-18 text-[0.875rem] text-black max-md:h-48 max-md:w-full md:px-24" href="/#preview">
            See How It Works
          </Link>
        </nav>
      </div>
    </section>
  );
}

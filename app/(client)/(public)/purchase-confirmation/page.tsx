import { ExtendedHeader } from "@/components/header";
import Security from "@/sections/security";
import Outro from "@/sections/outro";
import Purchase from "@/components/package-purchase";
import Checkmark from "@/icons/check";
import { db } from "@/db";
import Coin from "@/icons/coin";

export default async function Page() {
  const packages = await db.query.plan.findMany({
    with: {
      palette: true,
    },
  });

  return (
    <>
      <ExtendedHeader contents-absolute />

      <section className="relative bg-[#F5F5F5] py-112">
        <div className="pointer-events-none absolute top-0 left-1/2 h-1112 w-1512 -translate-x-1/2 text-[#EEEEEE]">
          <Coin className="absolute bottom-186 left-40 size-350" />
          <Coin className="absolute top-40 right-40 size-176" />
        </div>

        <div className="relative z-1 mx-auto flex max-w-706 flex-col items-center rounded-4xl border border-[#0D7F72] bg-white px-64 py-32">
          <Checkmark className="text-[#0D7F72]" />
          <div className="text-h3-xl mt-24">Success!</div>
          <div className="text-small-xl mt-16">Your credits are now ready to help you create more memories for the future.</div>
        </div>

        <Purchase className="relative z-1 mt-32" packages={packages} />
      </section>

      <Security />
      <Outro />
    </>
  );
}

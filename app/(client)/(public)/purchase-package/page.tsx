import { ExtendedHeader } from "@/components/header";
import PackagePurchase from "@/components/package-purchase";
import Outro from "@/sections/outro";
import Coin from "@/icons/coin";
import { db } from "@/db";

export default async function Page() {
  const packages = await db.query.plan.findMany({
    with: {
      palette: true,
    },
  });

  return (
    <>
      <ExtendedHeader contents-absolute />

      <section className="relative overflow-clip bg-[#F5F5F5] py-112">
        <div className="pointer-events-none absolute top-0 left-1/2 h-1112 w-1512 -translate-x-1/2 text-[#EEEEEE]">
          <Coin className="absolute bottom-186 left-40 size-350" />
          <Coin className="absolute top-40 right-40 size-176" />
        </div>

        <PackagePurchase packages={packages} />
      </section>

      <Outro />
    </>
  );
}

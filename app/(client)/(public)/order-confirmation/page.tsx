import Coin from "@/icons/coin";
import { ExtendedHeader } from "@/components/header";
import Plans from "@/sections/plans";
import Security from "@/sections/security";
import Outro from "@/sections/outro";
import Confirmation from "@/components/order-confirmation";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { eq } from "drizzle-orm";
import { order as $order } from "@/db/schema/order";
import { capitalize } from "@/lib/strings";
import { auth } from "@/server/auth";
import { headers } from "next/headers";
import { addressee as $addressee } from "@/schema/addressee";
import z from "zod";

async function getOrder(ID: number) {
  return await db.query.order.findFirst({
    where: () => eq($order.id, ID),

    with: {
      intent: true,
      charge: true,

      obligation: {
        with: {
          addressees: {
            with: { digital: true, physical: true },
          },

          letter: {
            with: {
              illustration: { with: { upload: true } },
            },
          },

          capsule: {
            with: {
              illustration: { with: { upload: true } },
              uploads: { with: { upload: true } },
            },
          },
        },
      },
    },
  });
}

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ searchParams }: Props) {
  const IDParam = (await searchParams).order;

  if (typeof IDParam !== "string" || isNaN(parseInt(IDParam))) return redirect("/");

  const ID = parseInt(IDParam);
  const session = await auth.api.getSession({ headers: await headers() });
  const order = await getOrder(ID);

  if (!order) return redirect("/");

  const { capsule, letter, addressees, variant } = order.obligation;
  const method = order.charge ? "Credits" : order.intent?.method ? order.intent?.method : "Unknown";
  const payee = order.payee;
  const product = order.obligation.letter ? "letter" : "capsule";
  const illustration = order.obligation.letter?.illustration || order.obligation.capsule?.illustration;
  const parsedAddressees = z.array($addressee).safeParse(addressees);

  if (!illustration) throw new Error("Unexpected");
  if (parsedAddressees.error) throw new Error("Unexpected");

  const summary = {
    payee: payee,
    method: method,
    title: `${capitalize(variant)} ${capitalize(product)}`,
    subtitle: illustration.label,
    addressees: parsedAddressees.data,
    letter: letter,
    capsule: capsule && {
      ...capsule,
      images: capsule.uploads.map(({ upload }) => upload?.url).filter((url) => url !== undefined),
    },
  };

  const shouldDisplaySummary = order.user === session?.user.id;

  return (
    <>
      <ExtendedHeader static />

      <div className="text-accent-xl flex h-54 w-full items-center justify-center bg-black font-bold text-[#D4F4FF]">Thank you for your order!</div>

      <section className="bg-constructor-gray relative overflow-clip px-16 pt-40 pb-40 md:px-32">
        <div className="absolute top-0 left-1/2 h-715 w-1512 -translate-x-1/2">
          <Coin className="absolute bottom-40 left-40 size-350 text-[#eeeeee]" />
          <Coin className="absolute top-94 right-40 size-176 text-[#eeeeee]" />
        </div>

        <Confirmation ID={ID} summary={shouldDisplaySummary ? summary : null} />
      </section>

      <Plans />
      <Security />
      <Outro />
    </>
  );
}

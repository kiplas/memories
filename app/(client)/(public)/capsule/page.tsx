import CapsuleReveal from "@/components/capsule-reveal";
import { db } from "@/db";
import { view as $view } from "@/db/schema/view";
import { sendViewNotification } from "@/server/mail";
import { and, eq } from "drizzle-orm";
import { digitalAddressee as $digitalAddressee } from "@/schema/addressee";
import { redirect } from "next/navigation";

type UpdateViewInput = {
  token: string;
  obligation: number;
  payee: string;
};

async function updateView({ token, obligation, payee }: UpdateViewInput) {
  const viewedAt = new Date();

  const view = await db.query.view.findFirst({
    where: () => and(eq($view.token, token), eq($view.obligation, obligation)),
    with: { addressee: { with: { digital: true } } },
  });

  if (!view || view.viewedAt !== null) return;

  await db.update($view).set({ viewedAt }).where(eq($view.id, view.id)).returning({ id: $view.id });

  const parsedAddressee = $digitalAddressee.safeParse(view.addressee);

  if (parsedAddressee.error) return console.error("Unexpected. View referenced non digital addressee");

  sendViewNotification({
    payee,
    addressee: parsedAddressee.data.digital.email,
    date: viewedAt.toUTCString(),
  });
}

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ searchParams }: Props) {
  const IDParam = (await searchParams).capsule;
  const TokenParam = (await searchParams).token;

  if (typeof IDParam !== "string" || isNaN(parseInt(IDParam))) return redirect("/");

  const ID = parseInt(IDParam);

  const capsule = await db.query.capsule.findFirst({
    where: ($capsule, { eq }) => eq($capsule.id, ID),

    with: {
      illustration: { with: { upload: true } },
      uploads: { with: { upload: true } },
      obligation: {
        columns: { id: true },
        with: { order: { columns: { payee: true } } },
      },
    },
  });

  if (!capsule) redirect("/");

  if (TokenParam && typeof TokenParam === "string") {
    if (!!capsule.obligation.order?.payee) updateView({ token: TokenParam, obligation: capsule.obligation.id, payee: capsule.obligation.order.payee });
  }

  return <CapsuleReveal {...capsule} />;
}

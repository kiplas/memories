import { db } from "@/db";
import { auth } from "@/server/auth";
import { Maybe } from "@/types";
import { and, eq, ne } from "drizzle-orm";
import { headers } from "next/headers";

function Placeholder() {
  return (
    <div className="mt-32 flex flex-col gap-y-10 rounded-2xl bg-[#F7F7F7] p-12 text-center">
      <div className="font-bold">You don’t have any purchases yet.</div>
      <div className="text-supersmall-xl">Your credit packages and payments will appear here.</div>
    </div>
  );
}

type TransactionProps = {
  id: number;
  reason: string;
  createdAt: Date;
  amount: number;
  method: Maybe<string>;
  status: string;
};

function Transaction({ id, reason, createdAt, amount, status, method }: TransactionProps) {
  return (
    <article className="rounded-2xl bg-[#F7F7F7] p-12">
      <header className="flex justify-between font-bold">
        <div>{reason}</div>
        <div>${(amount / 100).toLocaleString("en-US")}</div>
      </header>

      <div className="mt-10">
        <div>Purchased on {createdAt.toLocaleDateString("en-US", { month: "short", year: "numeric", day: "2-digit" })}</div>
        <div>Transaction ID #{id}</div>
        {method && <div>{method}</div>}
        <div>{status}</div>
      </div>
    </article>
  );
}

export default async function Transactions() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) throw new Error("Unathorized");

  const intents = await db.query.intent.findMany({
    where: ($intent) => and(eq($intent.user, session.user.id), ne($intent.status, "pending")),
  });

  return (
    <section className="px-16">
      <div className="shadow-widget mx-auto mt-16 max-w-713 rounded-3xl bg-white px-24 py-20">
        <hgroup>
          <h2 className="text-h3-xl mb-12">Purchase History</h2>
          <span className="text-space-gray">Your recent purchases and credit additions appear here.</span>
        </hgroup>

        {intents.length < 1 ? (
          <Placeholder />
        ) : (
          <div className="mt-32 flex flex-col gap-y-4">
            {intents.map(({ id, reason, amount, createdAt, method, status }) => (
              <Transaction key={id} id={id} reason={reason} amount={amount} createdAt={createdAt} status={status} method={method} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

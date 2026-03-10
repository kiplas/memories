"use client";

import Image from "next/image";
import Plus from "@/icons/plus";
import { capitalize } from "@/lib/strings";
import { useTRPC } from "@/state/trpc";
import { useQuery } from "@tanstack/react-query";
import Link from "@/components/ui/link";

function getPointAtAngle(angle: number, r: number, h: number, k: number) {
  const radians = (angle * Math.PI) / 180;
  const x = h + r * Math.cos(radians);
  const y = k + r * Math.sin(radians);

  return [x, y];
}

function Statistics() {
  const trpc = useTRPC();

  const { data: user } = useQuery(trpc.session.user.queryOptions());

  if (!user) throw new Error("Unauthorized");

  const { data: capsuleCount = 0 } = useQuery(trpc.session.count.capsules.queryOptions());
  const { data: letterCount = 0 } = useQuery(trpc.session.count.letters.queryOptions());

  return (
    <div className="shadow-widget rounded-3xl bg-white p-32">
      <hgroup>
        <h2 className="text-h3-m md:text-h3-xl">Welcome back, {capitalize(user.name)}!</h2>
        <span className="text-space-gray mt-24 block max-w-306 md:max-w-none">
          You have 12 digital capsules and 2 printed capsules ready to send. Create meaningful memories that will last forever.
        </span>
      </hgroup>

      <div className="mt-24 grid grid-cols-2 gap-12">
        <article className="flex h-242 flex-col rounded-2xl bg-[#FAFAF9] p-16 pt-12">
          <Image src="/organizer.png" alt="" width="64" height="64" />

          <div className="mt-auto mb-4 text-[4rem] font-semibold">{capsuleCount}</div>
          <h3>Active capsules</h3>
        </article>

        <article className="flex h-242 flex-col rounded-2xl bg-[#FAFAF9] p-16 pt-12">
          <Image src="/letter.png" alt="" width="64" height="64" />

          <div className="mt-auto mb-4 text-[4rem] font-semibold">{letterCount}</div>
          <h3>Letters written</h3>
        </article>
      </div>
    </div>
  );
}

function BalancePlaceholder() {
  return (
    <div className="grid grow place-content-center text-center text-[#71717A]">
      <div className="font-bold">No credits available</div>
      <div>Add credits to continue sending digital or printed memories.</div>
    </div>
  );
}

function BalanceChart() {
  const trpc = useTRPC();

  const { data: user } = useQuery(trpc.session.user.queryOptions());

  if (!user) throw new Error("Unauthorized");

  const percentage = Math.min(user.balance.current / user.balance.overall, 0.9999);
  const [x, y] = getPointAtAngle(percentage * 360, 76, 80, 80);

  return (
    <div>
      <div className="relative mx-auto my-24 size-160">
        <svg className="-rotate-90" width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M 80 4 A 76 76, 0, 1, 0, 80.001 4" stroke="#F5F5F5" strokeWidth="8" strokeLinecap="round" />
          <path d={`M 156 80 A 76 76, 0, ${percentage < 0.5 ? 0 : 1}, 1, ${x} ${y}`} stroke="#2F70DB" strokeWidth="8" strokeLinecap="round" />
        </svg>

        <div className="absolute inset-0 m-auto grid place-content-center text-center">
          <span className="text-[2rem]/[1.25rem] font-bold">
            {user.balance.current}/{user.balance.overall}
          </span>
          <span className="mt-6 text-[-0.75rem]/[1.25rem] font-bold">available</span>
        </div>
      </div>

      <div className="text-space-gray mx-auto max-w-240 text-center md:max-w-none">Add more credits to continue sending your memories.</div>
    </div>
  );
}

function Balance() {
  const trpc = useTRPC();

  const { data: user } = useQuery(trpc.session.user.queryOptions());

  if (!user) throw new Error("Unauthorized");

  return (
    <div className="shadow-widget flex shrink-0 flex-col gap-y-24 rounded-3xl bg-white p-32 min-[900]:w-343">
      <h2 className="text-h3-m md:text-h3-xl">Your Credit Balance</h2>

      {user.balance.current > 0 ? <BalanceChart /> : <BalancePlaceholder />}

      <Link href="/purchase-package" className="bg-black text-white" icon={<Plus />}>
        Add Credits
      </Link>
    </div>
  );
}

export default function Widgets() {
  return (
    <section className="bg-account-gray px-16 pt-100 md:px-32">
      <div className="mx-auto flex max-w-948 flex-col gap-20 min-[900]:flex-row">
        <Statistics />
        <Balance />
      </div>
    </section>
  );
}

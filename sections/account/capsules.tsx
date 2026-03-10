"use client";

import Refresh from "@/icons/refresh";
import Card from "@/components/capsule";
import Link from "@/components/ui/link";
import NextLink from "next/link";
import Pace from "@/icons/pace";
import CheckmarkFilled from "@/icons/checkmark-filled";
import Button from "@/components/ui/button";
import CalendarPlain from "@/icons/calendar-plain";
import { Fragment } from "react/jsx-runtime";
import type { QueryOutputs } from "@/types";
import type { Order } from "@/types";
import { useTRPC } from "@/state/trpc";
import { useInfiniteQuery } from "@tanstack/react-query";
import { capitalize } from "@/lib/strings";

function DeliveryConfirmation() {
  return (
    <div className="bg-green flex h-25 items-center gap-x-4 rounded-full pr-12 pl-2 text-[0.875rem] font-normal -tracking-[0.15px] text-white">
      <CheckmarkFilled />
      <div>Delivered</div>
    </div>
  );
}

function Time({ date }: { date: Date }) {
  return (
    <time
      className="bg-blue flex h-25 items-center gap-x-4 rounded-full pr-12 pl-2 text-[0.875rem] font-normal -tracking-[0.15px] text-white"
      dateTime={date.toString()}
      suppressHydrationWarning
    >
      <Pace />
      <div>{new Date(date).toLocaleString("en-US", { dateStyle: "medium" })}</div>
    </time>
  );
}

function Order({ id, obligation }: QueryOutputs["session"]["capsules"]["orders"][number]) {
  const { capsule, delivery, fulfilled, variant, createdAt } = obligation;

  if (!capsule) throw new Error("Expected obligation to have a capsule");

  const { illustration } = capsule;
  const images = capsule.uploads.map(({ upload }) => upload?.url).filter((url) => url !== undefined);

  return (
    <article className="hover:shadow-widget flex flex-col gap-y-32 rounded-lg bg-white p-12 pr-24 md:flex-row md:items-center md:p-8 md:pr-24">
      <div className="flex items-center">
        <Card className="w-134 rounded-xs" illustration={illustration} images={images} />

        <div className="ml-20">
          <div className="text-space-gray flex items-center gap-x-4">
            <CalendarPlain /> {new Date(createdAt).toLocaleString("en-US", { dateStyle: "medium" })}
          </div>

          <div className="mt-10">
            {capitalize(variant)} Capsule Design:
            <br />
            {illustration.label}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-x-2 md:ml-auto">
        <span className="grid h-25 w-65 place-content-center rounded-full bg-black text-[0.875rem] font-normal -tracking-[0.15px] text-white">{capitalize(variant)}</span>
        {fulfilled ? <DeliveryConfirmation /> : <Time date={delivery} />}

        <NextLink href={`/create/${variant}/capsule?preset=${id}`} className="ml-auto flex items-center gap-x-4 text-[0.75rem] font-normal md:ml-47">
          <Refresh />
          Resend
        </NextLink>
      </div>
    </article>
  );
}

function Placehoder() {
  return (
    <div className="text-accent-xl rounded-lg bg-white py-32 text-center">
      You don’t have any capsules yet. <br /> Create your first digital or printed capsule to get started
    </div>
  );
}

export default function Capsules() {
  const trpc = useTRPC();
  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    trpc.session.capsules.infiniteQueryOptions({ limit: 4 }, { getNextPageParam: (lastPage) => lastPage.nextCursor, initialCursor: null }),
  );

  function onFetchNext() {
    if (isFetchingNextPage) return;
    fetchNextPage();
  }

  const isEmpty = data?.pages[0]?.orders.length === 0;

  return (
    <section className="bg-account-gray px-32 pt-100">
      <header className="mx-auto flex max-w-948 flex-col justify-between gap-x-64 gap-y-32 border-b border-b-black/60 pb-24 md:flex-row">
        <hgroup className="max-w-338">
          <h2 className="text-h2-m md:text-h2-xl mb-10">My Capsules</h2>
          <span className="text-accent-xl">All your digital and printed capsules — created, scheduled, or already delivered.</span>
        </hgroup>

        <Link href="/create/digital/capsule" className="shrink-0 bg-black text-white">
          Send new Capsule
        </Link>
      </header>

      <div className="mx-auto mt-32 flex max-w-948 flex-col gap-y-10">
        {data && !isEmpty ? (
          data.pages.map(({ orders }, index) => (
            <Fragment key={index}>
              {orders.map((order) => (
                <Order key={order.id} {...order} />
              ))}
            </Fragment>
          ))
        ) : (
          <Placehoder />
        )}
      </div>

      {hasNextPage && (
        <Button className="mx-auto mt-32" onClick={onFetchNext}>
          Show More
        </Button>
      )}
    </section>
  );
}

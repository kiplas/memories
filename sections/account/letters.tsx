"use client";

import Callendar from "@/icons/callendar";
import Refresh from "@/icons/refresh";
import Letter from "@/components/letter";
import Link from "@/components/ui/link";
import NextLink from "next/link";
import Button from "@/components/ui/button";
import Pace from "@/icons/pace";
import CheckmarkFilled from "@/icons/checkmark-filled";
import type { QueryOutputs } from "@/types";
import { Fragment } from "react/jsx-runtime";
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

function Order({ obligation, id, createdAt }: QueryOutputs["session"]["letters"]["orders"][number]) {
  const { letter, variant, addressees, fulfilled, delivery } = obligation;

  if (!letter) throw new Error("Expected obligation to have a letter");

  const { illustration, message } = letter;

  return (
    <article className="hover:shadow-widget flex flex-col rounded-lg bg-white p-16">
      <div className="relative aspect-277/160 w-full overflow-clip rounded-xs bg-black">
        <Letter className="absolute top-20/160 right-0 left-0 z-1 mx-auto w-157/277" message={message} illustration={illustration} />
        <div className="aspect-letter absolute top-18/160 left-80/277 w-140/277 rotate-[3.4deg] bg-white/90" />
      </div>

      <div className="mt-20 flex flex-col gap-y-16 pl-16">
        <time className="text-space-gray flex items-center gap-x-4 text-[0.75rem]" dateTime={createdAt.toString()} suppressHydrationWarning>
          <Callendar />
          {new Date(createdAt).toLocaleString("en-US", { dateStyle: "medium" })}
        </time>

        <span className="mt-26">
          {capitalize(variant)} Capsule Design:
          <br />
          {illustration.label}
        </span>

        <div className="text-small-xl">
          <span className="text-space-gray">Sent to:</span>

          <ul className="mt-8 flex flex-col gap-y-4">
            {addressees.slice(0, 2).map(({ digital }) => (
              <li key={digital?.email}>{digital?.email}</li>
            ))}
          </ul>
        </div>

        <div className="flex items-center justify-between">
          {fulfilled ? <DeliveryConfirmation /> : <Time date={delivery} />}

          <NextLink href={`/create/${variant}/letter?preset=${id}`} className="ml-auto flex items-center gap-x-4 text-[0.75rem]">
            <Refresh />
            Resend
          </NextLink>
        </div>
      </div>
    </article>
  );
}

function Placehoder() {
  return (
    <div className="text-accent-xl rounded-lg bg-white py-32 text-center">
      You haven’t written any letters yet. <br /> Your letters will appear here once you create one.
    </div>
  );
}

export default function Letters() {
  const trcp = useTRPC();
  const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = useInfiniteQuery(
    trcp.session.letters.infiniteQueryOptions({ limit: 3 }, { getNextPageParam: (lastPage) => lastPage.nextCursor, initialCursor: null }),
  );

  function onFetchNext() {
    if (isFetchingNextPage) return;
    fetchNextPage();
  }

  const isEmpty = data?.pages[0]?.orders.length === 0;

  return (
    <section className="bg-account-gray px-32 py-100">
      <header className="mx-auto flex max-w-948 flex-col justify-between gap-x-64 gap-y-32 border-b border-b-black/60 pb-24 md:flex-row">
        <hgroup>
          <h2 className="text-h2-m md:text-h2-xl mb-10">My Letters</h2>
          <div className="text-accent-xl max-w-260 md:max-w-none">All your written letters — scheduled, or already delivered.</div>
        </hgroup>

        <Link href="/create/digital/letter" className="shrink-0 bg-black text-white">
          Send new Letter
        </Link>
      </header>

      <div className="mx-auto mt-32 grid max-w-948 grid-cols-1 gap-10 data-empty:block md:grid-cols-2 lg:grid-cols-3" data-empty={isEmpty || null}>
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

import { CompressedHeader } from "@/components/header";
import Widgets from "@/sections/account/widgets";
import Capsules from "@/sections/account/capsules";
import Letters from "@/sections/account/letters";
import Plans from "@/sections/account/plans";
import Outro from "@/sections/outro";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/lib/query";
import { trpc, getCaller } from "@/server/trpc";

export default async function Account() {
  const caller = getCaller();
  const queryClient = getQueryClient();

  const user = await caller.session.user();

  if (!user) throw new Error("Unathorized");

  await queryClient.prefetchQuery(trpc.session.count.capsules.queryOptions());
  await queryClient.prefetchQuery(trpc.session.count.letters.queryOptions());
  await queryClient.prefetchInfiniteQuery(trpc.session.capsules.infiniteQueryOptions({ limit: 4 }, { getNextPageParam: (lastPage) => lastPage.nextCursor, initialCursor: null }));
  await queryClient.prefetchInfiniteQuery(trpc.session.letters.infiniteQueryOptions({ limit: 3 }, { getNextPageParam: (lastPage) => lastPage.nextCursor, initialCursor: null }));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CompressedHeader />
      <Widgets />
      <Capsules />
      <Letters />
      <Plans />
      <Outro />
    </HydrationBoundary>
  );
}

import PlanCard from "@/components/plan-card";
import { db } from "@/db";

export default async function Plans() {
  const packages = await db.query.plan.findMany({ with: { palette: true } });

  return (
    <div className="bg-brown relative z-1 py-32 md:py-64" id="pricing">
      <hgroup className="px-32 text-center text-white">
        <h2 className="text-h1-m md:text-h1-xl">Simple, Flexible Plans</h2>
        <span className="text-accent-xl mt-24 block">Choose the plan that grows with your memories.</span>
      </hgroup>

      <div className="mx-auto mt-67 flex max-w-(--w-viewport) grid-cols-3 flex-col justify-center gap-20 px-32 md:flex-row md:flex-wrap md:px-40 xl:grid">
        {packages.map((plan) => (
          <PlanCard key={plan.name} {...plan} className="min-h-none w-full md:w-[calc(50%-10px)] xl:w-full" />
        ))}
      </div>
    </div>
  );
}

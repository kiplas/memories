import PlanCard from "@/components/plan-card";
import { db } from "@/db";

export default async function Plans() {
  const packages = await db.query.plan.findMany({
    with: {
      palette: true,
    },
  });

  return (
    <section className="p-32 md:py-40">
      <hgroup className="text-center">
        <h2 className="text-h2-m md:text-h2-xl mb-24">Need more capsules?</h2>
        <span className="text-accent-xl">Add credits to keep sending your letters and capsules.</span>
      </hgroup>

      <div className="mx-auto mt-40 grid max-w-949 gap-20 md:grid-cols-2">
        <PlanCard {...packages[1]} />
        <PlanCard {...packages[2]} />
      </div>

      <div className="text-space-gray mt-40 text-center text-[0.75rem] -tracking-tighter">Credits are added instantly after purchase.</div>
    </section>
  );
}

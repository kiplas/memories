import Continent from "@/icons/continent";
import Dove from "@/icons/dove";
import Plane from "@/icons/paper-plane";
import Link from "./ui/link";
import { type plan as $package, type planPalette as $planPalette } from "@/db/schema/package";
import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";

type Palette = typeof $planPalette.$inferSelect;
type Package = typeof $package.$inferSelect & { palette: Palette };

const icons = {
  continent: Continent,
  dove: Dove,
  plane: Plane,
};

type Props = Package & {
  className?: ClassValue;
};

export default function PlanCard({ name, slug, summary, content, price, verb, palette, icon, className }: Props) {
  const Icon = icons[icon];

  return (
    <article
      className={cn("relative min-h-570", palette.gradient && "rounded-[44px] p-1", className)}
      style={{ backgroundImage: palette.gradient ? `linear-gradient(${palette.gradient})` : "" }}
      key={name}
    >
      <div className="flex h-full flex-col gap-y-16 rounded-[44px] p-32 md:gap-y-40 md:p-44" style={{ background: palette.background, color: palette.foreground }}>
        <hgroup className="border-b border-current">
          <h3 className="md:text-h2-xl text-[2rem] font-bold -tracking-tighter">{name}</h3>
          <span className="my-16 block min-h-[2em] text-[0.875rem] md:my-24 md:text-base">{summary}</span>
        </hgroup>

        <Icon className="absolute -top-10 right-20 size-60 md:-top-31 md:size-100" style={{ color: palette.aux }} />

        <div className="mt">
          <span className="rounded-full px-8 py-2" style={{ color: palette.background, background: palette.foreground }}>
            Features
          </span>

          <ul className="mt-14 text-[1.125rem]/[1.8em] -tracking-tighter">
            {content.map((feature) => (
              <li key={feature}>
                <span className="mx-8 mb-[calc(0.5lh-12px)] inline-block size-6 rounded-full bg-current text-[0.875rem]/[1.8em] -tracking-tighter md:text-base"></span> {feature}
              </li>
            ))}
          </ul>
        </div>

        <span className="md:text-h2-xl text-[2rem]/[2.8625rem] font-bold -tracking-tighter">${(price / 100).toString().replace(".", ",")}</span>

        <Link className="mt-auto border-none bg-white text-black" href={`/purchase-package?package=${slug}`}>
          {`${verb} ${name}`}
        </Link>
      </div>
    </article>
  );
}

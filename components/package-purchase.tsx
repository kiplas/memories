"use client";

import Image from "next/image";
import Skeleton from "@/components/skeleton";
import Button from "@/components/ui/button";
import { type plan as $package, type planPalette as $planPalette } from "@/db/schema/package";
import { type MouseEvent, useState } from "react";
import { usePackageIntent } from "@/hooks/use-intent";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { ClassValue } from "clsx";
import { cn } from "@/lib/utils";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/state/trpc";

const appearance = {
  theme: "flat",
  inputs: "spaced",
  labels: "above",
  variables: {
    borderRadius: "12px",
    colorPrimary: "#0D7F72",
    colorBackground: "#ffffff",
    buttonBorderRadius: "8px",
  },
  rules: {
    ".Input": {
      border: "1px solid #BBBBBB",
    },
    ".AccordionItem": {
      border: "1px solid #BBBBBB",
    },
  },
} as const;

type Palette = typeof $planPalette.$inferSelect;
type Package = typeof $package.$inferSelect & { palette: Palette };

type OptionProps = {
  package: Package;
  isActive: boolean;
  isCompact: boolean;
  onSelect: () => unknown;
};

function Option({ package: { name, price, content, palette }, isActive, isCompact, onSelect }: OptionProps) {
  return (
    <label className="group block cursor-pointer rounded-xl p-12" style={{ background: palette.background, color: palette.foreground }} data-active={isActive || null}>
      <input className="pointer-events-none absolute z-0 hidden" name="package" value={name} type="radio" onChange={onSelect} />

      <div className="text-accent-xl flex font-bold">
        <div className="size-22 rounded-full border border-current p-5">
          <div className="size-full rounded-full bg-current opacity-0 group-data-active:opacity-100"></div>
        </div>

        <div className="ml-10">{name}</div>

        <div className="ml-auto">${(price / 100).toString().replace(".", ",")}</div>
      </div>

      {isCompact || (
        <div className="mt-10 pl-32">
          <ul className="text-[0.75rem] -tracking-tighter">
            {content.map((item, index) => (
              <li className="list-inside list-disc" key={index}>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}
    </label>
  );
}

function Placeholder() {
  return (
    <div className="text-skeleton mt-20">
      <Skeleton className="mx-auto h-32 w-240" />

      <Skeleton className="mt-20 h-48 w-full" />
      <Skeleton className="mt-4 h-48 w-full" />
      <Skeleton className="mt-4 h-48 w-full" />
      <Skeleton className="mt-4 h-48 w-full" />

      <div className="mt-20">
        <div className="flex justify-between">
          <Skeleton className="h-24 w-160" />
          <Skeleton className="h-24 w-100" />
        </div>

        <div className="mt-10 flex flex-col gap-y-4">
          <div className="flex gap-x-6 pl-6">
            <Skeleton className="size-16 rounded-full" />
            <Skeleton className="h-16 w-300" />
          </div>
          <div className="flex gap-x-6 pl-6">
            <Skeleton className="size-16 rounded-full" />
            <Skeleton className="h-16 w-200" />
          </div>
          <div className="flex gap-x-6 pl-6">
            <Skeleton className="size-16 rounded-full" />
            <Skeleton className="h-16 w-260" />
          </div>
        </div>
      </div>

      <div className="mt-20 flex justify-between">
        <Skeleton className="h-32 w-120" />
        <Skeleton className="h-32 w-200" />
      </div>

      <Skeleton className="mt-20 h-62 w-full rounded-full" />
    </div>
  );
}

type PaymentProps = {
  package: Package;
};

function Payment({ package: pkg }: PaymentProps) {
  const [pending, setPending] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const queryClent = useQueryClient();
  const trpc = useTRPC();

  async function onSubmit(event: MouseEvent) {
    event.preventDefault();

    if (pending) return;

    if (!stripe || !elements) throw new Error("Unexpected");

    const returnURL = new URL(`/purchase-confirmation`, location.origin);

    const { error } = await stripe?.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnURL.href,
      },
    });

    if (error) throw new Error(error.message);

    queryClent.invalidateQueries({ queryKey: trpc.session.user.queryKey() });

    setPending(false);
  }

  return (
    <div className="mt-20">
      <div className="text-h3-xl mb-20 text-center">Choose Pay Method</div>

      <PaymentElement />

      <div className="mt-20 flex justify-between">
        <div className="font-bold">{pkg.name}</div>
        <div>${(pkg.price / 100).toString().replace(".", ",")}</div>
      </div>

      <ul className="text-supersmall-xl mt-10 ml-6 border-b border-b-black/60 pb-12">
        {pkg.content.map((feature) => (
          <div key={feature} className="flex items-center gap-x-6">
            <div className="size-4 rounded-full bg-current" />
            <li> {feature}</li>
          </div>
        ))}
      </ul>

      <div className="text-h3-xl mt-20 flex justify-between">
        <div>Total:</div>
        <div>${(pkg.price / 100).toString().replace(".", ",")}</div>
      </div>

      <Button className="bg-green mt-20 h-62 w-full border-none text-white" onClick={onSubmit}>
        Pay
      </Button>
    </div>
  );
}

type StripeProps = {
  package: Package;
};

function Stripe({ package: pkg }: StripeProps) {
  const { secret, stripe, pending } = usePackageIntent({ packageID: pkg.id });

  return pending ? (
    <Placeholder />
  ) : (
    <Elements stripe={stripe} options={{ clientSecret: secret, appearance }}>
      <Payment package={pkg} />
    </Elements>
  );
}

type Props = {
  packages: Package[];
  className?: ClassValue;
};

export default function PackagePurchase({ packages, className }: Props) {
  const searchParams = useSearchParams();
  const [option, setOption] = useState<Package | undefined>(packages.find(({ slug }) => slug === searchParams.get("package")));

  return (
    <section className={cn(className)}>
      <hgroup className="flex flex-col items-center">
        <Image src="/wallet.png" alt="wallet" width="48" height="48" />
        <h1 className="text-h2-xl">Buy Credits</h1>
        <div className="text-accent-xl mt-10">Credits let you send your letters and memory capsules — digital or printed.</div>
      </hgroup>

      <form className="mx-auto mt-32 w-full max-w-706 rounded-4xl bg-white px-64 py-32">
        <div className="text-h3-xl text-center">Choose Your Credit Package</div>

        <div className="mt-20 grid grid-cols-2 items-center rounded-2xl bg-[#D4F4FF] p-12">
          <div className="text-accent-xl text-center font-bold">How it works</div>
          <ul className="text-supersmall-xl">
            <li>1 credit = 1 letter or 1 digital/printed capsule</li>
            <li>Credits are added instantly</li>
            <li>Credits never expire</li>
          </ul>
        </div>

        <fieldset className="mt-20 flex flex-col gap-x-4 gap-y-4 data-compact:grid data-compact:grid-cols-3" data-compact={!!option || null}>
          {packages.map((pkg) => (
            <Option key={pkg.id} package={pkg} isCompact={!!option} isActive={pkg === option} onSelect={() => setOption(pkg)} />
          ))}
        </fieldset>

        {option && <Stripe package={option} />}
      </form>
    </section>
  );
}

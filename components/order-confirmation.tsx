"use client";

import Check from "@/icons/check";
import Button from "@/components/ui/button";
import Capsule from "@/components/capsule";
import Letter from "@/components/letter";
import Link from "@/components/ui/link";
import SignUpForm from "./signup";
import { type Addressee } from "@/types";
import { type ComponentProps, useState } from "react";
import { printAddressee } from "@/lib/strings";
import { useTRPC } from "@/state/trpc";
import { useQuery } from "@tanstack/react-query";

type CapsulePreviewProps = ComponentProps<typeof Capsule>;

function CapsulePreview({ images, message, illustration }: CapsulePreviewProps) {
  return <Capsule images={images} message={message} illustration={illustration} />;
}

type LetterPreviewProps = ComponentProps<typeof Letter>;

function LetterPreview({ message, illustration }: LetterPreviewProps) {
  return (
    <div className="relative size-full overflow-clip bg-black pt-14">
      <Letter className="mx-auto w-8/10" message={message} illustration={illustration} />
      <div className="aspect-letter absolute top-12 left-1/11 w-8/10 rotate-4 bg-white/70"></div>
    </div>
  );
}

type SignupCTAProps = {
  onSignup: () => unknown;
};

function SignupCTA({ onSignup }: SignupCTAProps) {
  return (
    <div className="mt-32 flex w-full items-center justify-between border-t border-t-black/60 pt-32">
      <div className="flex flex-col gap-y-8">
        <span className="text-h3-xl">Create your free account</span>
        <span className="text-small-xl">Save your address, track your orders, and unlock card packages.</span>
      </div>

      <div className="grid w-387 grid-cols-2 gap-12">
        <Link href="/">No, thanks</Link>
        <Button className="bg-green border-none text-white" onClick={onSignup}>
          Create Account
        </Button>
      </div>
    </div>
  );
}

type SummaryProps = {
  addressees: Addressee[];
  payee: string;
  method: string;
  title: string;
  subtitle: string;
  letter?: ComponentProps<typeof Letter> | null;
  capsule?: ComponentProps<typeof Capsule> | null;
};

function Summary({ addressees, title, subtitle, letter, capsule, method, payee }: SummaryProps) {
  const preview = letter ? <LetterPreview {...letter} /> : capsule ? <CapsulePreview {...capsule} /> : null;

  return (
    <div className="shrink-0 xl:w-390">
      <div className="flex items-center gap-x-20">
        <div className="aspect-121/90 w-121">{preview}</div>

        <span className="text-accent-m md:text-accent-xl">
          {title} <br /> {subtitle}
        </span>
      </div>

      <ul className="text-small-m md:text-small-xl mt-12 flex flex-col gap-y-12 border-y border-y-black/60 py-12">
        {addressees.map((addressee, index) => (
          <li className="flex flex-col gap-y-4" key={index}>
            <span className="font-bold">Delivery Address {index + 1}:</span>
            <span className="whitespace-pre-wrap text-[#71717A]">{printAddressee(addressee)}</span>
          </li>
        ))}
      </ul>

      <div className="text-small-xl mt-12 flex flex-col gap-y-4">
        <span className="font-bold">Payment:</span>
        <span className="text-[#71717A]">{method}</span>
      </div>

      <div className="text-small-xl mt-12 flex flex-col gap-y-4 border-t border-t-black/60 pt-12">
        <span className="font-bold">Receipt sent to:</span>
        <span className="text-[#71717A]">{payee}</span>
      </div>
    </div>
  );
}

function Signup() {
  return (
    <div className="mx-auto w-full max-w-400">
      <h2 className="text-h3-m md:text-h3-xl mb-32 text-center">Create your free account</h2>

      <div>
        <SignUpForm />
      </div>
    </div>
  );
}

type DisplayProps = {
  summary: ComponentProps<typeof Summary> | null;
  ID: number | string;
};

function Display({ summary, ID }: DisplayProps) {
  return (
    <div className="flex h-full grow flex-col gap-64 xl:flex-row">
      <div className="flex w-full flex-col items-center justify-center">
        <Check />
        <h2 className="text-h3-m md:text-h3-xl mt-24 text-center">Thank you for your order!</h2>
        <span className="text-small-m md:text-small-xl mt-16 text-center">Your order #{ID} has been successfully placed.</span>
      </div>

      {summary && <Summary {...summary} />}
    </div>
  );
}

type ConfirmationProps = DisplayProps;

export default function Confirmation({ summary, ID }: ConfirmationProps) {
  const trpc = useTRPC();
  const { data: user } = useQuery(trpc.session.user.queryOptions());
  const [signup, setSignup] = useState(false);

  return (
    <div className="relative z-1 mx-auto flex min-h-400 w-full max-w-5xl flex-col rounded-[44px] bg-white p-16 md:p-32">
      {signup && <Signup />}
      {!signup && <Display summary={summary} ID={ID} />}
      {!signup && !user && <SignupCTA onSignup={() => setSignup(true)} />}
    </div>
  );
}

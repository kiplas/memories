"use client";

import Option from "@/components/payment-option";
import Button from "@/components/ui/button";
import Skeleton from "./skeleton";
import Input from "./input";
import { createContext, use, useId, useState, type PropsWithChildren, type ReactNode } from "react";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useProductIntent } from "@/hooks/use-intent";
import { formatDate } from "@/lib/date";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/state/trpc";
import { Addressee } from "@/types";
import { printAddressee } from "@/lib/strings";
import z from "zod";

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

type PaymentContext = {
  method: "OTP" | "credits";
  intent?: number;
  pending: boolean;
  prices: {
    OTP: number;
    credits: number;
  };
  payee: string;
  payeeError: string;
  quantity: number;
};

type PaymentControlContext = {
  setMethod: (method: "OTP" | "credits") => void;
  setPending: (status: boolean) => void;
  setPayee: (payee: string) => void;
  setPayeeError: (error: string) => void;
};

const PaymentContext = createContext<PaymentContext | null>(null);
const PaymentControlContext = createContext<PaymentControlContext | null>(null);

function usePayment() {
  const context = use(PaymentContext);

  if (!context) throw new Error("Unable to use payment context outside of a provider");

  return context;
}

function usePaymentControls() {
  const context = use(PaymentControlContext);

  if (!context) throw new Error("Unable to use payment control context outside of a provider");

  return context;
}

type SummaryProps = {
  title: string;
  subtitle: string;
  delivery: Date;
  addressees: Addressee[];
  product: string;
  onTransaction: () => unknown;
  slots: {
    preview: ReactNode;
  };
};

function Summary({ title, subtitle, delivery, product, addressees, slots, onTransaction }: SummaryProps) {
  const trpc = useTRPC();
  const { data: user } = useQuery(trpc.session.user.queryOptions());
  const { method, prices, quantity } = usePayment();

  return (
    <div className="flex w-full flex-col rounded-xl bg-[#F5F5F5] px-32 py-24">
      <span className="text-h3-xl">Order Summary</span>

      <div className="mt-20 flex items-center gap-x-20">
        <div className="relative aspect-121/90 w-121 overflow-clip bg-black">{slots.preview}</div>

        <div className="text-accent-xl">
          {title} <br /> {subtitle}
        </div>
      </div>

      <div className="text-small-xl mt-32 flex justify-between">
        <span className="font-bold">Delivery:</span>
        <span>{formatDate(delivery)}</span>
      </div>

      <div className="text-small-xl mt-10">
        <div className="flex justify-between">
          <span className="font-bold">Recipients:</span>
          <span>{addressees.length}</span>
        </div>

        <ul className="mt-10 ml-auto flex w-fit flex-col gap-y-10 text-end">
          {addressees.map((addressee, index) => (
            <li key={index}>{printAddressee(addressee)}</li>
          ))}
        </ul>
      </div>

      <div className="text-small-xl mt-32 flex justify-between border-y border-y-black py-12">
        <span className="font-bold">{product}:</span>
        <span>
          {method === "credits" ? prices.credits : prices.OTP / 100} × 1 {method === "credits" ? "Credit" : "$"}
        </span>
      </div>

      <div className="text-h3-xl mt-10 flex justify-between">
        <span>Total:</span>
        <span>
          {method === "credits" ? prices.credits * quantity : (prices.OTP / 100) * quantity} {method === "credits" ? "Credit" : "$"}
        </span>
      </div>

      <Button
        className="bg-green mt-24 h-62 w-full rounded-full text-white lg:mt-auto"
        onClick={onTransaction}
        disabled={!!user && method === "credits" && prices.credits * quantity > user.balance.current}
      >
        {user ? "Pay" : "Pay as Guest"}
      </Button>
    </div>
  );
}

function Placeholder() {
  return (
    <div className="text-skeleton relative z-1 mx-auto mt-40 flex w-full max-w-5xl flex-col gap-x-64 gap-y-32 rounded-[44px] bg-white p-16 lg:min-h-623 lg:flex-row lg:p-32 lg:pl-64">
      <div className="flex shrink-0 flex-col lg:w-400">
        <Skeleton className="h-48 w-full shrink-0" />
        <Skeleton className="mt-12 h-48 w-full shrink-0 lg:mt-16" />
        <Skeleton className="mt-12 mb-16 h-full min-h-120 w-full" />
        <Skeleton className="mt-4 h-48 w-full shrink-0" />
      </div>

      <Skeleton className="w-full max-lg:h-200" />
    </div>
  );
}

function Methods() {
  const trpc = useTRPC();
  const { data: user } = useQuery(trpc.session.user.queryOptions());
  const { method, prices, quantity, payee, payeeError } = usePayment();
  const { setMethod, setPayee } = usePaymentControls();

  function select(value: string) {
    if (value === "credits" || value === "OTP") setMethod(value);
  }

  return (
    <div>
      <span className="text-h3-xl">Choose Pay Method</span>

      <Option.Root className="mt-16 w-full md:max-w-400" selected={method} select={select}>
        {user && (
          <Option.Item value="credits">
            <Option.Header>Memories Credits</Option.Header>
            <Option.Panel>
              <div className="text-small-xl flex justify-between">
                <span className="font-bold">Order total:</span>
                <span className="data-danger:text-orange" data-danger={prices.credits * quantity > user.balance.current || null}>
                  {prices.credits * quantity} credits
                </span>
              </div>

              <div className="text-small-xl flex justify-between">
                <span className="font-bold">Credit balance:</span>
                <span>{user.balance.current} credits</span>
              </div>
            </Option.Panel>
          </Option.Item>
        )}

        <Option.Item value="OTP">
          <Option.Header>One Time Payment</Option.Header>
          <Option.Panel>
            <PaymentElement />

            {!user && (
              <Input
                className="mt-12"
                name="payee"
                error={payeeError}
                value={payee}
                onChange={({ currentTarget }) => setPayee(currentTarget.value)}
                label="Your e-mail"
                placeholder="'Your e-mail (for Receipt and tracking)"
                type="email"
              />
            )}
          </Option.Panel>
        </Option.Item>
      </Option.Root>
    </div>
  );
}

type FormProps = {
  onPayment: ({}: { intent: number; method: "credits" | "OTP"; payee: string }) => Promise<{ error?: string | undefined; order?: number }>;
};

function Form({ children, onPayment }: PropsWithChildren<FormProps>) {
  const trpc = useTRPC();
  const { data: user } = useQuery(trpc.session.user.queryOptions());
  const { pending, intent, method, payee } = usePayment();
  const { setPending, setPayeeError } = usePaymentControls();
  const elements = useElements();
  const stripe = useStripe();
  const router = useRouter();

  async function action() {
    if (pending) return;

    if (!elements || !stripe || !intent) return console.error("No Elements, intent or Stripe");

    const parsedPayee = z.email().safeParse(user?.email || payee);

    if (parsedPayee.error) return setPayeeError("Incorrect e-mail");

    setPending(true);

    const { error: orderError, order } = await onPayment({ intent, method, payee });

    if (orderError || !order) return console.error("Unexpected");

    const returnURL = new URL(`/order-confirmation?order=${order}`, location.origin);

    if (method === "OTP") {
      const { error: confirmationError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: returnURL.href,
        },
      });
    }

    if (method === "credits") {
      router.push(returnURL.pathname + returnURL.search);
    }

    setPending(false);
  }

  return (
    <form
      action={action}
      className="relative z-1 mx-auto mt-40 grid min-h-623 max-w-5xl gap-x-32 gap-y-32 rounded-[44px] bg-white p-32 px-16 md:grid-cols-[400fr_464fr] md:px-32 lg:gap-x-64 lg:pl-64"
    >
      {children}
    </form>
  );
}

type RootProps = {
  variant: "digital" | "printed";
  product: "capsule" | "letter";
  quantity: number;
};

function Root({ children, variant, product, quantity }: PropsWithChildren<RootProps>) {
  const ID = useId();
  const trpc = useTRPC();
  const { data: user } = useQuery(trpc.session.user.queryOptions());
  const { stripe, secret, intent } = useProductIntent({ variant, product, quantity });
  const [pending, setPending] = useState(false);
  const [error, setError] = useState();
  const [payee, setPayee] = useState(user?.email||"");
  const [payeeError, setPayeeError] = useState("");
  const [method, setMethod] = useState<"OTP" | "credits">(user ? "credits" : "OTP");
  const { data: prices } = useQuery(trpc.prices.queryOptions({ product, variant, quantity }));

  const context = {
    method,
    pending,
    intent,
    quantity,
    payee,
    payeeError,
  };

  const controls = {
    setMethod,
    setPending,
    setPayee,
    setPayeeError,
  };

  /*
    Pass key to Stripe Elements so it actually will be updated
    when clientSecret changes. Otherwise orders won't be mapped to the correct intent.
  */

  return secret && intent && prices ? (
    <PaymentContext value={{ ...context, prices }}>
      <PaymentControlContext value={controls}>
        <Elements key={secret} stripe={stripe} options={{ clientSecret: secret, appearance }}>
          {children}
        </Elements>
      </PaymentControlContext>
    </PaymentContext>
  ) : (
    <Placeholder />
  );
}

const Payment = {
  Form,
  Root,
  Methods,
  Summary,
};

export default Payment;

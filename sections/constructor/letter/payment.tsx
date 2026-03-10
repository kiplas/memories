import Letter from "@/components/letter";
import Tabs from "@/components/letter-tabs";
import Coin from "@/icons/coin";
import Payment from "@/components/payment";
import { order } from "@/actions/order";
import { useLetter } from "@/state/letter";
import { digitalAddressee as $digitalAddressee } from "@/schema/addressee";
import z from "zod";

function Preview() {
  const { illustration, message } = useLetter();

  return (
    <div className="relative aspect-121/90 w-121 overflow-clip bg-black">
      <Letter className="absolute top-10 right-0 left-0 z-1 mx-auto w-92" message={message} illustration={illustration} />
      <div className="aspect-letter absolute top-8 left-20 w-88 rotate-[3.4deg] bg-white/90" />
    </div>
  );
}
export default function Order() {
  const { illustration, addressees, delivery, message } = useLetter();

  const parsedAddressees = z.array($digitalAddressee).safeParse(addressees);

  if (parsedAddressees.error) throw new Error("Unexpected");

  const summary = {
    product: "Capsules",
    title: "Printed Capsule",
    subtitle: illustration.label,
    delivery,
    addressees: parsedAddressees.data,
    onTransaction: () => {},
    slots: {
      preview: <Preview />,
    },
  };

  async function onPayment({ intent, method, payee }: { intent: number; method: "OTP" | "credits"; payee: string }) {
    if (!payee) throw new Error("No payee email");

    const payment = method === "OTP" ? ({ method: "OTP", intent } as const) : ({ method: "credits" } as const);

    if (parsedAddressees.error) throw new Error("Unexpected");

    return await order({
      variant: "digital",
      payee,
      product: "letter",
      body: {
        message,
        illustration,
      },
      delivery,
      addressees: parsedAddressees.data,
      ...payment,
    });
  }

  return (
    <section className="bg-constructor-gray relative min-h-svh overflow-hidden pt-98 pb-64">
      <Tabs className="relative z-10" />

      <div className="absolute top-0 left-1/2 h-911 w-1512 -translate-x-1/2">
        <Coin className="absolute bottom-40 left-40 size-350 text-[#eeeeee]" />
        <Coin className="absolute top-94 right-40 size-176 text-[#eeeeee]" />
      </div>

      <hgroup className="mt-40 text-center">
        <h2 className="text-h3-xl">Step 4: Payment</h2>
        <div className="text-accent-xl mt-24">Review your total and confirm payment method.</div>
      </hgroup>

      <div className="px-16">
        <Payment.Root product="letter" variant="digital" quantity={addressees.length}>
          <Payment.Form onPayment={onPayment}>
            <Payment.Methods />
            <Payment.Summary {...summary} />
          </Payment.Form>
        </Payment.Root>
      </div>
    </section>
  );
}

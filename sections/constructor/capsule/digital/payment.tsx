import Card from "@/components/capsule";
import Tabs from "@/components/capsule-tabs";
import Coin from "@/icons/coin";
import Payment from "@/components/payment";
import { useCapsule } from "@/state/capsule";
import { createObjectURL } from "@/lib/media";
import { order } from "@/actions/order";
import { digitalAddressee as $digitalAddressee } from "@/schema/addressee";
import z from "zod";

function Preview() {
  const { uploads, illustration, message } = useCapsule();

  const images = uploads.filter((upload) => !!upload).map((upload) => (upload instanceof File ? createObjectURL(upload) : upload.url));

  return <Card className="w-121" images={images} illustration={illustration} message={message} />;
}

export default function Order() {
  const { uploads, illustration, addressees, delivery, message } = useCapsule();

  const parsedAddressees = z.array($digitalAddressee).safeParse(addressees);

  if (parsedAddressees.error) throw new Error("Unexpected");

  const summary = {
    product: "Capsules",
    title: "Printed Capsule",
    subtitle: illustration.label,
    delivery,
    addressees,
    onTransaction: () => {},
    slots: {
      preview: <Preview />,
    },
  };

  async function onPayment({ intent, method, payee }: { intent: number; method: "OTP" | "credits"; payee: string }) {
    const payment = method === "OTP" ? ({ method: "OTP", intent } as const) : ({ method: "credits" } as const);

    if (parsedAddressees.error) throw new Error("Unexpected");

    return await order({
      variant: "digital",
      payee,
      product: "capsule",
      body: {
        uploads: uploads.filter((upload) => !!upload),
        message,
        illustration,
      },
      delivery,
      addressees: parsedAddressees.data,
      ...payment,
    });
  }

  return (
    <section className="bg-constructor-gray relative min-h-[calc(100svh-98px)] overflow-hidden pb-64">
      <Tabs />

      <div className="pointer-events-none absolute top-0 left-1/2 h-911 w-1512 -translate-x-1/2">
        <Coin className="absolute bottom-40 left-40 size-350 text-[#eeeeee]" />
        <Coin className="absolute top-94 right-40 size-176 text-[#eeeeee]" />
      </div>

      <hgroup className="mt-40 px-32 text-center">
        <h2 className="text-h3-xl">Step 4: Payment</h2>
        <div className="text-accent-xl mt-24">Review your total and confirm payment method.</div>
      </hgroup>

      <div className="px-16">
        <Payment.Root product="capsule" variant="digital" quantity={addressees.length}>
          <Payment.Form onPayment={onPayment}>
            <Payment.Methods />
            <Payment.Summary {...summary} />
          </Payment.Form>
        </Payment.Root>
      </div>
    </section>
  );
}

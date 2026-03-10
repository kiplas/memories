import Plus from "@/icons/plus";
import Tag from "@/components/ui/tag";
import Button from "@/components/ui/button";
import Input from "@/components/recepient-input";
import Image from "next/image";
import { type MouseEvent } from "react";
import { useControlledInput } from "@/hooks/use-controlled-input";
import { DigitalAddressee } from "@/types";
import z from "zod";

type Props = {
  onSubmit: (email: string) => unknown;
  onRemove: (email: string) => unknown;
  onMoveToNextStage: () => unknown;
  onMoveToPreviousStage: () => unknown;
  addressees: DigitalAddressee[];
};

export default function Form({ addressees, onSubmit, onRemove, onMoveToNextStage, onMoveToPreviousStage }: Props) {
  const [email, emailError, setEmail, setEmailError] = useControlledInput("");

  function action() {
    setEmailError(null);

    if (z.email().safeParse(email).error) return setEmailError("Please enter corrent e-mail address");
    if (addressees.some(({ digital }) => digital.email === email)) return setEmailError("Recipient already added");

    setEmail("");
    onSubmit(email);
  }

  function previous(event: MouseEvent) {
    event.preventDefault();
    onMoveToPreviousStage();
  }

  function next(event: MouseEvent) {
    event.preventDefault();

    if (addressees.length === 0) return setEmailError("Please add at least one recepient");

    onMoveToNextStage();
  }

  const canMoveToNextStage = addressees.length > 0;
  const canAddPayee = email.length > 0;

  return (
    <div className="flex flex-col items-center px-32">
      <hgroup className="mt-24 mb-32 flex flex-col items-center px-32 text-center">
        <Image src="/envelope.png" alt="" width="48" height="48" />
        <h2 className="text-h3-xl mb-10">Recipient Info </h2>
        <div className="text-space-gray max-w-706">Enter recipient details. You can also add more recipients — each extra card adds to the total.</div>
      </hgroup>

      <form className="flex w-full flex-col md:max-w-704" action={action}>
        {addressees.length > 0 && (
          <div className="mb-12 flex gap-12 px-28">
            {addressees.map((addressee) => (
              <Tag key={addressee.digital.email} onRemove={() => onRemove(addressee.digital.email)}>
                {addressee.digital.email}
              </Tag>
            ))}
          </div>
        )}

        <div className="relative rounded-[44px] bg-white p-20">
          <div className="text-h3-xl mb-16 px-8">Recipient {addressees.length + 1}</div>
          <Input value={email} onInput={setEmail} error={emailError} placeholder="Recipient’s e-mail:" name="recipient" type="email" />
        </div>

        <div className="mt-24 grid gap-x-12 gap-y-12 md:grid-cols-3">
          <Button onClick={previous}>Back to Message</Button>

          <Button className="bg-black text-white disabled:pointer-events-none disabled:opacity-40" direction="rtl" icon={<Plus />} disabled={!canAddPayee}>
            Add another
          </Button>

          <Button className="bg-green text-white disabled:pointer-events-none disabled:opacity-40" disabled={!canMoveToNextStage} onClick={next}>
            Next
          </Button>
        </div>
      </form>
    </div>
  );
}

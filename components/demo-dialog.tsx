"use client";

import Link from "next/link";
import Input from "@/components/input";
import Button from "@/components/ui/button";
import Checkbox from "@/components/checkbox";
import { useState, type MouseEvent } from "react";
import { useDialog, useDialogControls } from "@/state/dialog";
import { createPortal } from "react-dom";
import { useClickAway } from "@/hooks/use-click-away";
import { useControlledInput } from "@/hooks/use-controlled-input";
import { request } from "@/actions/demo";
import z from "zod";
import Check from "@/icons/check";

type FormProps = {
  onClose: () => unknown;
  onSuccess: () => unknown;
};

function Form({ onClose, onSuccess }: FormProps) {
  const [name, nameError, setName, setNameError] = useControlledInput("");
  const [email, emailError, setEmail, setEmailError] = useControlledInput("");
  const [company, companyError, setCompany, setCompanyError] = useControlledInput("");
  const [message, messageError, setMessage, setMessageError] = useControlledInput("");
  const [agreement, agreementError, setAgreement, setAgreementErrror] = useControlledInput(false, false);

  function close(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();
    onClose();
  }

  async function action() {
    setNameError("");
    setEmailError("");
    setCompanyError("");
    setMessageError("");
    setAgreementErrror(false);

    if (!name.trim()) return setNameError("Please, enter your name.");
    if (!email.trim()) return setEmailError("Please, enter your email.");
    if (!company.trim()) return setCompanyError("Please, enter your company name.");
    if (!message.trim()) return setMessageError("Please, enter a message.");
    if (!agreement) return setAgreementErrror(true);

    if (!z.email().safeParse(email).success) return setEmailError("Please, enter valie e-mail.");

    const response = await request({ email, company, name, message });

    if (response.error) console.error(response);

    onSuccess();
  }

  return (
    <form className="text-h3-m md:text-h3-xl w-full max-w-450 rounded-4xl bg-white p-24" action={action}>
      <hgroup>
        <h2 className="text-h3-m md:text-h3-xl">Request Demo</h2>
        <div className="text-small-m md:text-small-xl text-gray mt-12">Fill out the form below and our team will get back to you within 24 hours.</div>
      </hgroup>

      <div className="mt-24 flex flex-col gap-y-8">
        <Input
          value={name}
          onChange={(event) => setName(event.currentTarget.value)}
          error={nameError}
          placeholder="John Doe"
          name="full name"
          label="Full name:"
          type="text"
          autoComplete="full name"
        />
        <Input
          value={email}
          onChange={(event) => setEmail(event.currentTarget.value)}
          error={emailError}
          placeholder="email@example.com"
          name="e-mail"
          label="Work Email:"
          type="email"
          autoComplete="e-mail"
        />
        <Input
          value={company}
          onChange={(event) => setCompany(event.currentTarget.value)}
          error={companyError}
          placeholder="Acme Corporation"
          name="company name"
          label="Company Name:"
          type="text"
          autoComplete="company"
        />
        <Input
          value={message}
          onChange={(event) => setMessage(event.currentTarget.value)}
          error={messageError}
          placeholder="What would you like to achieve with Memories?"
          name="message"
          label="Tell us about your needs"
          type="text"
        />

        <label className="group flex items-center gap-x-5" data-error={agreementError || null}>
          <Checkbox name="agreement" value={agreement} onChange={setAgreement} error={!!agreementError} />

          <span className="text-small-xl">
            I agree to the&nbsp;
            <Link className="text-blue" href="/">
              Terms of Service
            </Link>
            &nbsp;and&nbsp;
            <Link className="text-blue" href="">
              Privacy Policy
            </Link>
          </span>
        </label>
      </div>

      <div className="mt-24 grid grid-cols-2 gap-x-8">
        <Button className="h-52 border-none bg-[#E2E2E2]" onClick={close}>
          Cancel
        </Button>
        <Button className="bg-blue h-52 border-none text-white">Submit Request</Button>
      </div>
    </form>
  );
}

type SuccessProps = {
  onClose: () => unknown;
};

function Success({ onClose }: SuccessProps) {
  return (
    <div className="flex max-w-530 flex-col items-center rounded-[44px] bg-white px-32 py-32">
      <Check className="text-green size-48" />

      <hgroup className="mt-24 max-w-400 text-center">
        <h2 className="text-h3-m md:text-h3-xl">Thank You!</h2>
        <div className="text-sm-m md:text-sm-xl mt-16 text-[#71717A]">
          We&apos;ve received your request for a demo. Our team will review your information and get back to you within 24 hours.
        </div>
      </hgroup>

      <Button className="mt-32 h-52 border-none bg-[#e2e2e2]" onClick={onClose}>
        Close
      </Button>
    </div>
  );
}

function View() {
  const { close } = useDialogControls();
  const ref = useClickAway<HTMLDivElement>(() => close({ name: "demo" }));
  const [success, setSuccess] = useState(false);

  return (
    <aside className="fixed inset-0 z-100 flex items-center justify-center bg-black/70 px-32">
      <div ref={ref} className="rounded-44px">
        {success ? <Success onClose={() => close({ name: "demo" })} /> : <Form onClose={() => close({ name: "demo" })} onSuccess={() => setSuccess(true)} />}
      </div>
    </aside>
  );
}

export default function Dialog() {
  const { list } = useDialog();

  return list.find(({ name }) => name === "demo") && createPortal(<View />, document.documentElement);
}

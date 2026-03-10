"use client";

import Close from "@/icons/close";
import Input from "./input";
import Checkbox from "./checkbox";
import FieldSeparator from "./field-separator";
import Google from "@/icons/google";
import Apple from "@/icons/apple";
import SignUpForm from "@/components/signup";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/otp";
import { sendRecoveryOTP, updatePassword, verifyRecoveryOTP } from "@/actions/auth";
import { type MouseEvent, useState, createContext, use } from "react";
import { signin } from "@/actions/auth";
import { useAuth, useAuthControls } from "@/state/auth";
import { useControlledInput } from "@/hooks/use-controlled-input";
import { useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/state/trpc";
import { cn } from "@/lib/utils";
import z from "zod";

type HGroupProps = {
  title: string;
  subtitle: string;
  className?: string;
};

function HGroup({ title, subtitle, className }: HGroupProps) {
  return (
    <hgroup className={cn("mt-3", className)}>
      <h2 className="text-h3-xl">{title}</h2>
      <span className="text-small-xl mt-12 block whitespace-pre-wrap text-[#BBBBBB]">{subtitle}</span>
    </hgroup>
  );
}

function OIDC() {
  return (
    <div className="mt-16 grid grid-cols-2 gap-7">
      <button className="flex h-52 items-center justify-center gap-x-16 rounded-full border border-[#E0E0E9] text-black">
        <Google />
        Google
      </button>

      <button className="flex h-52 items-center justify-center gap-x-16 rounded-full bg-black text-white">
        <Apple />
        Apple
      </button>
    </div>
  );
}

type NoteProps = {
  onClick: () => unknown;
  prefix: string;
  action: string;
};

function Note({ prefix, action, onClick }: NoteProps) {
  return (
    <div className="text-small-xl mt-16 flex justify-center">
      <span>{prefix}&nbsp;</span>
      <button className="text-blue cursor-pointer" onClick={onClick}>
        {action}
      </button>
    </div>
  );
}

/* 
  Recovery
*/

type RecoveryStage = "initialization" | "verification" | "confirmation" | "success";

type RecoveryContext = {
  stage: RecoveryStage;
  email?: string;
  OTP?: string;
};

const RecoveryContext = createContext<RecoveryContext | null>(null);

type RecoveryControlContext = {
  setStage: (stage: RecoveryStage) => unknown;
  setEmail: (email: string) => void;
  setOTP: (token: string) => void;
};

function useRecovery() {
  const context = use(RecoveryContext);

  if (!context) throw new Error("Unable to use sign up context outside of provider");

  return context;
}

function useRecoveryControls() {
  const context = use(RecoveryControlContext);

  if (!context) throw new Error("Unable to use sign up controls outside of provider");

  return context;
}

const RecoveryControlContext = createContext<RecoveryControlContext | null>(null);

function RecoveryInitialStage() {
  const [email, emailError, setEmail, setEmailError] = useControlledInput("");
  const { setAction } = useAuthControls();
  const { setStage, setEmail: setContextEmail } = useRecoveryControls();

  function goBack(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    setAction("signin");
  }

  async function action() {
    setEmailError(null);

    const parsedEmail = z.email().safeParse(email);

    if (parsedEmail.error) return setEmailError("Invalid e-mail");

    const result = await sendRecoveryOTP({ email });

    if (result.error) return setEmailError(result.error);

    setContextEmail(email);
    setStage("verification");
  }

  return (
    <form action={action}>
      <Input
        error={emailError}
        value={email}
        onChange={({ currentTarget }) => setEmail(currentTarget.value)}
        type="text"
        name="email"
        label="Your e-mail"
        placeholder="Your e-mail"
      />

      <div className="text-small-xl text-gray mt-12">Enter the email associated with your account</div>

      <button className="bg-green mt-16 h-52 w-full cursor-pointer rounded-full text-white">Send code</button>

      <button className="mt-16 h-52 w-full cursor-pointer rounded-full bg-[#E2E2E2]" onClick={goBack}>
        Back to sign in
      </button>
    </form>
  );
}

function RecoveryVerificationStage() {
  const [error, setError] = useState(false);
  const { email } = useRecovery();
  const { OTP } = useRecovery();
  const { setStage, setOTP } = useRecoveryControls();

  async function action() {
    if (!email) throw new Error("Unexpected");

    if (!OTP) return setError(true);

    const result = await verifyRecoveryOTP({ email, otp: OTP });

    if ("error" in result) return setError(true);

    setStage("confirmation");
  }

  async function resend(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (!email) throw new Error("Unexpected");

    const result = await sendRecoveryOTP({ email });

    if (result.error) return console.error(result.error);
  }

  return (
    <form action={action}>
      <InputOTP maxLength={6} value={OTP} onChange={setOTP} containerClassName="max-w-400 mt-24 mx-auto">
        <InputOTPGroup>
          <InputOTPSlot index={0} aria-invalid={error} />
          <InputOTPSlot index={1} aria-invalid={error} />
          <InputOTPSlot index={2} aria-invalid={error} />
          <InputOTPSlot index={3} aria-invalid={error} />
          <InputOTPSlot index={4} aria-invalid={error} />
          <InputOTPSlot index={5} aria-invalid={error} />
        </InputOTPGroup>
      </InputOTP>

      <div className="my-24 flex justify-center">
        <button className="text-blue text-small-xl cursor-pointer" onClick={resend}>
          Resend verification code
        </button>
      </div>

      <button className="bg-green h-52 w-full cursor-pointer rounded-full text-white">Verify Code</button>
    </form>
  );
}

function RecoveryConfirmationStage() {
  const [updated, updatedError, setUpdated, setUpdatedError] = useControlledInput("");
  const [confirmation, confirmationError, setConfirmation, setConfirmationError] = useControlledInput("");
  const { email, OTP } = useRecovery();
  const { setStage } = useRecoveryControls();

  async function action() {
    setUpdatedError("");
    setConfirmationError("");

    if (!updated) return setUpdatedError("Enter password");
    if (!confirmation) return setConfirmationError("Confirm password");
    if (updated !== confirmation) return setConfirmationError("Password doesn't match");

    if (!email) throw new Error("Unexpected. Email is not defined");
    if (!OTP) throw new Error("Unexpected. OTP is not defined");

    const result = await updatePassword({ email, password: updated, otp: OTP });

    if (!result.success) return setUpdatedError(result.error);

    setStage("success");
  }

  return (
    <form action={action}>
      <Input
        value={updated}
        onChange={({ currentTarget }) => setUpdated(currentTarget.value)}
        error={updatedError}
        type="password"
        label="New Password"
        placeholder="New Password"
        name="new password"
        autoComplete="new password"
      />

      <Input
        value={confirmation}
        onChange={({ currentTarget }) => setConfirmation(currentTarget.value)}
        error={confirmationError}
        type="password"
        label="Confirm new Password"
        placeholder="Confirm new Password"
        name="new password confirmation"
        autoComplete="new password"
        className="mt-8"
      />

      <button className="bg-green mt-16 h-52 w-full cursor-pointer rounded-full text-white">Reset Password</button>
    </form>
  );
}

function RecoverySuccessStage() {
  const { setAction } = useAuthControls();

  return (
    <button className="bg-green mt-16 h-52 w-full cursor-pointer rounded-full text-white" onClick={() => setAction("signin")}>
      Go to sign in
    </button>
  );
}

const recoveryHeadingStates: Record<RecoveryStage, { title: string; subtitle: string }> = {
  initialization: {
    title: "Forgot your password?",
    subtitle: "No worries, we'll send you reset instructions",
  },
  verification: {
    title: "Verify your email",
    subtitle: "We've sent a verification code to your email",
  },
  confirmation: {
    title: "Create a new password",
    subtitle: "Choose a new password for your account.\nMake sure it’s strong and easy for you to remember.",
  },
  success: {
    title: "Password updated",
    subtitle: "Your password has been successfully changed.\nYou can now sign in with your new password.",
  },
};

function Recovery() {
  const [stage, setStage] = useState<RecoveryStage>("initialization");
  const [email, setEmail] = useState<string>();
  const [OTP, setOTP] = useState<string>();

  const context = {
    stage,
    email,
    OTP,
  };

  const controls = {
    setStage,
    setEmail,
    setOTP,
  };

  return (
    <RecoveryContext value={context}>
      <RecoveryControlContext value={controls}>
        <HGroup title={recoveryHeadingStates[stage].title} subtitle={recoveryHeadingStates[stage].subtitle} className="mb-24" />

        {stage === "initialization" && <RecoveryInitialStage />}
        {stage === "verification" && <RecoveryVerificationStage />}
        {stage === "confirmation" && <RecoveryConfirmationStage />}
        {stage === "success" && <RecoverySuccessStage />}

        <Note prefix="Need Help?" action="Contact Support" onClick={() => {}} />
      </RecoveryControlContext>
    </RecoveryContext>
  );
}

/* 
  Recovery End
*/

function SignUp() {
  const { setAction } = useAuthControls();

  return (
    <>
      <HGroup title="Create an account" subtitle="Enter your information to get started" />

      <SignUpForm />

      <FieldSeparator className="mt-16">Or Sign Up with</FieldSeparator>

      <OIDC />

      <Note prefix="Already have an account?" action="Sign in" onClick={() => setAction("signin")} />
    </>
  );
}

function SignIn() {
  const [email, emailError, setEmail, setEmailError] = useControlledInput("");
  const [password, passwordError, setPassword, setPasswordError] = useControlledInput("");
  const [rememberMe, setRememberMe] = useState(false);
  const { setAction } = useAuthControls();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  async function action() {
    setEmailError(null);
    setPasswordError(null);

    if (z.email().safeParse(email).error) return setEmailError("Please enter valid e-mail");
    if (password.length < 1) return setPasswordError("Please enter password");

    const { error, user } = await signin({ email, password, rememberMe });

    if (error === "Invalid email or password") return setEmailError("Invalid e-mail or password");

    if (!user) return console.error("Unknown signin error");

    queryClient.setQueryData(trpc.session.user.queryKey(), user);

    setAction(null);
  }

  return (
    <>
      <HGroup title="Welcome back" subtitle="Enter your credentials to access your account" />

      <form className="mt-24" action={action}>
        <div className="flex flex-col gap-y-8">
          <Input
            error={emailError}
            value={email}
            onChange={({ currentTarget }) => setEmail(currentTarget.value)}
            type="text"
            name="email"
            label="Your e-mail"
            placeholder="Your e-mail"
            autoComplete="email"
          />

          <Input
            error={passwordError}
            value={password}
            onChange={({ currentTarget }) => setPassword(currentTarget.value)}
            type="password"
            name="password"
            label="Password"
            placeholder="Password"
            autoComplete="password"
          />

          <div className="flex justify-between">
            <label className="flex cursor-pointer items-center gap-x-5 select-none">
              <Checkbox value={rememberMe} onChange={setRememberMe} name="rememberMe" />
              <span className="text-small-xl text-gray">Remember me</span>
            </label>

            <button className="text-small-xl text-blue cursor-pointer" onClick={() => setAction("recovery")}>
              Forgot Password?
            </button>
          </div>
        </div>

        <button className="bg-green mt-16 h-52 w-full cursor-pointer rounded-full text-white">Sign in</button>
      </form>

      <FieldSeparator className="mt-16">Or continue with</FieldSeparator>

      <OIDC />

      <Note prefix="Don't have an account?" action="Sign up" onClick={() => setAction("signup")} />
    </>
  );
}

export default function Authentication() {
  const { action } = useAuth();
  const { setAction } = useAuthControls();

  if (!action) return null;

  function render() {
    switch (action) {
      case "signin":
        return <SignIn />;
      case "signup":
        return <SignUp />;
      case "recovery":
        return <Recovery />;
    }
  }

  return (
    <aside className="fixed inset-0 z-990 bg-black/70">
      <div className="absolute top-0 right-0 h-full w-full bg-white px-32 py-36 md:w-528 md:px-64 md:py-31">
        <button className="ml-auto grid size-36 cursor-pointer place-content-center rounded-full bg-black text-white" onClick={() => setAction(null)}>
          <Close />
        </button>

        {render()}
      </div>
    </aside>
  );
}

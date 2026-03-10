import Input from "./input";
import Link from "next/link";
import Checkbox from "@/components/checkbox";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/otp";
import { type MouseEvent, useState, createContext, use } from "react";
import { useControlledInput } from "@/hooks/use-controlled-input";
import { signup, verifyOTP, sendVerificationOTP } from "@/actions/auth";
import { useAuthControls } from "@/state/auth";
import { useTRPC } from "@/state/trpc";
import { useQueryClient } from "@tanstack/react-query";
import z from "zod";

type SignUpStage = "initialization" | "verification" | "confirmation";

type SignUpContext = {
  stage: SignUpStage;
  name?: string;
  email?: string;
  token?: string;
};

type SignUpControlContext = {
  setStage: (stage: SignUpStage) => void;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setToken: (token: string) => void;
};

const SignUpContext = createContext<SignUpContext | null>(null);

const SignUpControlContext = createContext<SignUpControlContext | null>(null);

function useSignUp() {
  const context = use(SignUpContext);

  if (!context) throw new Error("Unable to use sign up context outside of provider");

  return context;
}

function useSignUpControls() {
  const context = use(SignUpControlContext);

  if (!context) throw new Error("Unable to use sign up controls outside of provider");

  return context;
}

function SignUpInitialization() {
  const [name, nameError, setName, setNameError] = useControlledInput("");
  const [email, emailError, setEmail, setEmailError] = useControlledInput("");
  const [agreement, agreementError, setAgreement, setAgreementError] = useControlledInput(false);
  const { setStage, setEmail: setContextEmail, setName: setContextName } = useSignUpControls();

  async function action() {
    setNameError(null);
    setEmailError(null);

    if (name.length < 1) return setNameError("Please enter your name");
    if (z.email().safeParse(email).error) return setEmailError("Please enter corrent e-mail");

    if (!agreement) return setAgreementError("Empty");

    const result = await sendVerificationOTP({ email });

    if (result.error) return setEmailError(result.error);

    setContextEmail(email);
    setContextName(name);
    setStage("verification");
  }

  return (
    <form className="mt-24" action={action}>
      <div className="flex flex-col gap-y-8">
        <Input
          error={nameError}
          value={name}
          onChange={({ currentTarget }) => setName(currentTarget.value)}
          type="text"
          name="name"
          label="Full name "
          placeholder="Full name"
          autoComplete="full name"
        />

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

        <label className="group flex items-center gap-x-5" data-error={!!agreementError || null}>
          <Checkbox error={!!agreementError} value={agreement} onChange={setAgreement} name="agreement" />

          <span className="text-small-xl e">
            I agree to the&nbsp;
            <Link href="" className="text-blue">
              Terms of Service
            </Link>
            &nbsp;and&nbsp;
            <Link href="" className="text-blue">
              Privacy Policy
            </Link>
          </span>
        </label>
      </div>

      <button className="bg-green mt-16 h-52 w-full cursor-pointer rounded-full text-white">Send Verification Code</button>
    </form>
  );
}

function SignUpVerification() {
  const [otp, setOTP] = useState("");
  const [error, setError] = useState(false);
  const { email } = useSignUp();
  const { setStage, setToken } = useSignUpControls();

  async function action() {
    if (!email) throw new Error("Unexpected");

    const result = await verifyOTP({ email, otp });

    if ("error" in result) return setError(true);

    setToken(result.token);
    setStage("confirmation");
  }

  async function resend(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    event.stopPropagation();

    if (!email) throw new Error("Unexpected");

    const result = await sendVerificationOTP({ email });

    if (result.error) return console.error(result.error);
  }

  return (
    <form action={action}>
      <InputOTP maxLength={6} value={otp} onChange={setOTP} containerClassName="max-w-400 mt-24 mx-auto">
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

function SignUpConfirmation() {
  const [password, passwordError, setPassword, setPasswordError] = useControlledInput("");
  const [confirmation, confirmationError, setConfirmation, setConfirmationError] = useControlledInput("");
  const { setAction } = useAuthControls();
  const { setStage } = useSignUpControls();
  const { token, email, name } = useSignUp();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  async function action() {
    setConfirmationError(null);
    setPasswordError(null);

    if (!name || !email || !token) throw new Error("Unexpected");
    if (password !== confirmation) setConfirmationError("Password doesn't match");

    if (password.length < 4) setPasswordError("Password is too short!");

    const result = await signup({
      name,
      email,
      password,
      token,
    });

    if (result.error) return setPasswordError(result.error);

    if (!result.user) throw new Error("Unexpected");

    setStage("initialization");
    setAction(null);
    queryClient.setQueryData(trpc.session.user.queryKey(), result.user);
  }

  return (
    <form className="mt-24" action={action}>
      <div className="flex flex-col gap-y-8">
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

        <Input
          error={confirmationError}
          value={confirmation}
          onChange={({ currentTarget }) => setConfirmation(currentTarget.value)}
          type="password"
          name="password-confirmation"
          label="Confirm Password"
          placeholder="Confirm Password"
          autoComplete="password"
        />
      </div>

      <button className="bg-green mt-16 h-52 w-full cursor-pointer rounded-full text-white">Create Account</button>
    </form>
  );
}

export default function SignUp() {
  const [stage, setStage] = useState<SignUpStage>("initialization");
  const [name, setName] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [token, setToken] = useState<string>();

  const context = {
    stage,
    name,
    email,
    token,
  };

  const controls = {
    setStage,
    setName,
    setEmail,
    setToken,
  };

  return (
    <SignUpContext value={context}>
      <SignUpControlContext value={controls}>
        {stage === "initialization" && <SignUpInitialization />}
        {stage === "verification" && <SignUpVerification />}
        {stage === "confirmation" && <SignUpConfirmation />}
      </SignUpControlContext>
    </SignUpContext>
  );
}

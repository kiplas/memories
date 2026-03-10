import type { Session as AuthSession, User } from "better-auth";
import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import type { Router } from "@/server/trpc";

export type { User } from "better-auth";

export type Maybe<T> = T | undefined | null;

export type Balance = { current: number; overall: number };

export type UserWithBalance = User & { balance: Balance };

export type SessionWithBalance = Session & { balance: Balance };

export type Session = {
  session: AuthSession;
  user: User;
};

export type QueryInputs = inferRouterInputs<Router>;
export type QueryOutputs = inferRouterOutputs<Router>;

export type Upload = {
  url: string;
};

export type Illustration = {
  id: number;
  label: string;
  upload: {
    url: string;
  };
};

export type CapsuleIllustration = Illustration & { background?: string | null; foreground?: string | null };

export type DigitalAddress = {
  email: string;
};

export type PhysicalAddress = {
  name: string;
  zip: string;
  country: string;
  city: string;
  state: string;
  address: string;
};

export type PhysicalAddressee = {
  digital?: null | undefined;
  physical: PhysicalAddress;
};

export type DigitalAddressee = {
  digital: DigitalAddress;
  physical?: null | undefined;
};

export type Addressee = DigitalAddressee | PhysicalAddressee;

export type Order = {
  payee: string;
  obligation: Obligation;
  createdAt: Date;
};

export type Obligation = {
  variant: "printed" | "digital";
  delivery: Date;
  createdAt: Date;
};

export type Capsule = {
  illustration: Illustration;
  message?: Maybe<string>;
  obligation: Obligation;
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export type APIOutput<S extends object = {}, E extends object = {}> =
  | ({
      success: true;
      error?: never;
    } & S)
  | ({
      success: false;
      error: string;
    } & E);

"use client";

import type { Illustration, Addressee } from "@/types";
import { createContext, PropsWithChildren, useState, use } from "react";
import { useTRPC } from "@/state/trpc";
import { useQuery } from "@tanstack/react-query";
import type { getDigitalLetterPreset } from "@/lib/preset";

export type Stage = {
  name: "message" | "variant" | "recipients" | "delivery" | "payment";
  canProcessToStage: () => boolean;
};

type LetterContext = {
  stages: Stage[];
  stage: Stage | null;
  illustration: Illustration;
  illustrations: Illustration[];
  message: string;
  addressees: Addressee[];
  payee: string | null;
  delivery: Date;
  processed: boolean;
  canProcessToStage: (stage: { name: Stage["name"] }) => boolean;
};

const LetterContext = createContext<LetterContext | null>(null);

type LetterControlContext = {
  setStage: (stage: { name: Stage["name"] } | null) => void;
  setNextStage: () => void;
  setPreviousStage: () => void;
  setIllustration: (pattern: Illustration) => void;
  setMessage: (message: string) => void;
  setAddressees: (addressees: Addressee[]) => void;
  setPayee: (email: string) => void;
  setDelivery: (date: Date) => void;
  setProcessed: (status: boolean) => void;
};

const LetterControlContext = createContext<LetterControlContext | null>(null);

type Preset = Awaited<ReturnType<typeof getDigitalLetterPreset>>;

type Props = {
  illustrations: Illustration[];
  preset: Preset | null;
};

export function Provider({ children, illustrations, preset }: PropsWithChildren<Props>) {
  const trpc = useTRPC();
  const { data: user } = useQuery(trpc.session.user.queryOptions());

  const stages: Stage[] = [
    {
      name: "message",
      canProcessToStage() {
        return true;
      },
    },
    {
      name: "variant",
      canProcessToStage() {
        return canProcessToPreviousStages(this) && message !== "";
      },
    },
    {
      name: "recipients",
      canProcessToStage() {
        return canProcessToPreviousStages(this);
      },
    },
    {
      name: "delivery",
      canProcessToStage() {
        return canProcessToPreviousStages(this) && addressees.length !== 0 && payee !== null;
      },
    },
    {
      name: "payment",
      canProcessToStage() {
        return canProcessToPreviousStages(this);
      },
    },
  ];

  const [stage, setStage] = useState<Stage | null>(!!preset ? stages[0] : null);
  const [illustration, setIllustration] = useState<Illustration>(preset?.order.obligation.letter.illustration || illustrations[0]);
  const [message, setMessage] = useState<string>(preset?.order.obligation.letter?.message || "");
  const [addressees, setAddressees] = useState<Addressee[]>(preset?.order.obligation.addressees || []);
  const [payee, setPayee] = useState<string | null>(user?.email || null);
  const [delivery, setDelivery] = useState(new Date());
  const [processed, setProcessed] = useState(false);

  const context = {
    stages,
    stage,
    illustration,
    message,
    addressees,
    payee,
    delivery,
    processed,
    illustrations,
    canProcessToStage,
  };

  function canProcessToPreviousStages(stage: Stage) {
    const index = stages.findIndex(({ name }) => name === stage.name);

    if (index === -1) return false;

    for (let i = 0; i < index; i++) {
      if (!stages[i].canProcessToStage()) return false;
    }

    return true;
  }

  function canProcessToStage(stage: { name: Stage["name"] }) {
    const match = stages.find(({ name }) => name === stage.name);

    if (!match) return false;

    return match.canProcessToStage();
  }

  function setStageByIndex(index: number) {
    const stage = stages.at(index);

    if (!stage) return false;

    setStage(stage);
    return true;
  }

  function setNextStage() {
    if (!stage) setStage(stages[0]);
    const index = stages.findIndex(({ name }) => name === stage?.name);
    return setStageByIndex(index + 1);
  }

  function setPreviousStage() {
    const index = stages.findIndex(({ name }) => name === stage?.name);
    if (index === 0) return setStage(null);
    return setStageByIndex(index - 1);
  }

  function setStageByName(stage: { name: Stage["name"] } | null) {
    const match = stages.find(({ name }) => name === stage?.name);
    if (!match) return false;
    setStage(match);
    return true;
  }

  const controls = {
    setStage: setStageByName,
    setNextStage,
    setPreviousStage,
    setIllustration,
    setMessage,
    setAddressees,
    setPayee,
    setDelivery,
    setProcessed,
  };

  return (
    <LetterContext value={context}>
      <LetterControlContext value={controls}>{children}</LetterControlContext>
    </LetterContext>
  );
}

export function useLetter() {
  const context = use(LetterContext);
  if (!context) throw new Error("Cannot access letter context outside of a provider");
  return context;
}

export function useLetterControls() {
  const context = use(LetterControlContext);
  if (!context) throw new Error("Cannot access letter control context outside of a provider");
  return context;
}

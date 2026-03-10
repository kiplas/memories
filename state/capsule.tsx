"use client";

import type { Addressee, CapsuleIllustration } from "@/types";
import { createContext, PropsWithChildren, useState, use } from "react";
import { useTRPC } from "@/state/trpc";
import { useQuery } from "@tanstack/react-query";
import type { getDigitalCapsulePreset, getPrintedCapsulePreset } from "@/lib/preset";

export type Stage = {
  name: "upload" | "variant" | "message" | "recipients" | "delivery" | "payment";
  canProcessToStage: () => boolean;
};

export type Upload = File | { id: number; url: string };

export type Size = "s" | "m" | "l";

type CapsuleContext = {
  stages: readonly Stage[];
  stage: Stage | null;
  uploads: (Upload | null)[];
  illustration: CapsuleIllustration;
  illustrations: CapsuleIllustration[];
  message: string | null;
  addressees: Addressee[];
  delivery: Date;
  size: Size;
  processed: boolean;
  canProcessToStage: (stage: { name: Stage["name"] }) => boolean;
};

const CapsuleContext = createContext<CapsuleContext | null>(null);

type CapsuleControlContext = {
  setStage: (stage: { name: Stage["name"] } | null) => void;
  setNextStage: () => void;
  setPreviousStage: () => void;
  setUploads: (upload: (Upload | null)[]) => void;
  setIllustration: (pattern: CapsuleIllustration) => void;
  setMessage: (message: string | null) => void;
  setAddressees: (addressees: Addressee[]) => void;
  setDelivery: (date: Date) => void;
  setSize: (size: Size) => void;
  setProcessed: (status: boolean) => void;
};

const CapsuleControlContext = createContext<CapsuleControlContext | null>(null);

type Preset = Awaited<ReturnType<typeof getDigitalCapsulePreset>> | Awaited<ReturnType<typeof getPrintedCapsulePreset>>;

type Props = {
  illustrations: CapsuleIllustration[];
  preset: Preset | null;
};

export function Provider({ children, illustrations, preset }: PropsWithChildren<Props>) {
  const trpc = useTRPC();
  const { data: user } = useQuery(trpc.session.user.queryOptions());

  const stages: Stage[] = [
    {
      name: "upload",
      canProcessToStage() {
        return true;
      },
    },
    {
      name: "variant",
      canProcessToStage() {
        return canProcessToPreviousStages(this);
      },
    },
    {
      name: "message",
      canProcessToStage() {
        return canProcessToPreviousStages(this) && uploads.filter((file) => file !== null).length > 0;
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
        return canProcessToPreviousStages(this) && addressees.length !== 0
      },
    },
    {
      name: "payment",
      canProcessToStage() {
        return canProcessToPreviousStages(this);
      },
    },
  ];

  const [stage, setStage] = useState<Stage | null>(!!preset ? stages[1] : null);
  const [uploads, setUploads] = useState<(Upload | null)[]>(preset?.order.obligation.capsule.uploads.map(({ upload }) => upload) || []);
  const [illustration, setIllustration] = useState<CapsuleIllustration>(preset?.order.obligation.capsule.illustration || illustrations[0]);
  const [message, setMessage] = useState<string | null>(preset?.order.obligation.capsule?.message || null);
  const [addressees, setAddressees] = useState<Addressee[]>(preset?.order.obligation.addressees || []);
  const [delivery, setDelivery] = useState(new Date());
  const [processed, setProcessed] = useState(false);
  const [size, setSize] = useState<Size>("s");

  const context: CapsuleContext = {
    stages,
    stage,
    uploads,
    illustration,
    illustrations,
    message,
    addressees,
    delivery,
    size,
    processed,
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

  const controls: CapsuleControlContext = {
    setStage: setStageByName,
    setNextStage,
    setPreviousStage,
    setUploads,
    setIllustration,
    setMessage,
    setAddressees,
    setDelivery,
    setSize,
    setProcessed,
  };

  return (
    <CapsuleContext value={context}>
      <CapsuleControlContext value={controls}>{children}</CapsuleControlContext>
    </CapsuleContext>
  );
}

export function useCapsule() {
  const context = use(CapsuleContext);

  if (!context) throw new Error("Unable to access capsule context outside of a provider component");

  return context;
}

export function useCapsuleControls() {
  const context = use(CapsuleControlContext);

  if (!context) throw new Error("Unable to access capsule control context outside of a provider component");

  return context;
}

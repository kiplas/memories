"use client";

import { cn } from "@/lib/utils";
import { useLetterControls } from "@/state/letter";
import { type ClassValue } from "clsx";
import Button from "./ui/button";

type Props = {
  className?: ClassValue;
  disabled?: boolean;
};

export default function Controls({ className, disabled }: Props) {
  const { setNextStage, setPreviousStage } = useLetterControls();

  return (
    <div className={cn("mx-auto grid max-w-527 grid-cols-2 gap-x-12", className)}>
      <Button onClick={setPreviousStage}>Back</Button>
      <Button className={cn("bg-green border-none text-white", disabled && "pointer-events-none opacity-50")} onClick={setNextStage} disabled={disabled}>
        Next
      </Button>
    </div>
  );
}

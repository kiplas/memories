import type { Illustration } from "@/types";
import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";

const MAX_LINE_LENGTH = 64;

function splitByLine(message: string): string[] {
  const words = message.split(/\s+/);
  const lines: string[] = [];

  for (let i = 0, j = 0; i < words.length; i++) {
    const line = (lines[j] ??= "");
    const word = words[i];

    if (line.length + word.length > MAX_LINE_LENGTH) {
      j++;
      i--;
      continue;
    }

    lines[j] += line === "" ? word : ` ${word}`;
  }

  return lines;
}

function split(message: string): (string | null)[] {
  const lines = message.split(/\r?\n/);

  return lines
    .map((line) => {
      if (line.trim() === "") return null;

      return splitByLine(line);
    })
    .flat();
}

const START_Y = 259.784;
const STEP_Y = 14;

type Props = {
  message: string;
  illustration: Illustration;
  className?: ClassValue;
};

export default function Letter({ className, message, illustration }: Props) {
  const lines = split(message);

  return (
    <svg className={cn("aspect-letter", className)} viewBox="0 0 595 842" fill="none" xmlns="http://www.w3.org/2000/svg">
      <image href={illustration.upload.url} width="595" height="842" />

      <text fill="black" fontFamily="Inter" fontSize="11" fontWeight="500" letterSpacing="-0.04em">
        {lines.map((line, index) => (
          <tspan x="121" y={START_Y + STEP_Y * index} key={index}>
            {line}
          </tspan>
        ))}
      </text>
    </svg>
  );
}

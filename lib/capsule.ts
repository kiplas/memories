import type { Illustration, Maybe } from "@/types";

function split(message: string): string[] {
  const MAX_LINE_LENGTH = 72;

  const words = message.split(" ");
  const lines: string[] = [];

  for (let i = 0, j = 0; i < words.length; i++) {
    lines[j] ??= "";

    const line = lines[j];
    const word = words[i];

    if (line.length + word.length > MAX_LINE_LENGTH) {
      j++;
      i--;
      continue;
    }

    const separator = lines[j] === "" ? "" : " ";

    lines[j] = lines[j] + separator + word;
  }

  lines[0] = '"' + lines[0];
  lines[lines.length - 1] = lines[lines.length - 1] + '"';

  return lines;
}

type MessageInput = {
  message: string;
};

function renderMessage({ message }: MessageInput) {
  const lines = split(message.trim());

  return `
    <text fill="white" fontFamily="Inter" fontSize="12" fontWeight="600" letterSpacing="-0.03em" textAnchor="middle">
      ${
        lines[0] &&
        `
        <tspan x="421" y="517.864">
          ${lines[0]}
        </tspan>
        `
      }

      ${
        lines[1] &&
        `
        <tspan x="421" y="532.864>
          ${lines[1]}
        </tspan>
        `
      }

      ${
        lines[2] &&
        `
        <tspan x="421" y="547.864">
          ${lines[2]}
        </tspan>
        `
      }
    </text>  
  `;
}

type CommonInput = { illustration: Illustration; message?: Maybe<string> };

type SingleInput = CommonInput & { image: string };

function renderSingle({ illustration, image, message }: SingleInput) {
  const imageProps = message ? { x: "226", y: "90", width: "390", height: "390" } : { x: "193", y: "69", width: "456", height: "456" };
  const outlineProps = message ? { x: "228.185", y: "92.1849", width: "385.63", height: "385.63" } : { x: "195.185", y: "71.1849", width: "451.63", height: "451.63" };

  return `
    <svg viewBox="0 0 842 595" fill="none" xmlns="http://www.w3.org/2000/svg">
      <image href="${process.env.BASE_URL}${illustration.upload.url}" width="842" height="595" />

      <image href="${process.env.BASE_URL}${image}" ${Object.entries(imageProps)
        .map(([key, value]) => `${key}="${value}"`)
        .join(" ")} preserveAspectRatio="xMinYMin slice"></image>

      <rect strokeWidth="4.36975" stroke="white" ${Object.entries(outlineProps)
        .map(([key, value]) => `${key}="${value}"`)
        .join(" ")}></rect>

      ${message ? renderMessage({ message }) : ""}
    </svg>
  `;
}

type RenderInput = {
  images: string[];
  illustration: Illustration;
  message?: Maybe<string>;
};

export function renderCapsule({ images, illustration, message }: RenderInput) {
  switch (images.length) {
    case 1:
      return renderSingle({ message, image: images[0], illustration });
  }
}

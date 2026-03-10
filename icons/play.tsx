import type { RefAttributes, SVGProps } from "react";

type SVGAttributes = Partial<SVGProps<SVGSVGElement>>;
type SvgProps = RefAttributes<SVGSVGElement> & SVGAttributes;

export default function Play(props: SvgProps) {
  return (
    <svg width="38" height="38" {...props} viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M38 19L9.5 35.4545L9.5 2.54552L38 19Z" fill="currentColor" />
    </svg>
  );
}

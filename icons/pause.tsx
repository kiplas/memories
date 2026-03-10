import type { RefAttributes, SVGProps } from "react";

type SVGAttributes = Partial<SVGProps<SVGSVGElement>>;
type SvgProps = RefAttributes<SVGSVGElement> & SVGAttributes;

export default function Pause(props: SvgProps) {
  return (
    <svg width="32" height="32" {...props} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="8" y="5" width="4" height="22" fill="currentColor" />
      <rect x="20" y="5" width="4" height="22" fill="currentColor" />
    </svg>
  );
}

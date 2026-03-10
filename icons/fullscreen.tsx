import type { RefAttributes, SVGProps } from "react";

type SVGAttributes = Partial<SVGProps<SVGSVGElement>>;
type SvgProps = RefAttributes<SVGSVGElement> & SVGAttributes;

export default function Fullscreen(props: SvgProps) {
  return (
    <svg width="32" height="32" {...props} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 13V10C6 7.79086 7.79086 6 10 6H13" stroke="currentColor" strokeWidth="1.5" />
      <path d="M26 13V10C26 7.79086 24.2091 6 22 6H19" stroke="currentColor" strokeWidth="1.5" />
      <path d="M6 19V22C6 24.2091 7.79086 26 10 26H13" stroke="currentColor" strokeWidth="1.5" />
      <path d="M26 19V22C26 24.2091 24.2091 26 22 26H19" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

import type { RefAttributes, SVGProps } from "react";

type SVGAttributes = Partial<SVGProps<SVGSVGElement>>;
type SvgProps = RefAttributes<SVGSVGElement> & SVGAttributes;

export default function PlayRounded(props: SvgProps) {
  return (
    <svg width="32" height="32" {...props} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M24.7811 14.2442C26.1708 15.0022 26.1708 16.9978 24.7811 17.7558L8.9577 26.3867C7.62495 27.1137 6 26.149 6 24.6309L6 7.36908C6 5.85097 7.62496 4.88634 8.95771 5.61329L24.7811 14.2442Z"
        fill="currentColor"
      />
    </svg>
  );
}

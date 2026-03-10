import type { RefAttributes, SVGProps } from "react";

type SVGAttributes = Partial<SVGProps<SVGSVGElement>>;
type SvgProps = RefAttributes<SVGSVGElement> & SVGAttributes;

export default function ArrowRounded(props: SvgProps) {
  return (
    <svg width="11" height="11" {...props} viewBox="0 0 11 11" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6.46484 1.46481C6.66011 1.26954 6.97661 1.26954 7.17188 1.46481L10.3535 4.64645C10.5488 4.84171 10.5488 5.15822 10.3535 5.35348L7.17188 8.53512C6.97661 8.73038 6.66011 8.73038 6.46484 8.53512C6.26958 8.33986 6.26958 8.02335 6.46484 7.82809L8.79297 5.49996H0V4.49996H8.79297L6.46484 2.17184C6.26958 1.97658 6.26958 1.66007 6.46484 1.46481Z"
        fill="currentColor"
      />
    </svg>
  );
}

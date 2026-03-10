import type { RefAttributes, SVGProps } from "react";

type SVGAttributes = Partial<SVGProps<SVGSVGElement>>;
type SvgProps = RefAttributes<SVGSVGElement> & SVGAttributes;

export default function Close(props: SvgProps) {
  return (
    <svg width="20" height="20" {...props} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7.04167 14L6 12.9583L8.9375 10L6 7.0625L7.04167 6.02083L10 8.95833L12.9375 6.02083L13.9792 7.0625L11.0417 10L13.9792 12.9583L12.9375 14L10 11.0625L7.04167 14Z"
        fill="currentColor"
      />
    </svg>
  );
}

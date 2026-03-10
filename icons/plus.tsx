import type { RefAttributes, SVGProps } from "react";

type SVGAttributes = Partial<SVGProps<SVGSVGElement>>;
type SvgProps = RefAttributes<SVGSVGElement> & SVGAttributes;

export default function Plus(props: SvgProps) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" {...props} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 13H5V11H11V5H13V11H19V13H13V19H11V13Z" fill="currentColor" />
    </svg>
  );
}

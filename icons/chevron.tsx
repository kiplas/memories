import type { RefAttributes, SVGProps } from "react";

type SVGAttributes = Partial<SVGProps<SVGSVGElement>>;
type SvgProps = RefAttributes<SVGSVGElement> & SVGAttributes;

export default function Chevron(props: SvgProps) {
  return (
    <svg width="30" height="30" {...props} viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.5209 22.4996L10 14.9786L17.5209 7.45801L19 8.93707L12.9584 14.9786L19 21.0205L17.5209 22.4996Z" fill="currentColor" />
    </svg>
  );
}

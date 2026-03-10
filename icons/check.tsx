import type { RefAttributes, SVGProps } from "react";

type SVGAttributes = Partial<SVGProps<SVGSVGElement>>;
type SvgProps = RefAttributes<SVGSVGElement> & SVGAttributes;

export default function Check(props: SvgProps) {
  return (
    <svg width="48" height="48" {...props} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M22.4609 31.0913C22.0156 31.0913 21.6797 30.9272 21.375 30.5601L17.3359 25.5991C17.0938 25.3179 17 25.0522 17 24.771C17 24.1226 17.4766 23.6538 18.1406 23.6538C18.5312 23.6538 18.8125 23.8022 19.0703 24.1226L22.4297 28.3569L29.0078 17.9507C29.2812 17.5132 29.5625 17.3569 30.0078 17.3569C30.6641 17.3569 31.1328 17.8179 31.1328 18.4585C31.1328 18.7007 31.0547 18.9585 30.875 19.2397L23.5625 30.521C23.3047 30.9038 22.9375 31.0913 22.4609 31.0913Z"
        fill="currentColor"
      />
      <circle cx="24" cy="24" r="19" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

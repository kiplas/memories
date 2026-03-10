import type { RefAttributes, SVGProps } from "react";

type SVGAttributes = Partial<SVGProps<SVGSVGElement>>;
type SvgProps = RefAttributes<SVGSVGElement> & SVGAttributes;

export default function Plane(props: SvgProps) {
  return (
    <svg width="100" height="100" {...props} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 45.4889L39.8461 51.0323L69.0769 34.402L48.6153 55.1899L72 71.8202L91 15L15 45.4889Z" fill="currentColor" />
      <path
        d="M41.2507 48.2606C41.8301 52.1068 42.5643 58.3921 43.1517 63.6756C43.2905 64.9236 43.4153 66.1205 43.5342 67.2187L58.1383 52.3099L62.4201 56.0831L38.9983 80L38.3704 73.8665L38.3675 73.8557C38.3675 73.8557 38.3663 73.8341 38.3646 73.8178C38.3612 73.785 38.357 73.7358 38.3503 73.6716C38.3371 73.5432 38.3158 73.3527 38.2904 73.1086C38.2396 72.6203 38.1657 71.9143 38.0735 71.0434C37.889 69.2999 37.6332 66.8963 37.3399 64.2575C36.7512 58.9629 36.0236 52.7761 35.4616 49.0456L41.2507 48.2606Z"
        fill="currentColor"
      />
    </svg>
  );
}

import type { RefAttributes, SVGProps } from "react";

type SVGAttributes = Partial<SVGProps<SVGSVGElement>>;
type SvgProps = RefAttributes<SVGSVGElement> & SVGAttributes;

export default function Facebook(props: SvgProps) {
  return (
    <svg width="32" height="32" {...props} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_3008_817)">
        <path
          d="M16 -0.0126953C7.16352 -0.0126953 0 7.15082 0 15.9873C0 23.4907 5.16608 29.787 12.135 31.5163V20.8769H8.83584V15.9873H12.135V13.8804C12.135 8.43467 14.5997 5.91051 19.9462 5.91051C20.96 5.91051 22.7091 6.10955 23.4246 6.30795V10.7399C23.047 10.7003 22.391 10.6804 21.5763 10.6804C18.953 10.6804 17.9392 11.6743 17.9392 14.258V15.9873H23.1654L22.2675 20.8769H17.9392V31.8702C25.8618 30.9134 32.0006 24.1678 32.0006 15.9873C32 7.15082 24.8365 -0.0126953 16 -0.0126953Z"
          fill="black"
        />
      </g>
      <defs>
        <clipPath id="clip0_3008_817">
          <rect width="32" height="32" fill="white" transform="translate(0 -0.0126953)" />
        </clipPath>
      </defs>
    </svg>
  );
}

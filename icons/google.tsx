import type { RefAttributes, SVGProps } from "react";

type SVGAttributes = Partial<SVGProps<SVGSVGElement>>;
type SvgProps = RefAttributes<SVGSVGElement> & SVGAttributes;

export default function Google(props: SvgProps) {
  return (
    <svg width="23" height="23" {...props} viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M22.54 11.7614C22.54 10.9459 22.4668 10.1618 22.3309 9.40909H11.5V13.8575H17.6891C17.4225 15.295 16.6123 16.513 15.3943 17.3284V20.2139H19.1109C21.2855 18.2118 22.54 15.2636 22.54 11.7614Z"
        fill="#4285F4"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.4995 22.9998C14.6045 22.9998 17.2077 21.9701 19.1104 20.2137L15.3938 17.3283C14.364 18.0183 13.0467 18.426 11.4995 18.426C8.50425 18.426 5.96902 16.403 5.0647 13.6848H1.22266V16.6644C3.11493 20.4228 7.00402 22.9998 11.4995 22.9998Z"
        fill="#34A853"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M5.06523 13.6851C4.83523 12.9951 4.70455 12.258 4.70455 11.5001C4.70455 10.7421 4.83523 10.0051 5.06523 9.31506V6.33551H1.22318C0.444318 7.88801 0 9.64437 0 11.5001C0 13.3557 0.444318 15.1121 1.22318 16.6646L5.06523 13.6851Z"
        fill="#FBBC05"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.4995 4.57386C13.1879 4.57386 14.7038 5.15409 15.8956 6.29364L19.194 2.99523C17.2024 1.13955 14.5992 0 11.4995 0C7.00402 0 3.11493 2.57705 1.22266 6.33545L5.0647 9.315C5.96902 6.59682 8.50425 4.57386 11.4995 4.57386Z"
        fill="#EA4335"
      />
    </svg>
  );
}

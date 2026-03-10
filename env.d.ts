import "react";

declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    NEXT_PUBLIC_BASE_URL: string;
    STRIPE_KEY: string;
    NEXT_PUBLIC_STRIPE_KEY: string;
    BETTER_AUTH_SECRET: string;
    STRIPE_WEBHOOK_SECRET: string;
    NEXT_PHASE: string;
    MAILGUN_DOMAIN: string;
    BASE_URL: string;
  }
}

declare module "react" {
  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
}

import Mailgun from "mailgun.js";
import formData from "form-data";
import path from "path";
import { readFileSync } from "fs";
import Handlebars from "handlebars";
import { capitalize } from "@/lib/strings";

const mailgun = new Mailgun(formData);

const mg = mailgun.client({ username: "api", key: process.env.MAILGUN_KEY });

function loadTemplate(name: string) {
  const filepath = path.join(process.cwd(), "templates", `${name}.hbs`);
  return readFileSync(filepath, "utf-8");
}

type Variables = {
  "capsule-notification": {
    BASE_URL: string;
    payee: {
      name?: string;
      email: string;
    };
    url: string;
    year: string;
  };

  "letter-notification": {
    BASE_URL: string;
    payee: {
      name?: string;
      email: string;
    };
    url: string;
    year: string;
  };

  "email-verification": {
    BASE_URL: string;
    code: string[];
    year: string;
  };

  "view-notification": {
    BASE_URL: string;
    addressee: string;
    date: string;
    year: string;
  };

  "package-receipt": {
    BASE_URL: string;
    order: string | number;
    amount: string | number;
    credits: string | number;
    method: string;
    features: string[];
    name: string;
    year: string;
    palette: {
      background: string;
      foreground: string;
    };
  };

  "sending-notification": {
    BASE_URL: string;
    title: string;
    designTitle: string;
    illustration: string;
    paymentMethod: string;
    sendDate: string;
    product: string;
    year: string;
    quantity: number;
    price: string;
    total: string;
    addressees: { address: string; index: number }[];
  };
};

const templates: { [name in keyof Variables]: HandlebarsTemplateDelegate<Variables[name]> } = {
  "capsule-notification": Handlebars.compile(loadTemplate("capsule-notification")),
  "letter-notification": Handlebars.compile(loadTemplate("letter-notification")),
  "email-verification": Handlebars.compile(loadTemplate("email-verification")),
  "sending-notification": Handlebars.compile(loadTemplate("sending-notification")),
  "package-receipt": Handlebars.compile(loadTemplate("package-receipt")),
  "view-notification": Handlebars.compile(loadTemplate("view-notification")),
};

type SendInput<T extends keyof Variables> = {
  template: T;
  to: string[];
  subject: string;
  from: string;
  variables: Variables[T];
};

export async function send<T extends keyof Variables>({ template, variables, from, to, subject }: SendInput<T>) {
  if (!process.env.MAILGUN_DOMAIN) return { error: "no mailgun domain was specified" };

  return await mg.messages.create(process.env.MAILGUN_DOMAIN, {
    from: `Memories <${from}@yourdomain.com>`,
    to,
    subject,
    html: templates[template](variables),
  });
}

type notifyCapsuleAddresseeInput = {
  to: string[];
  capsuleID: number;
  token: string;
  payee: Variables["capsule-notification"]["payee"];
};

export async function notifyCapsuleAddressee({ to, payee, capsuleID, token }: notifyCapsuleAddresseeInput) {
  if (!process.env.BASE_URL) return { error: "No public url environmnent variable was found" };

  await send({
    from: "noreply",
    to,
    subject: "You Received a Capsule!",
    template: "capsule-notification",
    variables: {
      BASE_URL: process.env.BASE_URL,
      payee,
      year: new Date().getFullYear().toString(),
      url: `${process.env.BASE_URL}/capsule?capsule=${capsuleID}&token=${token}`,
    },
  });
}

type notifyLetterAddresseeInput = {
  to: string[];
  letterID: number;
  token: string;
  payee: Variables["letter-notification"]["payee"];
};

export async function notifyLetterAddressee({ to, payee, letterID, token }: notifyLetterAddresseeInput) {
  if (!process.env.BASE_URL) return { error: "No public url environmnent variable was found" };

  await send({
    from: "noreply",
    to,
    subject: "You Received a Letter!",
    template: "letter-notification",
    variables: {
      BASE_URL: process.env.BASE_URL,
      payee,
      year: new Date().getFullYear().toString(),
      url: `${process.env.BASE_URL}/letter?letter=${letterID}&token=${token}`,
    },
  });
}

type SendEmailVerificationInput = {
  email: string;
  otp: string;
};

export async function sendEmailVerification({ email, otp }: SendEmailVerificationInput) {
  if (!process.env.BASE_URL) return { error: "No public url environmnent variable was found" };

  await send({
    from: "noreply",
    to: [email],
    subject: "Your One Time Password",
    template: "email-verification",
    variables: {
      BASE_URL: process.env.BASE_URL,
      code: otp.split(""),
      year: new Date().getFullYear().toString(),
    },
  });
}

type NotifySenderInput = {
  sender: string;
  product: "capsule" | "letter";
} & Omit<Variables["sending-notification"], "BASE_URL" | "year">;

export async function notifySender({ sender, product, ...variables }: NotifySenderInput) {
  if (!process.env.BASE_URL) return { error: "No public url environmnent variable was found" };

  await send({
    from: "noreply",
    to: [sender],
    subject: `${capitalize(product)} successfully sent!`,
    template: "sending-notification",
    variables: {
      ...variables,
      product,
      BASE_URL: process.env.BASE_URL,
      year: new Date().getFullYear().toString(),
    },
  });
}

type PackageReceiptInput = {
  payee: string;
} & Omit<Variables["package-receipt"], "BASE_URL" | "year">;

export async function sendPackageReceipt({ payee, ...variables }: PackageReceiptInput) {
  if (!process.env.BASE_URL) return { error: "No public url environmnent variable was found" };

  await send({
    from: "noreply",
    to: [payee],
    subject: "Thank you for your purchase!",
    template: "package-receipt",
    variables: {
      ...variables,
      BASE_URL: process.env.BASE_URL,
      year: new Date().getFullYear().toString(),
    },
  });
}

type ViewNotificationInput = { payee: string } & Omit<Variables["view-notification"], "BASE_URL" | "year">;

export async function sendViewNotification({ payee, ...variables }: ViewNotificationInput) {
  if (!process.env.BASE_URL) return { error: "No public url environmnent variable was found" };

  await send({
    from: "noreply",
    to: [payee],
    subject: "Your capsule has been opened!",
    template: "view-notification",
    variables: {
      ...variables,
      BASE_URL: process.env.BASE_URL,
      year: new Date().getFullYear().toString(),
    },
  });
}

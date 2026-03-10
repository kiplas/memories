import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@/db";
import { nextCookies } from "better-auth/next-js";
import { admin, emailOTP } from "better-auth/plugins";
import * as schema from "@/db/schema/auth";
import { balance as $balance } from "@/db/schema/balance";
import { sendEmailVerification } from "@/server/mail";

export const auth = betterAuth({
  plugins: [
    nextCookies(),

    admin({
      defaultRole: "customer",
      adminRoles: ["admin"],
      adminUserIds: [],
    }),

    emailOTP({
      overrideDefaultEmailVerification: true,

      async sendVerificationOTP({ email, otp, type }) {
        switch (type) {
          case "sign-in":
            await sendEmailVerification({ otp, email });
            break;
          case "email-verification":
            await sendEmailVerification({ otp, email });
            break;
          case "forget-password":
            await sendEmailVerification({ otp, email });
            break;
        }
      },
    }),
  ],

  user: {
    changeEmail: {
      enabled: true,
      updateEmailWithoutVerification: true,
    },
  },

  emailAndPassword: {
    enabled: true,
    sendResetPassword: async () => {}
  },

  database: drizzleAdapter(db, {
    provider: "pg",
    schema,
  }),

  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          await db.insert($balance).values({ current: 0, overall: 0, user: user.id });
        },
      },
    },
  },
});

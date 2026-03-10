import z from "zod";
import { publicProcedure } from "../trpc";
import { prices } from "@/mock/prices";

const forProductInputSchema = z.object({
  variant: z.literal(["digital", "printed"]),
  product: z.literal(["capsule", "letter"]),
  quantity: z.number(),
});

export const forProduct = publicProcedure.input(forProductInputSchema).query(async ({ input }) => {
  return {
    OTP: prices[input.product][input.variant]["currency"],
    credits: prices[input.product][input.variant]["credits"],
  };
});

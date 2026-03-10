import Stripe from "stripe";

if (!process.env.STRIPE_KEY) throw new Error("No stripe key was provided");

export const stripe = new Stripe(process.env.STRIPE_KEY);

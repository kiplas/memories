import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { createPackageIntent, createProductIntent, updatePackageIntent } from "@/actions/payment";

type useProductIntentInput = {
  variant: "digital" | "printed";
  product: "capsule" | "letter";
  quantity: number;
};

export function useProductIntent({ variant, product, quantity }: useProductIntentInput) {
  const [stripe] = useState(loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!, { developerTools: { assistant: { enabled: process.env.NODE_ENV === "development" } } }));
  const [secret, setSecret] = useState<string>();
  const [intent, setIntent] = useState<number>();
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  useEffect(() => {
    async function get() {
      setPending(true);
      const { client_secret, intent, error } = await createProductIntent({ variant, product, quantity });
      setPending(false);

      if (error) return setError(error);
      if (!client_secret || !intent) return setError("Unknown");

      setSecret(client_secret);
      setIntent(intent.id);
    }

    get();
  }, [product, quantity, variant]);

  return {
    stripe,
    secret,
    intent,
    pending,
    error,
  };
}

type usePackageIntentInput = {
  packageID: number;
};

export function usePackageIntent({ packageID }: usePackageIntentInput) {
  const [stripe] = useState(loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!, { developerTools: { assistant: { enabled: process.env.NODE_ENV === "development" } } }));
  const [secret, setSecret] = useState<string>();
  const [intent, setIntent] = useState<number>();
  const [error, setError] = useState<string>();
  const [pending, setPending] = useState(false);

  useEffect(() => {
    async function get() {
      setPending(true);
      setError(undefined);
      const { client_secret, intent, error } = await createPackageIntent({ packageID });
      setPending(false);

      if (error) return setError(error);
      if (!client_secret || !intent) return setError("Unknown");

      setSecret(client_secret);
      setIntent(intent.id);
    }

    async function update() {
      if (!intent) return setError("Tried to update intent before it was created");

      setPending(true);
      setError(undefined);
      const { error } = await updatePackageIntent({ packageID, intentID: intent });
      setPending(false);

      if (error) return setError(error);
    }

    if (secret && intent) update();
    else get();
  }, [packageID]);

  return {
    stripe,
    secret,
    intent,
    error,
    pending,
  };
}

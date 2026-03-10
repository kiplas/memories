import z from "zod";
import { digitalAddressee, physicalAddressee } from "./addressee";
import { capsule } from "./capsule";
import { letter } from "./letter";

export const digitalCapsule = z.object({
  order: z.object({
    obligation: z.object({
      capsule,
      addressees: z.array(digitalAddressee),
    }),
  }),
});

export const printedCapsule = z.object({
  order: z.object({
    obligation: z.object({
      capsule,
      addressees: z.array(physicalAddressee),
    }),
  }),
});

export const digitalLetter = z.object({
  order: z.object({
    obligation: z.object({
      letter,
      addressees: z.array(digitalAddressee),
    }),
  }),
});

import z from "zod";

export const physicalAddress = z.object({
  name: z.string().nonempty(),
  zip: z.string().nonempty(),
  country: z.string().nonempty(),
  city: z.string().nonempty(),
  state: z.string().nonempty(),
  address: z.string().nonempty(),
});

export const digitalAddress = z.object({
  email: z.string(),
});

export const digitalAddressee = z.object({
  digital: digitalAddress,
  physical: z.nullish(z.undefined()),
});

export const physicalAddressee = z.object({
  digital: z.nullish(z.undefined()),
  physical: physicalAddress,
});

export const addressee = z.xor([digitalAddressee, physicalAddressee]);
export const addressees = z.array(addressee);

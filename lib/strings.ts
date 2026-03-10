import { Addressee, DigitalAddressee, PhysicalAddressee } from "@/types";

export function capitalize(s: string) {
  return s.replaceAll(/\b[a-zA-Z]/g, (c) => c.toUpperCase());
}

export function printDigitalAddressee(addressee: DigitalAddressee) {
  return addressee.digital.email;
}

export function printPhysicalAddressee(addressee: PhysicalAddressee) {
  const { country, state, name } = addressee.physical;

  return `${name}, ${state}, ${country}`;
}

export function printAddressee(addressee: Addressee) {
  return addressee.digital ? printDigitalAddressee(addressee) : printPhysicalAddressee(addressee);
}

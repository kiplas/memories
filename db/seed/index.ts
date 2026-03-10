import { seed as seedIllustrations } from "./illustrations";
import { seed as seedPackages } from "./packages";

export async function seed() {
  await seedIllustrations();
  await seedPackages();
}

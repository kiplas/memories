import Constructor from "@/sections/constructor/capsule/printed";
import { ExtendedHeader } from "@/components/header";
import { Provider as CapsuleProvider } from "@/state/capsule";
import { getPrintedCapsulePreset } from "@/lib/preset";
import { db } from "@/db";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};
export default async function Page({ searchParams }: Props) {
  const preset = await getPrintedCapsulePreset((await searchParams).preset);
  const illustrations = await db.query.capsuleIllustration.findMany({ with: { upload: true } });

  return (
    <CapsuleProvider illustrations={illustrations} preset={preset}>
      <ExtendedHeader static />
      <Constructor />
    </CapsuleProvider>
  );
}

import Constructor from "@/sections/constructor/capsule/digital/index";
import { ExtendedHeader } from "@/components/header";
import { Provider as CapsuleProvider } from "@/state/capsule";
import { db } from "@/db";
import { getDigitalCapsulePreset } from "@/lib/preset";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ searchParams }: Props) {
  const preset = await getDigitalCapsulePreset((await searchParams).preset);
  const illustrations = await db.query.capsuleIllustration.findMany({ with: { upload: true } });

  return (
    <CapsuleProvider illustrations={illustrations} preset={preset}>
      <ExtendedHeader static />

      <Constructor />
    </CapsuleProvider>
  );
}

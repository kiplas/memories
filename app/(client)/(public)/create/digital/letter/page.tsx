import Constructor from "@/sections/constructor/letter";
import { ExtendedHeader } from "@/components/header";
import { Provider as LetterProvider } from "@/state/letter";
import { db } from "@/db";
import { getDigitalLetterPreset } from "@/lib/preset";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function Page({ searchParams }: Props) {
  const preset = await getDigitalLetterPreset((await searchParams).preset);
  const illustrations = await db.query.letterIllustration.findMany({ with: { upload: true } });

  return (
    <LetterProvider illustrations={illustrations} preset={preset}>
      <ExtendedHeader contents-absolute/>
      <Constructor />
    </LetterProvider>
  );
}

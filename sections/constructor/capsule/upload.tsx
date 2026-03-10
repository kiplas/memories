"use client";

import Plus from "@/icons/plus";
import Image from "next/image";
import CancelOutlined from "@/icons/cancel-outlined";
import Tabs from "@/components/capsule-tabs";
import Button from "@/components/ui/button";
import TextSlide from "@/components/ui/TextSlide";
import { type ChangeEvent } from "react";
import { type Upload, useCapsule, useCapsuleControls } from "@/state/capsule";
import { createObjectURL } from "@/lib/media";

type InputProps = {
  onChange: (file: File) => unknown;
};

function Input({ onChange: onFileChange }: InputProps) {
  function onChange({ currentTarget }: ChangeEvent<HTMLInputElement>) {
    const files = currentTarget.files;

    if (!files) throw new Error("Expected files to be present");

    onFileChange(files[0]);
  }

  return (
    <label className="group/slide grid cursor-pointer place-content-center rounded-3xl bg-[#F5F5F5] max-md:h-200 md:aspect-square">
      <input className="pointer-events-none absolute hidden opacity-0" type="file" onChange={onChange} />

      <span className="flex h-62 w-62 items-center justify-center gap-x-10 rounded-full bg-white lg:w-231">
        <TextSlide className="hidden lg:inline">Upload your Photo</TextSlide> <Plus />
      </span>
    </label>
  );
}

type PreviewProps = {
  onDelete: () => unknown;
  upload: Upload;
};

function Preview({ onDelete, upload }: PreviewProps) {
  const src = upload instanceof File ? createObjectURL(upload) : upload.url;

  return (
    <div className="flex aspect-square size-full flex-col items-center gap-y-8 pt-10 md:px-56 md:pt-20">
      <Image className="aspect-square h-auto w-full max-w-160 object-cover md:max-w-none" src={src} alt="" width="270" height="270" />

      <button className="text-orange mt-auto flex w-full cursor-pointer items-center justify-center gap-x-10 py-14 md:py-19" onClick={onDelete}>
        Delete <CancelOutlined className="hidden md:block" />
      </button>
    </div>
  );
}

type FieldProps = {
  upload: Upload | null;
  onChange: (file: File | null) => unknown;
};

function Field({ upload, onChange }: FieldProps) {
  return upload ? <Preview upload={upload} onDelete={() => onChange(null)} /> : <Input onChange={onChange} />;
}

export default function Upload() {
  const { uploads } = useCapsule();
  const { setNextStage, setUploads } = useCapsuleControls();

  function upload(index: number, file: File | null) {
    const copy = [...uploads];
    copy[index] = file;
    setUploads(copy);
  }

  return (
    <section className="mb-40">
      <Tabs />

      <div className="px-32">
        <header className="mx-auto mt-24 text-center">
          <Image className="mx-auto" src="/picture.png" width="48" height="48" alt="" />

          <hgroup>
            <h2 className="text-h3-m md:text-h3-xl mb-10">Upload a Photo</h2>
            <span className="text-[#71717A]">Upload up to 3 photos. Each card can include one, two, or three images.</span>
          </hgroup>
        </header>

        <div className="mx-auto mt-24 grid w-full max-w-1189 grid-cols-3 gap-8 md:gap-20">
          <Field upload={uploads[0]} onChange={(file) => upload(0, file)} />
          <Field upload={uploads[1]} onChange={(file) => upload(1, file)} />
          <Field upload={uploads[2]} onChange={(file) => upload(2, file)} />
        </div>

        <Button
          className="bg-green mx-auto mt-16 w-257 border-none text-white disabled:opacity-40 md:mt-24"
          disabled={uploads.filter((file) => !!file).length === 0}
          onClick={setNextStage}
        >
          Start!
        </Button>
      </div>
    </section>
  );
}

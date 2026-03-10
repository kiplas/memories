import { type ClassValue } from "clsx";
import { type Maybe } from "@trpc/server/unstable-core-do-not-import";
import { cn } from "@/lib/utils";

type InputProps = {
  value?: string;
  onInput?: (value: string) => unknown;
  name: string;
  type: string;
  placeholder: string;
  className?: ClassValue;
  error?: Maybe<string>;
};

export default function Input({ value, onInput, placeholder, name, type, className, error }: InputProps) {
  return (
    <label className="pointer-events-none">
      <input
        className={cn(
          "pointer-events-auto h-65 w-full rounded-full border border-gray placeholder:text-black/40 bg-white px-24 outline-none focus:border-[#383433] font-medium -tracking-tighter md:px-32",
          className,
          error && "border-orange",
        )}
        placeholder={placeholder}
        name={name}
        type={type}
        value={value}
        onInput={onInput ? ({ currentTarget }) => onInput(currentTarget.value) : undefined}
      />

      {error && <div className="text-small-xl text-orange mt-4 ml-32">{error}</div>}
    </label>
  );
}

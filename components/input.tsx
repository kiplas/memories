import { useId, type ChangeEvent, type ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { Maybe } from "@/types";

type InputProps = ComponentProps<"input">;

type Props = {
  name: string;
  label: string;
  placeholder: string;
  value?: string;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => unknown;
  className?: string;
  error?: Maybe<string>;
  type: InputProps["type"];
  autoComplete?: InputProps["autoComplete"];
};

export default function Input({ value, onChange, error, autoComplete, name, label, placeholder, className, type }: Props) {
  const id = useId();

  return (
    <div className={cn("group flex flex-col", className)} data-error={error || null}>
      <label className="text-small-xl" htmlFor={id}>
        {label}
      </label>

      <input
        className="border-gray group-data-error:text-orange group-data-error:border-orange mt-4 h-46 rounded-lg border pr-24 pl-16 text-[0.75rem] font-medium -tracking-[0.01em]"
        id={id}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
      />

      {error && <div className="text-orange mx-16 mt-4 text-[0.75rem] font-medium -tracking-tighter">{error}</div>}
    </div>
  );
}

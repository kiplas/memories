import { cn } from "@/lib/utils";

type Props = {
  name: string;
  className?: string;
  value: boolean;
  onChange: (value: boolean) => unknown;
  error?: boolean;
};

export default function Input({ name, value, onChange, error, className }: Props) {
  return (
    <div className={cn("group cursor-pointer", className)} data-error={error || null}>
      <input className="pointer-events-none absolute opacity-0" onChange={() => onChange(!value)} checked={value} type="checkbox" name={name} />
      <div className="border-gray group-data-error:border-orange size-20 rounded-xs border p-3">{value && <div className="size-full bg-black" />}</div>
    </div>
  );
}

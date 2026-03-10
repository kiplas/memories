import { cn } from "@/lib/utils";

type RadioProps = {
  title: string;
  subtitle: string;
  value: string;
  checked: boolean;
  name: string;
  className?: string;
  onChange: () => unknown;
};

export default function Radio({ title, subtitle, value, onChange, name, checked, className }: RadioProps) {
  return (
    <label className={cn("flex h-89 cursor-pointer items-center gap-x-20 rounded-[20px] border border-black pr-10 pl-20 py-24", className)}>
      <input className="pointer-events-none absolute hidden opacity-0" checked={checked} name={name} type="radio" value={value} onChange={onChange} />

      <div className="size-34 rounded-full border border-black p-7">
        <div className={cn("bg-green size-full rounded-full", !checked && "invisible")}></div>
      </div>

      <div className="flex flex-col gap-y-4">
        <span className="text-accent-xl">{title}</span>
        <span className="text-[0.875rem] font-medium -tracking-tighter">{subtitle}</span>
      </div>
    </label>
  );
}

import { useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  setDelivery: (delivery: Date) => unknown;
  delivery: Date;
  disabled?: boolean;
};

export default function DatePicker({ delivery, setDelivery, disabled }: Props) {
  const min = new Date();
  const max = new Date(2030, 12, 0);

  const [day, setDay] = useState(String(delivery.getDate()));
  const [month, setMonth] = useState(String(delivery.getMonth() + 1));
  const [year, setYear] = useState(String(delivery.getFullYear()));

  function sync(date: Date) {
    setDay(String(date.getDate()));
    setMonth(String(date.getMonth() + 1));
    setYear(String(date.getFullYear()));
  }

  function update() {
    const updated = new Date(Number(year), Number(month) - 1, Number(day));

    if (min > updated || updated > max) return sync(delivery);

    setDelivery(updated);
    sync(updated);
  }

  return (
    <div className={cn("shadow-widget ease-slow hover:shadow-widget-active grid h-67 md:h-85 w-full grid-cols-3 rounded-full border border-black duration-600", disabled && "opacity-50")}>
      <input
        className="numeric-appearence-none text-center outline-none"
        name="day"
        value={day}
        min={min.getDate()}
        max={max.getDate()}
        type="number"
        disabled={disabled}
        placeholder={String(min.getDate())}
        onChange={({ currentTarget }) => setDay(currentTarget.value)}
        onBlur={update}
      />

      <input
        className="numeric-appearence-none border-x border-x-black text-center outline-none"
        name="month"
        value={month}
        min={min.getMonth() + 1}
        max={max.getMonth() + 1}
        type="number"
        disabled={disabled}
        placeholder={String(min.getMonth() + 1)}
        onChange={({ currentTarget }) => setMonth(currentTarget.value)}
        onBlur={update}
      />

      <input
        className="numeric-appearence-none text-center outline-none"
        name="year"
        value={year}
        min={min.getFullYear()}
        max={max.getFullYear()}
        type="number"
        disabled={disabled}
        placeholder={String(min.getFullYear())}
        onChange={({ currentTarget }) => setYear(currentTarget.value)}
        onBlur={update}
      />
    </div>
  );
}

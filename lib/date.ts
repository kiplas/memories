const formatter = new Intl.DateTimeFormat("en", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatDate(date: Date) {
  const parts = formatter.formatToParts(date);

  return [
    parts.find((part) => part.type === "day")?.value,
    parts.find((part) => part.type === "month")?.value,
    parts.find((part) => part.type === "year")?.value,
  ].join(" ");
}

export function getLastDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 0).getDate();
}

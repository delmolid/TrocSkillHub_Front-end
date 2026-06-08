/** Parses a YYYY-MM-DD string into a local Date. */
export function parseIsoDate(value?: string): Date | null {
  if (!value?.trim()) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

/** Formats a Date as a YYYY-MM-DD string. */
export function formatIsoDate(date: Date | null | undefined): string {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Convertit une chaîne AAAA-MM-JJ en Date locale. */
export function parseIsoDate(value?: string): Date | null {
  if (!value?.trim()) return null;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

/** Convertit une Date en chaîne AAAA-MM-JJ. */
export function formatIsoDate(date: Date | null | undefined): string {
  if (!date) return "";
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

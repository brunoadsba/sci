export function uid(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `id-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

export function formatDate(dateLike?: string | Date): string {
  if (!dateLike) return "";
  const date = new Date(dateLike);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("pt-BR");
}

export function formatDateTime(dateLike?: string | Date): string {
  if (!dateLike) return "";
  const date = new Date(dateLike);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("pt-BR");
}

export function addDays(dateLike: string | Date, days: number): Date {
  const date = new Date(dateLike);
  if (Number.isNaN(date.getTime())) return new Date();
  date.setDate(date.getDate() + days);
  return date;
}

export function parsePrazoDays(prazo: string): number | null {
  const match = String(prazo).trim().match(/^D\+(\d+)$/i);
  if (!match) return null;
  return Number(match[1]);
}

export function stateTimestamp(candidate?: {
  updatedAt?: string;
  exportedAt?: string;
} | null): number {
  const value = candidate?.updatedAt || candidate?.exportedAt || 0;
  const time = new Date(value).getTime();
  return Number.isNaN(time) ? 0 : time;
}

export function downloadBlob(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function csvEscape(value: unknown): string {
  const text = String(value ?? "");
  if (/[",\n;]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

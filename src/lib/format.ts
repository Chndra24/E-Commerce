/**
 * Format angka, mata uang, persentase, dan tanggal sesuai konvensi UI proyek.
 *
 * Aturan yang mengikat (PRD §15, AGENTS.md):
 * - Mata uang: `Rp1.234.567` tanpa desimal.
 * - Persentase: satu angka desimal, input berupa rasio (0.1234 -> "12,3%").
 * - Tanggal selalu dirender dalam zona Asia/Jakarta (WIB), bukan zona mesin.
 */

type Numeric = number | string | { toString(): number | string };

const LOCALE = "id-ID";
export const WIB_TIME_ZONE = "Asia/Jakarta";

const integerFormatter = new Intl.NumberFormat(LOCALE, {
  maximumFractionDigits: 0,
});

const percentFormatter = new Intl.NumberFormat(LOCALE, {
  style: "percent",
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const dateFormatter = new Intl.DateTimeFormat(LOCALE, {
  timeZone: WIB_TIME_ZONE,
  day: "2-digit",
  month: "long",
  year: "numeric",
});

const dateTimeFormatter = new Intl.DateTimeFormat(LOCALE, {
  timeZone: WIB_TIME_ZONE,
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
});

/**
 * Mengubah angka, string numerik, atau Prisma Decimal menjadi number.
 * Melempar TypeError untuk nilai yang tidak bisa direpresentasikan sebagai angka.
 */
export function toFiniteNumber(value: Numeric): number {
  const parsed = typeof value === "number" ? value : Number(value.toString());

  if (!Number.isFinite(parsed)) {
    throw new TypeError(`Nilai numerik tidak valid: ${String(value)}`);
  }

  return parsed;
}

/** 1234567 -> "Rp1.234.567" */
export function formatCurrency(value: Numeric): string {
  const amount = toFiniteNumber(value);
  const sign = amount < 0 ? "-" : "";

  return `${sign}Rp${integerFormatter.format(Math.abs(Math.round(amount)))}`;
}

/** 1234567 -> "1.234.567" */
export function formatNumber(value: Numeric): string {
  return integerFormatter.format(Math.round(toFiniteNumber(value)));
}

/** 0.1234 -> "12,3%" */
export function formatPercent(ratio: Numeric): string {
  return percentFormatter.format(toFiniteNumber(ratio));
}

/** Tanggal dalam WIB, contoh: "17 November 2026" */
export function formatDateWib(value: Date | string): string {
  return dateFormatter.format(toDate(value));
}

/** Tanggal + jam dalam WIB, contoh: "17 Nov 2026, 14.05" */
export function formatDateTimeWib(value: Date | string): string {
  return dateTimeFormatter.format(toDate(value));
}

function toDate(value: Date | string): Date {
  const date = value instanceof Date ? value : new Date(value);

  if (Number.isNaN(date.getTime())) {
    throw new TypeError(`Tanggal tidak valid: ${String(value)}`);
  }

  return date;
}

/**
 * Currency and number formatting helpers (pt-BR / BRL).
 */

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

const percentFormatter = new Intl.NumberFormat("pt-BR", {
  style: "percent",
  minimumFractionDigits: 0,
  maximumFractionDigits: 1,
});

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value);
}

/**
 * Formats a ratio (e.g. 0.6) as a percentage string (e.g. "60%").
 */
export function formatPercent(ratio: number): string {
  return percentFormatter.format(ratio);
}

/**
 * Formats a due day (integer) into an ordinal-like label in pt-BR.
 * Example: 5 -> "dia 05".
 */
export function formatDueDay(day: number): string {
  return `dia ${String(day).padStart(2, "0")}`;
}

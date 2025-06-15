export function formatFiat(
  amount: number | string,
  currency: "USD" | "EUR" | "GBP" = "USD",
  decimals = 2
): string {
  const numeric = typeof amount === "string" ? parseFloat(amount) : amount;

  if (isNaN(numeric)) return `$0.00`;

  return numeric.toLocaleString("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

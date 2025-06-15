export function formatTonBalance(balanceNanoTon: number | string, decimals = 3): string {
  const balance = typeof balanceNanoTon === "string" ? parseFloat(balanceNanoTon) : balanceNanoTon;

  if (isNaN(balance)) return "0 TON";

  const tonValue = balance / 1e9;
  return `${tonValue.toFixed(decimals)} TON`;
}

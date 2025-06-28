// utils/format-freebet.ts

/**
 * Formate un nombre pour l'affichage des Free Bets :
 * - Garde jusqu'à 3 décimales si nécessaire
 * - Supprime les zéros inutiles
 * 
 * @param value Le montant à formater (ex: 0.123, 10, etc.)
 * @returns string formaté proprement (ex: "0.032", "2", "1.25")
 */
export const formatFreeBet = (value: number): string => {
  return value.toFixed(3).replace(/\.?0+$/, "");
};

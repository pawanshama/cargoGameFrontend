// src/utils/formatAddress.ts
import { Address } from "@ton/core";

export function toFriendlyAddress(raw: string): string {
  try {
    return Address.parse(raw).toString(); // à jour
  } catch (e) {
    console.error("Invalid TON address:", raw);
    return raw;
  }
}

import { Address } from "@ton/core";

const friendlyAddress = "UQCcgQqpCCWy3YEzLLqRRQowXf5-YUC8nbPYP--WQm3dI8E8";

const raw = Address.parse(friendlyAddress).toRawString();

console.log("✅ RAW address:", raw);

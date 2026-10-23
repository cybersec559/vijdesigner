/** Pull a positive dollar amount out of a display price such as "$12" or "$12 per pair". */
export function moneyAmount(price: string): string | undefined {
  const match = price.replace(/,/g, "").match(/(\d+(?:\.\d{1,2})?)/);
  const digits = match?.[1];
  if (!digits) {
    return undefined;
  }
  const value = Number(digits);
  if (!Number.isFinite(value) || value <= 0) {
    return undefined;
  }
  return value.toFixed(2);
}

/** Normalize a studio price into the string shown on the piece. */
export function displayPrice(raw: string): string | undefined {
  const trimmed = raw.trim();
  if (!trimmed) {
    return undefined;
  }
  const amount = moneyAmount(trimmed);
  if (!amount) {
    return undefined;
  }
  const plain = trimmed.replace(/,/g, "");
  if (/^\$?\d+(?:\.\d{1,2})?$/.test(plain)) {
    const numeric = Number(amount);
    const shown = Number.isInteger(numeric) ? String(numeric) : amount;
    return `$${shown}`;
  }
  return trimmed.startsWith("$") ? trimmed : `$${trimmed}`;
}

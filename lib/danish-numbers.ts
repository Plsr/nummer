const ONES = [
  "en",
  "to",
  "tre",
  "fire",
  "fem",
  "seks",
  "syv",
  "otte",
  "ni",
] as const;

const TEENS = [
  "elleve",
  "tolv",
  "tretten",
  "fjorten",
  "femten",
  "seksten",
  "sytten",
  "atten",
  "nitten",
] as const;

const TENS = [
  "ti",
  "tyve",
  "tredive",
  "fyrre",
  "halvtreds",
  "tres",
  "halvfjerds",
  "firs",
  "halvfems",
] as const;

const HUNDRED = "hundrede";
const AND = "og";

/** Word tiles grouped for display: 1-10, 11-19, and 20-100 land in visually separated clusters. */
export const TOKEN_GROUPS = {
  onesToTen: [...ONES, TENS[0]],
  teens: [...TEENS],
  tensAndUp: [...TENS.slice(1), HUNDRED],
  connector: [AND],
};

export const TOKEN_ORDER = [
  ...TOKEN_GROUPS.onesToTen,
  ...TOKEN_GROUPS.teens,
  ...TOKEN_GROUPS.tensAndUp,
  ...TOKEN_GROUPS.connector,
];

/** The ordered words that concatenate (no spaces) into the Danish number word. */
export function danishTokens(n: number): string[] {
  if (!Number.isInteger(n) || n < 1 || n > 999) {
    throw new RangeError(`danishTokens: ${n} is out of the supported 1-999 range`);
  }

  if (n <= 9) return [ONES[n - 1]];
  if (n === 10) return [TENS[0]];
  if (n < 20) return [TEENS[n - 11]];
  if (n < 100) {
    if (n % 10 === 0) return [TENS[n / 10 - 1]];
    const ones = n % 10;
    const tens = Math.floor(n / 10);
    return [ONES[ones - 1], AND, TENS[tens - 1]];
  }
  if (n === 100) return [HUNDRED];

  const hundreds = Math.floor(n / 100);
  const rest = n % 100;
  const hundredsTokens = hundreds === 1 ? [HUNDRED] : [ONES[hundreds - 1], HUNDRED];
  if (rest === 0) return hundredsTokens;
  return [...hundredsTokens, AND, ...danishTokens(rest)];
}

export function danishWord(n: number): string {
  return danishTokens(n).join("");
}

/** All word tiles needed to construct any of the given numbers, in a stable display order. */
export function danishPalette(numbers: number[]): string[] {
  const needed = new Set<string>();
  for (const n of numbers) {
    for (const token of danishTokens(n)) needed.add(token);
  }
  return TOKEN_ORDER.filter((token) => needed.has(token));
}

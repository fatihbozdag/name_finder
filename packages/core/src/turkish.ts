/**
 * Turkish ICU/CLDR helpers for proper case mapping and collation
 *
 * CRITICAL: Never DIY Turkish i/ı/İ/I conversions!
 * Always use these helpers that leverage built-in Intl APIs.
 *
 * References:
 * - https://unicode-org.github.io/icu/userguide/transforms/casemappings.html
 * - https://www.unicode.org/cldr/charts/45/summary/tr.html
 */

/**
 * Turkish locale collator for proper sorting
 * Handles i/ı/İ/I correctly according to Turkish rules
 */
export const turkishCollator = new Intl.Collator('tr-TR', {
  sensitivity: 'base',
  usage: 'sort'
});

/**
 * Case-insensitive Turkish collator for equality checks
 */
export const turkishCollatorInsensitive = new Intl.Collator('tr-TR', {
  sensitivity: 'accent',
  usage: 'search'
});

/**
 * Convert string to lowercase using Turkish rules
 * CRITICAL: 'I' → 'ı' (not 'i'), 'İ' → 'i'
 */
export function toLowerCaseTurkish(str: string): string {
  return str.toLocaleLowerCase('tr-TR');
}

/**
 * Convert string to uppercase using Turkish rules
 * CRITICAL: 'i' → 'İ' (not 'I'), 'ı' → 'I'
 */
export function toUpperCaseTurkish(str: string): string {
  return str.toLocaleUpperCase('tr-TR');
}

/**
 * Turkish-aware string equality check (case-insensitive)
 */
export function equalsTurkish(a: string, b: string): boolean {
  return turkishCollatorInsensitive.compare(a, b) === 0;
}

/**
 * Sort array of strings using Turkish collation
 */
export function sortTurkish<T>(
  arr: T[],
  keyFn: (item: T) => string = (item) => String(item)
): T[] {
  return [...arr].sort((a, b) => turkishCollator.compare(keyFn(a), keyFn(b)));
}

/**
 * Check if string contains Turkish-specific letters (ş,ç,ğ,ö,ü,ı,İ)
 */
export function hasTurkishDiacritics(str: string): boolean {
  return /[şçğöüıİ]/.test(str);
}

/**
 * Generate ASCII twin by removing Turkish diacritics
 * Maps: ş→s, ç→c, ğ→g, ö→o, ü→u, ı→i, İ→I
 */
export function toAsciiTwin(str: string): string {
  const map: Record<string, string> = {
    ş: 's',
    Ş: 'S',
    ç: 'c',
    Ç: 'C',
    ğ: 'g',
    Ğ: 'G',
    ö: 'o',
    Ö: 'O',
    ü: 'u',
    Ü: 'U',
    ı: 'i',
    I: 'I',
    İ: 'I'
  };

  return str.replace(/[şŞçÇğĞöÖüÜıİI]/g, (match) => map[match] || match);
}

/**
 * Check if string uses only Turkish alphabet (no W, Q, X)
 */
export function isStrictTurkishAlphabet(str: string): boolean {
  // Turkish alphabet: A-Z except W,Q,X, plus ş,ç,ğ,ö,ü,ı,İ
  return !/[WQXwqx]/.test(str);
}

/**
 * Extract Turkish letters from string
 */
export function extractLetters(str: string): string[] {
  return Array.from(new Set(toLowerCaseTurkish(str).split(''))).filter((c) =>
    /[a-zşçğöüı]/.test(c)
  );
}

/**
 * Count syllables in Turkish word (heuristic)
 * Turkish is syllable-timed, vowels define syllables
 * In Turkish, each vowel typically forms a separate syllable
 */
export function countSyllables(word: string): number {
  const vowels = 'aeıioöuüAEIİOÖUÜ';
  let count = 0;

  for (const char of word) {
    if (vowels.includes(char)) {
      count++;
    }
  }

  return Math.max(count, 1); // At least 1 syllable
}

/**
 * Estimate stress pattern (Turkish words typically have final stress)
 */
export function estimateStress(word: string): 'final' | 'nonfinal' | 'unknown' {
  const syllables = countSyllables(word);

  // Most Turkish words have final stress
  // Exceptions: Place names, borrowed words, some compounds
  if (syllables === 1) return 'final';

  // Heuristic: assume final stress for most cases
  // This can be improved with Zeyrek/Zemberek integration
  return 'final';
}

/**
 * Generate slug from display name (lowercase, no spaces)
 */
export function generateSlug(displayName: string): string {
  return toLowerCaseTurkish(displayName.trim().replace(/\s+/g, '-'));
}

/**
 * Capitalize first letter (Turkish-aware)
 */
export function capitalizeFirst(str: string): string {
  if (!str) return '';
  return toUpperCaseTurkish(str[0]) + toLowerCaseTurkish(str.slice(1));
}

/**
 * Check if name starts with given letter(s) (Turkish case-insensitive)
 */
export function startsWith(name: string, prefix: string): boolean {
  return toLowerCaseTurkish(name).startsWith(toLowerCaseTurkish(prefix));
}

/**
 * Check if name ends with given letter(s) (Turkish case-insensitive)
 */
export function endsWith(name: string, suffix: string): boolean {
  return toLowerCaseTurkish(name).endsWith(toLowerCaseTurkish(suffix));
}

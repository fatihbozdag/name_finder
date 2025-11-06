/**
 * Turkish phonotactics and euphony helpers
 * Used for surname compatibility scoring
 */

import { toLowerCaseTurkish } from './turkish';

/**
 * Check if character is a vowel in Turkish
 */
export function isVowel(char: string): boolean {
  return 'aeıioöuüAEIİOÖUÜ'.includes(char);
}

/**
 * Check if character is a consonant in Turkish
 */
export function isConsonant(char: string): boolean {
  const lower = toLowerCaseTurkish(char);
  return /[bcçdfgğhjklmnprsştvyz]/.test(lower);
}

/**
 * Check if consonant is a stop (plosive): p, t, k, b, d, g
 */
export function isStop(char: string): boolean {
  const lower = toLowerCaseTurkish(char);
  return 'ptkbdg'.includes(lower);
}

/**
 * Check if consonant is a sonorant: m, n, l, r, y
 */
export function isSonorant(char: string): boolean {
  const lower = toLowerCaseTurkish(char);
  return 'mnlry'.includes(lower);
}

/**
 * Get boundary bigram when name meets surname
 * e.g., "Ayşe" + "Yılmaz" → "ey"
 */
export function getBoundaryBigram(name: string, surname: string): string {
  const nameLast = name.slice(-1);
  const surnameFirst = surname[0] || '';
  return nameLast + surnameFirst;
}

/**
 * Score euphony at name-surname boundary
 * Returns a score 0..1 (higher is better)
 */
export function scoreBoundaryEuphony(name: string, surname: string): number {
  if (!name || !surname) return 0.5; // Neutral if missing

  const bigram = getBoundaryBigram(name, surname);
  const [c1, c2] = [bigram[0], bigram[1]];

  let score = 0.5; // Start neutral

  // Bonus: consonant → vowel is smooth
  if (isConsonant(c1) && isVowel(c2)) {
    score += 0.3;
  }

  // Bonus: vowel → consonant is acceptable
  if (isVowel(c1) && isConsonant(c2)) {
    score += 0.2;
  }

  // Bonus: sonorant transitions are smooth
  if (isSonorant(c1) || isSonorant(c2)) {
    score += 0.1;
  }

  // Penalty: vowel → vowel can create hiatus
  if (isVowel(c1) && isVowel(c2)) {
    score -= 0.2;
  }

  // Penalty: stop → stop is harsh
  if (isStop(c1) && isStop(c2)) {
    score -= 0.3;
  }

  // Penalty: same consonant repeated
  if (
    isConsonant(c1) &&
    isConsonant(c2) &&
    toLowerCaseTurkish(c1) === toLowerCaseTurkish(c2)
  ) {
    score -= 0.2;
  }

  return Math.max(0, Math.min(1, score));
}

/**
 * Analyze vowel harmony in Turkish word
 * Returns harmony score 0..1
 */
export function analyzeVowelHarmony(word: string): number {
  const frontVowels = 'eiöü';
  const backVowels = 'aıou';

  const vowels = Array.from(word).filter(isVowel);
  if (vowels.length <= 1) return 1; // Single vowel is always harmonic

  let harmonyScore = 1;
  let prevFront: boolean | null = null;

  for (const v of vowels) {
    const isFront = frontVowels.includes(toLowerCaseTurkish(v));

    if (prevFront !== null && prevFront !== isFront) {
      harmonyScore -= 0.2; // Penalize disharmony
    }

    prevFront = isFront;
  }

  return Math.max(0, harmonyScore);
}

/**
 * Calculate full euphony score for name + surname
 */
export function calculateEuphony(
  name: string,
  surname: string
): {
  score: number;
  details: {
    boundary: number;
    vowelFlow: number;
    consonantClash: boolean;
  };
} {
  const boundaryScore = scoreBoundaryEuphony(name, surname);
  const fullName = name + surname;
  const vowelFlow = analyzeVowelHarmony(fullName);
  const bigram = getBoundaryBigram(name, surname);
  const consonantClash =
    isConsonant(bigram[0]) &&
    isConsonant(bigram[1]) &&
    (isStop(bigram[0]) || isStop(bigram[1]));

  const score = (boundaryScore * 0.7 + vowelFlow * 0.3) * (consonantClash ? 0.8 : 1.0);

  return {
    score: Math.max(0, Math.min(1, score)),
    details: {
      boundary: boundaryScore,
      vowelFlow,
      consonantClash
    }
  };
}

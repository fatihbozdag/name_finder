/**
 * Core scoring engine for Turkish Name Finder
 * Implements the transparent, deterministic scoring model with 20+ factors
 */

import type { Preferences, ScoreBreakdown } from '@turkish-name-finder/data';
import { DEFAULT_WEIGHTS } from '@turkish-name-finder/data';
import {
  toLowerCaseTurkish,
  startsWith,
  endsWith,
  extractLetters,
  countSyllables,
  estimateStress,
  isStrictTurkishAlphabet
} from './turkish';
import { calculateEuphony } from './phonotactics';

/**
 * Name data structure for scoring
 * Should match the Prisma Name model
 */
export interface NameData {
  id: bigint;
  slug: string;
  display: string;
  gender: 'K' | 'E' | 'U';
  origin: string | null;
  meaning: string | null;
  isUnisex: boolean;
  isPureTurkish: boolean | null;
  styleTags: string[];
  semanticTags: string[];
  morphTags: string[];
  stressPattern: string | null;
  syllables: number | null;
  startsWith: string | null;
  endsWith: string | null;
  letters: string[];
  diacritics: boolean | null;
  asciiTwin: string | null;
  nicknameCandidates: string[];
  compound: boolean;
  registryRisk: number;
  spellingConfusion: string[];
  negativeAssocScore: number;
}

/**
 * Time series data for trend analysis
 */
export interface FrequencyData {
  year: number;
  count: number;
  rank: number | null;
}

/**
 * Calculate dot product between two tag arrays (style/semantic matching)
 */
function tagOverlap(nameTags: string[], prefTags: string[]): number {
  if (prefTags.length === 0) return 0; // No preference

  const intersection = nameTags.filter((tag) =>
    prefTags.some((p) => toLowerCaseTurkish(tag) === toLowerCaseTurkish(p))
  );

  return intersection.length / prefTags.length; // 0..1
}

/**
 * Calculate syllable affinity
 */
function syllableAffinity(
  nameSyllables: number | null,
  min: number,
  max: number,
  preferred?: number
): number {
  if (!nameSyllables) return 0.5; // Unknown, neutral

  // Hard constraint: must be in range
  if (nameSyllables < min || nameSyllables > max) return -999; // Exclude

  // Bonus for preferred
  if (preferred && nameSyllables === preferred) return 1;

  // Linear falloff from preferred
  if (preferred) {
    const distance = Math.abs(nameSyllables - preferred);
    return Math.max(0, 1 - distance * 0.3);
  }

  return 0.5; // In range but no strong preference
}

/**
 * Check hard constraints (returns -Infinity if violated)
 */
function checkHardConstraints(name: NameData, prefs: Preferences): number {
  // Gender constraint
  if (prefs.gender !== 'ALL' && name.gender !== prefs.gender && name.gender !== 'U') {
    return -Infinity;
  }

  // Unisex strict
  if (prefs.unisexStrict && !name.isUnisex) {
    return -Infinity;
  }

  // Origin constraint: "Sadece Türkçe"
  if (prefs.origin === 'sadece_turkce' && !name.isPureTurkish) {
    return -Infinity;
  }

  // Strict Turkish alphabet (no W, Q, X)
  if (prefs.strictTrAlphabet && !isStrictTurkishAlphabet(name.display)) {
    return -Infinity;
  }

  // Must-have letters
  if (prefs.lettersMust.length > 0) {
    const nameLetters = extractLetters(name.display);
    const hasAll = prefs.lettersMust.every((letter) =>
      nameLetters.includes(toLowerCaseTurkish(letter))
    );
    if (!hasAll) return -Infinity;
  }

  // Avoid letters
  if (prefs.lettersAvoid.length > 0) {
    const nameLetters = extractLetters(name.display);
    const hasAny = prefs.lettersAvoid.some((letter) =>
      nameLetters.includes(toLowerCaseTurkish(letter))
    );
    if (hasAny) return -Infinity;
  }

  // Starts with
  if (prefs.startsWith.length > 0) {
    const matches = prefs.startsWith.some((prefix) => startsWith(name.display, prefix));
    if (!matches) return -Infinity;
  }

  // Ends with
  if (prefs.endsWith.length > 0) {
    const matches = prefs.endsWith.some((suffix) => endsWith(name.display, suffix));
    if (!matches) return -Infinity;
  }

  // Veto list
  if (prefs.vetoListMulti.length > 0) {
    const vetoed = prefs.vetoListMulti.some(
      (v) => toLowerCaseTurkish(v) === toLowerCaseTurkish(name.display)
    );
    if (vetoed) return -Infinity;
  }

  // Syllables hard constraint
  const syllables = name.syllables || countSyllables(name.display);
  if (syllables < prefs.syllablesMin || syllables > prefs.syllablesMax) {
    return -Infinity;
  }

  return 0; // Pass
}

/**
 * Main scoring function
 * Returns score and breakdown for transparency
 */
export function scoreNamem(
  name: NameData,
  timeSeries: FrequencyData[],
  prefs: Preferences,
  surname?: string
): {
  score: number;
  breakdown: ScoreBreakdown[];
} {
  const breakdown: ScoreBreakdown[] = [];

  // Check hard constraints first
  const hardCheck = checkHardConstraints(name, prefs);
  if (hardCheck === -Infinity) {
    return { score: -Infinity, breakdown: [] };
  }

  let score = 0;

  // 1. Style tags
  const styleDelta = tagOverlap(name.styleTags, prefs.styleMulti) * DEFAULT_WEIGHTS.style;
  score += styleDelta;
  breakdown.push({
    term: 'style',
    weight: DEFAULT_WEIGHTS.style,
    delta: styleDelta,
    explanation: `Style match: ${name.styleTags.join(', ')}`
  });

  // 2. Semantic tags
  const semanticDelta =
    tagOverlap(name.semanticTags, prefs.semanticDomainsMulti) * DEFAULT_WEIGHTS.semantics;
  score += semanticDelta;
  breakdown.push({
    term: 'semantics',
    weight: DEFAULT_WEIGHTS.semantics,
    delta: semanticDelta,
    explanation: `Meaning domains: ${name.semanticTags.join(', ')}`
  });

  // 3. Syllables
  const syllables = name.syllables || countSyllables(name.display);
  const syllableDelta =
    syllableAffinity(
      syllables,
      prefs.syllablesMin,
      prefs.syllablesMax,
      prefs.syllablesPreferred
    ) * DEFAULT_WEIGHTS.syllables;
  score += syllableDelta;
  breakdown.push({
    term: 'syllables',
    weight: DEFAULT_WEIGHTS.syllables,
    delta: syllableDelta,
    explanation: `${syllables} syllables`
  });

  // 4. Stress pattern
  if (prefs.stressPref !== 'Farketmez') {
    const stress = name.stressPattern || estimateStress(name.display);
    const stressMatch = prefs.stressPref === 'Sonda' && stress === 'final' ? 1 : 0;
    const stressDelta = stressMatch * DEFAULT_WEIGHTS.stress;
    score += stressDelta;
    breakdown.push({
      term: 'stress',
      weight: DEFAULT_WEIGHTS.stress,
      delta: stressDelta,
      explanation: `Stress: ${stress}`
    });
  }

  // 5. Surname euphony
  if (surname) {
    const euphony = calculateEuphony(name.display, surname);
    const euphonyDelta = euphony.score * DEFAULT_WEIGHTS.surname;
    score += euphonyDelta;
    breakdown.push({
      term: 'surname',
      weight: DEFAULT_WEIGHTS.surname,
      delta: euphonyDelta,
      explanation: `Sounds good with "${surname}"`
    });
  }

  // 6. Initials policy (avoid certain initials)
  if (surname && prefs.initialsPolicyMulti.length > 0) {
    const initials = name.display[0] + '.' + surname[0];
    const badInitials = prefs.initialsPolicyMulti.some((bad) => bad === initials);
    if (badInitials) {
      score += -1 * DEFAULT_WEIGHTS.initials;
      breakdown.push({
        term: 'initials',
        weight: DEFAULT_WEIGHTS.initials,
        delta: -1 * DEFAULT_WEIGHTS.initials,
        explanation: `Initials ${initials} avoided`
      });
    }
  }

  // 7. Nickname policy
  if (prefs.nicknamePolicy === 'Kısa lakap istiyorum') {
    const hasNickname = name.nicknameCandidates.length > 0 ? 1 : 0;
    const nicknameDelta = hasNickname * DEFAULT_WEIGHTS.nickname;
    score += nicknameDelta;
    breakdown.push({
      term: 'nickname',
      weight: DEFAULT_WEIGHTS.nickname,
      delta: nicknameDelta,
      explanation: hasNickname
        ? `Nicknames: ${name.nicknameCandidates.join(', ')}`
        : 'No nickname'
    });
  } else if (prefs.nicknamePolicy === 'Lakap istemiyorum') {
    const hasNickname = name.nicknameCandidates.length > 0 ? -1 : 0;
    const nicknameDelta = hasNickname * DEFAULT_WEIGHTS.nickname;
    score += nicknameDelta;
    breakdown.push({
      term: 'nickname',
      weight: DEFAULT_WEIGHTS.nickname,
      delta: nicknameDelta,
      explanation: hasNickname ? 'Has nicknames (avoided)' : 'No nickname (good)'
    });
  }

  // 8. Morphological affixes
  const morphDelta =
    tagOverlap(name.morphTags, prefs.morphAffixPreferenceMulti) * DEFAULT_WEIGHTS.morph;
  score += morphDelta;
  breakdown.push({
    term: 'morph',
    weight: DEFAULT_WEIGHTS.morph,
    delta: morphDelta,
    explanation: `Morphology: ${name.morphTags.join(', ')}`
  });

  // 9. Registry risk
  if (prefs.civilRegistryStrict) {
    const riskPenalty = name.registryRisk * -0.3 * DEFAULT_WEIGHTS.registry;
    score += riskPenalty;
    breakdown.push({
      term: 'registry',
      weight: DEFAULT_WEIGHTS.registry,
      delta: riskPenalty,
      explanation: `Registry risk: ${name.registryRisk}/3`
    });
  }

  // 10. Spelling confusion
  if (prefs.spellingAmbiguity && name.spellingConfusion.length > 0) {
    const spellingPenalty = -0.5 * DEFAULT_WEIGHTS.spelling;
    score += spellingPenalty;
    breakdown.push({
      term: 'spelling',
      weight: DEFAULT_WEIGHTS.spelling,
      delta: spellingPenalty,
      explanation: `Spelling confusion: ${name.spellingConfusion.join(', ')}`
    });
  }

  // 11. Negative associations
  if (prefs.negativeAssocCheck && name.negativeAssocScore > 0.3) {
    const negativePenalty = -name.negativeAssocScore * DEFAULT_WEIGHTS.negative;
    score += negativePenalty;
    breakdown.push({
      term: 'negative',
      weight: DEFAULT_WEIGHTS.negative,
      delta: negativePenalty,
      explanation: `Potential negative associations`
    });
  }

  // 12. Diacritics policy
  if (prefs.diacriticsPolicy === 'ASCII ikizini göster' && name.diacritics) {
    const diacriticBonus = 0.2 * DEFAULT_WEIGHTS.diacritics;
    score += diacriticBonus;
    breakdown.push({
      term: 'diacritics',
      weight: DEFAULT_WEIGHTS.diacritics,
      delta: diacriticBonus,
      explanation: `ASCII twin: ${name.asciiTwin}`
    });
  }

  // TODO: Add trend, uniqueness, region, diaspora scoring
  // These require time series and region data

  return { score, breakdown };
}

/**
 * Score a batch of names and sort by score
 */
export function scoreBatch(
  names: NameData[],
  timeSeriesMap: Map<bigint, FrequencyData[]>,
  prefs: Preferences,
  surname?: string
): Array<NameData & { score: number; breakdown: ScoreBreakdown[] }> {
  const results = names
    .map((name) => {
      const timeSeries = timeSeriesMap.get(name.id) || [];
      const { score, breakdown } = scoreNamem(name, timeSeries, prefs, surname);
      return { ...name, score, breakdown };
    })
    .filter((r) => r.score > -Infinity)
    .sort((a, b) => b.score - a.score);

  return results;
}

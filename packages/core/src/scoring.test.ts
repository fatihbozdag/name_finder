/**
 * Tests for scoring engine
 */

import { describe, it, expect } from 'vitest';
import { scoreNamem, scoreBatch } from './scoring';
import type { NameData, FrequencyData } from './scoring';
import type { Preferences } from '@turkish-name-finder/data';

const mockName: NameData = {
  id: BigInt(1),
  slug: 'ayse',
  display: 'Ayşe',
  gender: 'K',
  origin: 'Türkçe',
  meaning: 'Ay gibi güzel',
  isUnisex: false,
  isPureTurkish: true,
  styleTags: ['Klasik'],
  semanticTags: ['Doğa', 'Işık'],
  morphTags: [],
  stressPattern: 'final',
  syllables: 2,
  startsWith: 'A',
  endsWith: 'e',
  letters: ['a', 'y', 'ş', 'e'],
  diacritics: true,
  asciiTwin: 'Ayse',
  nicknameCandidates: ['Ayş'],
  compound: false,
  registryRisk: 0,
  spellingConfusion: [],
  negativeAssocScore: 0
};

const defaultPrefs: Preferences = {
  goal: 'kisa_liste',
  gender: 'K',
  origin: 'turkce_agirlikli',
  strictTrAlphabet: false,
  styleMulti: ['Klasik'],
  semanticDomainsMulti: ['Doğa'],
  virtueBias: 'Farketmez',
  religioPref: 'Farketmez',
  historicMythRef: 'Farketmez',
  syllablesMin: 1,
  syllablesMax: 4,
  syllablesPreferred: 2,
  lettersMust: [],
  lettersAvoid: [],
  startsWith: [],
  endsWith: [],
  stressPref: 'Farketmez',
  pronounceSimple: 'Farketmez',
  nicknamePolicy: 'Farketmez',
  morphAffixPreferenceMulti: [],
  spellingAmbiguity: false,
  uniqueness: 'Denge',
  uniquenessScope: 'Türkiye',
  trend: 'Farketmez',
  trendHalflife: 50,
  rarityVsSpelling: 'Yazımı kolay',
  regionPreferenceMulti: [],
  unisexStrict: false,
  siblingStyleFit: 'Farketmez',
  surname: undefined,
  initialsPolicyMulti: [],
  doubleName: 'Farketmez',
  honorFamilyText: undefined,
  vetoListMulti: [],
  shortlistSize: 7,
  tiebreaker: 'Soyad uyumu',
  partnerMerge: 'Ortalama',
  diasporaLocalesMulti: [],
  diacriticsPolicy: 'Gerek yok',
  handlePriority: false,
  genderAmbiguity: 'Farketmez',
  bullyScan: true,
  decisionDeadline: undefined,
  nonTurkicRootsOk: 'Açığım',
  civilRegistryStrict: false,
  negativeAssocCheck: true,
  personalAssocAvoidText: undefined,
  meaningTransparency: 'Farketmez'
};

describe('Scoring engine', () => {
  it('should score a matching name positively', () => {
    const { score, breakdown } = scoreNamem(mockName, [], defaultPrefs);

    expect(score).toBeGreaterThan(0);
    expect(breakdown).toBeDefined();
    expect(breakdown.length).toBeGreaterThan(0);
  });

  it('should exclude names that violate hard constraints - gender', () => {
    const prefs: Preferences = {
      ...defaultPrefs,
      gender: 'E' // Boy
    };

    const { score } = scoreNamem(mockName, [], prefs);
    expect(score).toBe(-Infinity);
  });

  it('should exclude names with forbidden letters', () => {
    const prefs: Preferences = {
      ...defaultPrefs,
      lettersAvoid: ['ş']
    };

    const { score } = scoreNamem(mockName, [], prefs);
    expect(score).toBe(-Infinity);
  });

  it('should require must-have letters', () => {
    const prefs: Preferences = {
      ...defaultPrefs,
      lettersMust: ['a', 'y']
    };

    const { score } = scoreNamem(mockName, [], prefs);
    expect(score).toBeGreaterThan(-Infinity);
  });

  it('should exclude names outside syllable range', () => {
    const prefs: Preferences = {
      ...defaultPrefs,
      syllablesMin: 3,
      syllablesMax: 4
    };

    const { score } = scoreNamem(mockName, [], prefs); // Ayşe has 2 syllables
    expect(score).toBe(-Infinity);
  });

  it('should bonus for preferred syllable count', () => {
    const prefs2syllables: Preferences = {
      ...defaultPrefs,
      syllablesPreferred: 2
    };

    const prefs3syllables: Preferences = {
      ...defaultPrefs,
      syllablesPreferred: 3
    };

    const score2 = scoreNamem(mockName, [], prefs2syllables).score;
    const score3 = scoreNamem(mockName, [], prefs3syllables).score;

    expect(score2).toBeGreaterThan(score3); // Should prefer 2-syllable match
  });

  it('should score style tag overlap', () => {
    const prefsMatching: Preferences = {
      ...defaultPrefs,
      styleMulti: ['Klasik'] // Matches mockName
    };

    const prefsNonMatching: Preferences = {
      ...defaultPrefs,
      styleMulti: ['Modern'] // Doesn't match
    };

    const scoreMatching = scoreNamem(mockName, [], prefsMatching).score;
    const scoreNonMatching = scoreNamem(mockName, [], prefsNonMatching).score;

    expect(scoreMatching).toBeGreaterThan(scoreNonMatching);
  });

  it('should score surname euphony', () => {
    const { score: scoreWithSurname, breakdown } = scoreNamem(
      mockName,
      [],
      defaultPrefs,
      'Yılmaz'
    );

    const { score: scoreWithoutSurname } = scoreNamem(mockName, [], defaultPrefs);

    expect(scoreWithSurname).not.toBe(scoreWithoutSurname);

    const surnameBreakdown = breakdown.find((b) => b.term === 'surname');
    expect(surnameBreakdown).toBeDefined();
  });

  it('should enforce origin constraint', () => {
    const turkishOnly: Preferences = {
      ...defaultPrefs,
      origin: 'sadece_turkce'
    };

    const nonTurkishName: NameData = {
      ...mockName,
      isPureTurkish: false,
      origin: 'Arapça'
    };

    const { score } = scoreNamem(nonTurkishName, [], turkishOnly);
    expect(score).toBe(-Infinity);
  });

  it('should handle veto list', () => {
    const prefsWithVeto: Preferences = {
      ...defaultPrefs,
      vetoListMulti: ['Ayşe', 'Fatma']
    };

    const { score } = scoreNamem(mockName, [], prefsWithVeto);
    expect(score).toBe(-Infinity);
  });

  it('should batch score and sort names', () => {
    const names: NameData[] = [
      mockName,
      {
        ...mockName,
        id: BigInt(2),
        slug: 'zeynep',
        display: 'Zeynep',
        styleTags: ['Modern'], // Different style
        syllables: 2
      },
      {
        ...mockName,
        id: BigInt(3),
        slug: 'elif',
        display: 'Elif',
        styleTags: ['Klasik'], // Matches preference
        syllables: 2
      }
    ];

    const timeSeriesMap = new Map<bigint, FrequencyData[]>();
    const results = scoreBatch(names, timeSeriesMap, defaultPrefs);

    expect(results.length).toBe(3);
    expect(results[0].score).toBeGreaterThanOrEqual(results[1].score);
    expect(results[1].score).toBeGreaterThanOrEqual(results[2].score);
  });

  it('should provide transparent breakdown', () => {
    const { breakdown } = scoreNamem(mockName, [], defaultPrefs);

    expect(breakdown).toBeDefined();
    expect(breakdown.length).toBeGreaterThan(0);

    // Each breakdown should have term, weight, delta
    breakdown.forEach((b) => {
      expect(b.term).toBeDefined();
      expect(typeof b.weight).toBe('number');
      expect(typeof b.delta).toBe('number');
    });
  });
});

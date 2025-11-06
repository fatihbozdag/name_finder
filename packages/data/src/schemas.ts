/**
 * Zod schemas for Turkish Name Finder
 * Based on the canonical selection tree (40 questions across 6 screens)
 */

import { z } from 'zod';

// Enums matching the selection tree
export const GoalEnum = z.enum(['tek_oneri', 'kisa_liste', 'kesfet']);
export const GenderEnum = z.enum(['K', 'E', 'U', 'ALL']);
export const OriginPreferenceEnum = z.enum([
  'sadece_turkce',
  'turkce_agirlikli',
  'farketmez',
  'arapca_farsca_ok'
]);

export const StyleTagEnum = z.enum([
  'Klasik',
  'Modern',
  'Doğa',
  'Dini',
  'Mitoloji',
  'Minimal',
  'Nadir',
  'Popüler'
]);

export const SemanticDomainEnum = z.enum([
  'Doğa',
  'Erdem',
  'Mitoloji',
  'Renk',
  'Gökyüzü',
  'Su',
  'Dağ',
  'Bitki',
  'Hayvan',
  'Işık'
]);

export const YesNoMaybeEnum = z.enum(['Evet', 'Hayır', 'Farketmez']);

export const UniquenessEnum = z.enum(['Yüksek', 'Denge', 'Popüler olabilir']);
export const UniquenessScope = z.enum(['Türkiye', 'Bulunduğum il']);

export const TrendPreferenceEnum = z.enum(['Trend', 'Zamansız', 'Farketmez']);

export const RegionEnum = z.enum([
  'Karadeniz',
  'Marmara',
  'Ege',
  'İç Anadolu',
  'Akdeniz',
  'Doğu',
  'Güneydoğu'
]);

export const StressPreferenceEnum = z.enum(['Sonda', 'Farketmez']);

export const MorphAffixEnum = z.enum(['-can', '-han', '-nur', '-su', '-alp', '-ay']);

export const DiasporaLocaleEnum = z.enum(['en', 'de', 'fr', 'nl', 'se', 'no']);

export const TiebreakerEnum = z.enum(['Trend', 'Zamansız', 'En kısa', 'Soyad uyumu']);
export const PartnerMergeMethodEnum = z.enum(['Kesişim', 'Ortalama', 'Borda']);

// Full preference schema matching all 40 questions
export const PreferencesSchema = z.object({
  // S1: Goal, Gender, Origin
  goal: GoalEnum.default('kisa_liste'),
  gender: GenderEnum,
  origin: OriginPreferenceEnum.default('turkce_agirlikli'),
  strictTrAlphabet: z.boolean().default(false), // Q15: no W,Q,X

  // S2: Style, Meaning
  styleMulti: z.array(StyleTagEnum).default([]),
  semanticDomainsMulti: z.array(SemanticDomainEnum).default([]),
  virtueBias: YesNoMaybeEnum.default('Farketmez'), // Q17
  religioPref: YesNoMaybeEnum.default('Farketmez'), // Q18
  historicMythRef: YesNoMaybeEnum.default('Farketmez'), // Q19

  // S3: Sound, Form
  syllablesMin: z.number().int().min(1).max(4).default(1),
  syllablesMax: z.number().int().min(1).max(4).default(4),
  syllablesPreferred: z.number().int().min(1).max(4).optional(),
  lettersMust: z.array(z.string()).default([]), // Q9
  lettersAvoid: z.array(z.string()).default([]), // Q9b
  startsWith: z.array(z.string()).default([]), // Q10
  endsWith: z.array(z.string()).default([]), // Q10b
  stressPref: StressPreferenceEnum.default('Farketmez'), // Q11
  pronounceSimple: z.enum(['Öncelik', 'Farketmez']).default('Farketmez'), // Q12
  nicknamePolicy: z
    .enum(['Kısa lakap istiyorum', 'Lakap istemiyorum', 'Farketmez'])
    .default('Farketmez'), // Q13
  morphAffixPreferenceMulti: z.array(MorphAffixEnum).default([]), // Q14
  spellingAmbiguity: z.boolean().default(false), // Q30: avoid names with confusing spelling

  // S4: Popularity, Trend, Region
  uniqueness: UniquenessEnum.default('Denge'), // Q6
  uniquenessScope: UniquenessScope.default('Türkiye'), // Q21
  trend: TrendPreferenceEnum.default('Farketmez'), // Q7
  trendHalflife: z.number().min(0).max(100).default(50), // Q23: how much trend matters
  rarityVsSpelling: z.enum(['Rarite önemli', 'Yazımı kolay']).default('Yazımı kolay'), // Q24
  regionPreferenceMulti: z.array(RegionEnum).default([]), // Q35

  // S5: Family, Collaboration, Guardrails
  unisexStrict: z.boolean().default(false), // Q2b: strict unisex enforcement
  siblingStyleFit: z.enum(['İstiyorum', 'Farketmez']).default('Farketmez'), // Q1b
  surname: z.string().optional(), // Q2c
  initialsPolicyMulti: z.array(z.string()).default([]), // Q3b: avoid initials like "A.K."
  doubleName: YesNoMaybeEnum.default('Farketmez'), // Q4: "Ali Can" style
  honorFamilyText: z.string().optional(), // Q5: family name to honor
  vetoListMulti: z.array(z.string()).default([]), // Q6b: names to exclude
  shortlistSize: z.number().int().min(3).max(30).default(7), // Q31
  tiebreaker: TiebreakerEnum.default('Soyad uyumu'), // Q32
  partnerMerge: PartnerMergeMethodEnum.default('Ortalama'), // Q33

  // S6: Logistics, Sensitivity
  diasporaLocalesMulti: z.array(DiasporaLocaleEnum).default([]), // Q25
  diacriticsPolicy: z
    .enum(['ASCII ikizini göster', 'Gerek yok'])
    .default('Gerek yok'), // Q26
  handlePriority: z.boolean().default(false), // Q27: social media handle availability
  genderAmbiguity: z
    .enum(['Sorun olur', 'Sorun olmaz', 'Farketmez'])
    .default('Farketmez'), // Q28
  bullyScan: z.boolean().default(true), // Q29
  decisionDeadline: z.string().optional(), // Q34: YYYY-MM-DD
  nonTurkicRootsOk: z
    .enum(['Açığım', 'Kapalıyım', 'Farketmez'])
    .default('Açığım'), // Q36
  civilRegistryStrict: z.boolean().default(false), // Q37: avoid risky names
  negativeAssocCheck: z.boolean().default(true), // Q38
  personalAssocAvoidText: z.string().optional(), // Q39: personal associations to avoid
  meaningTransparency: z
    .enum(['Açık', 'Örtük', 'Farketmez'])
    .default('Farketmez') // Q40
});

export type Preferences = z.infer<typeof PreferencesSchema>;

// Scoring weights (exported for transparency)
export const DEFAULT_WEIGHTS = {
  style: 1.0,
  semantics: 0.8,
  syllables: 0.7,
  stress: 0.2,
  surname: 0.8,
  initials: 1.0,
  nickname: 0.3,
  morph: 0.3,
  uniqueness: 1.0,
  trend: 0.6,
  region: 0.5,
  religio: 0.5,
  origin: 1.0,
  unisex: 0.7,
  diaspora: 0.6,
  diacritics: 0.3,
  registry: 0.6,
  spelling: 0.5,
  negative: 0.8,
  bully: 0.6,
  meaningTransparency: 0.2
} as const;

// Score breakdown for transparency
export const ScoreBreakdownSchema = z.object({
  term: z.string(), // e.g., "style", "surname", "trend"
  weight: z.number(),
  delta: z.number(), // contribution to final score
  explanation: z.string().optional()
});

export type ScoreBreakdown = z.infer<typeof ScoreBreakdownSchema>;

// Name result with score and reasoning
export const NameResultSchema = z.object({
  id: z.bigint(),
  name: z.string(),
  slug: z.string(),
  gender: z.enum(['K', 'E', 'U']),
  meaning: z.string().optional(),
  origin: z.string().optional(),
  score: z.number(),
  reasons: z.array(z.string()), // Top 3-5 human-readable reasons
  breakdown: z.array(ScoreBreakdownSchema), // Full term-by-term breakdown
  flags: z.object({
    diacritics: z.boolean().optional(),
    spellingConfusion: z.boolean().optional(),
    registryRisk: z.number().optional(),
    negativeAssoc: z.boolean().optional(),
    diasporaDifficult: z.boolean().optional()
  })
});

export type NameResult = z.infer<typeof NameResultSchema>;

// API request/response types
export const ScoreRequestSchema = z.object({
  prefs: PreferencesSchema,
  surname: z.string().optional()
});

export const ScoreResponseSchema = z.object({
  results: z.array(NameResultSchema),
  guardrails: z
    .array(
      z.object({
        filter: z.string(),
        excluded: z.number()
      })
    )
    .optional()
});

export type ScoreRequest = z.infer<typeof ScoreRequestSchema>;
export type ScoreResponse = z.infer<typeof ScoreResponseSchema>;

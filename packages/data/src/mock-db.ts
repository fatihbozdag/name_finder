/**
 * Mock database for testing without Prisma
 *
 * This provides an in-memory implementation of the database
 * that can be used when Prisma client is not available.
 */

import {
  toLowerCaseTurkish,
  generateSlug,
  countSyllables,
  estimateStress,
  hasTurkishDiacritics,
  toAsciiTwin,
  extractLetters,
  isStrictTurkishAlphabet
} from '@turkish-name-finder/core';

// Inline seed data to avoid cross-package dependencies
interface SeedName {
  display: string;
  gender: 'K' | 'E' | 'U';
  origin: string;
  meaning: string;
  isPureTurkish: boolean;
  styleTags: string[];
  semanticTags: string[];
  morphTags: string[];
  nicknameCandidates: string[];
  isUnisex: boolean;
  source: any;
}

const SEED_NAMES: SeedName[] = [
  {
    display: 'Ayşe',
    gender: 'K',
    origin: 'Arapça',
    meaning: 'Yaşayan, hayat dolu',
    isPureTurkish: false,
    styleTags: ['Klasik', 'Dini'],
    semanticTags: ['Erdem'],
    morphTags: [],
    nicknameCandidates: ['Ayş'],
    isUnisex: false,
    source: { tdk: 'https://sozluk.gov.tr/' }
  },
  {
    display: 'Zeynep',
    gender: 'K',
    origin: 'Arapça',
    meaning: 'Güzel kokulu ağaç',
    isPureTurkish: false,
    styleTags: ['Klasik', 'Dini'],
    semanticTags: ['Doğa', 'Bitki'],
    morphTags: [],
    nicknameCandidates: ['Zey', 'Nep'],
    isUnisex: false,
    source: { tdk: 'https://sozluk.gov.tr/' }
  },
  {
    display: 'Elif',
    gender: 'K',
    origin: 'Arapça',
    meaning: 'Arap alfabesinin ilk harfi',
    isPureTurkish: false,
    styleTags: ['Klasik', 'Minimal', 'Dini'],
    semanticTags: ['Erdem'],
    morphTags: [],
    nicknameCandidates: ['Eli'],
    isUnisex: false,
    source: { tdk: 'https://sozluk.gov.tr/' }
  },
  {
    display: 'Defne',
    gender: 'K',
    origin: 'Türkçe',
    meaning: 'Defne ağacı',
    isPureTurkish: true,
    styleTags: ['Modern', 'Doğa'],
    semanticTags: ['Doğa', 'Bitki'],
    morphTags: [],
    nicknameCandidates: ['Def'],
    isUnisex: false,
    source: { tdk: 'https://sozluk.gov.tr/' }
  },
  {
    display: 'Yusuf',
    gender: 'E',
    origin: 'Arapça/İbranice',
    meaning: 'Allah çoğaltır',
    isPureTurkish: false,
    styleTags: ['Klasik', 'Dini'],
    semanticTags: ['Erdem'],
    morphTags: [],
    nicknameCandidates: ['Yusu'],
    isUnisex: false,
    source: { tdk: 'https://sozluk.gov.tr/' }
  },
  {
    display: 'Emir',
    gender: 'E',
    origin: 'Arapça',
    meaning: 'Kumandan, emir veren',
    isPureTurkish: false,
    styleTags: ['Modern', 'Minimal'],
    semanticTags: ['Erdem'],
    morphTags: [],
    nicknameCandidates: [],
    isUnisex: false,
    source: { tdk: 'https://sozluk.gov.tr/' }
  },
  {
    display: 'Deniz',
    gender: 'U',
    origin: 'Türkçe',
    meaning: 'Deniz',
    isPureTurkish: true,
    styleTags: ['Modern', 'Doğa'],
    semanticTags: ['Doğa', 'Su'],
    morphTags: [],
    nicknameCandidates: [],
    isUnisex: true,
    source: { tdk: 'https://sozluk.gov.tr/' }
  },
  {
    display: 'Arda',
    gender: 'E',
    origin: 'Türkçe',
    meaning: 'Irmak adı',
    isPureTurkish: true,
    styleTags: ['Modern', 'Minimal'],
    semanticTags: ['Doğa', 'Su'],
    morphTags: [],
    nicknameCandidates: [],
    isUnisex: false,
    source: { tdk: 'https://sozluk.gov.tr/' }
  }
];

function enrichName(seedName: SeedName) {
  const slug = generateSlug(seedName.display);
  const syllables = countSyllables(seedName.display);
  const stress = estimateStress(seedName.display);
  const diacritics = hasTurkishDiacritics(seedName.display);
  const asciiTwin = toAsciiTwin(seedName.display);
  const letters = extractLetters(seedName.display);

  return {
    slug,
    display: seedName.display,
    gender: seedName.gender,
    origin: seedName.origin,
    meaning: seedName.meaning,
    isUnisex: seedName.isUnisex,
    isPureTurkish: seedName.isPureTurkish,
    styleTags: seedName.styleTags,
    semanticTags: seedName.semanticTags,
    morphTags: seedName.morphTags,
    stressPattern: stress,
    syllables,
    startsWith: seedName.display[0],
    endsWith: seedName.display[seedName.display.length - 1],
    letters,
    diacritics,
    asciiTwin,
    nicknameCandidates: seedName.nicknameCandidates,
    compound: seedName.morphTags.length > 0,
    registryRisk: 0,
    spellingConfusion: [],
    negativeAssocScore: 0,
    source: seedName.source
  };
}

export type Name = {
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
  createdAt: Date;
  source: any;
};

export type NameFrequency = {
  id: bigint;
  nameId: bigint;
  year: number;
  gender: 'K' | 'E' | 'U';
  provinceCode: string | null;
  count: number | null;
  rank: number | null;
  source: any;
};

// In-memory data store
let nextId = 1n;
const names: Map<bigint, Name> = new Map();
const frequencies: NameFrequency[] = [];

/**
 * Initialize mock database with seed data
 */
export function initMockDb() {
  names.clear();
  frequencies.length = 0;
  nextId = 1n;

  // Add seed names
  SEED_NAMES.forEach((seedName) => {
    const enriched = enrichName(seedName);
    const id = nextId++;

    names.set(id, {
      id,
      slug: enriched.slug,
      display: enriched.display,
      gender: enriched.gender,
      origin: enriched.origin,
      meaning: enriched.meaning,
      isUnisex: enriched.isUnisex,
      isPureTurkish: enriched.isPureTurkish,
      styleTags: enriched.styleTags,
      semanticTags: enriched.semanticTags,
      morphTags: enriched.morphTags,
      stressPattern: enriched.stressPattern,
      syllables: enriched.syllables,
      startsWith: enriched.startsWith,
      endsWith: enriched.endsWith,
      letters: enriched.letters,
      diacritics: enriched.diacritics,
      asciiTwin: enriched.asciiTwin,
      nicknameCandidates: enriched.nicknameCandidates,
      compound: enriched.compound,
      registryRisk: enriched.registryRisk,
      spellingConfusion: enriched.spellingConfusion,
      negativeAssocScore: enriched.negativeAssocScore,
      createdAt: new Date(),
      source: enriched.source
    });
  });

  // Add sample frequency data
  const elif = Array.from(names.values()).find((n) => n.slug === 'elif');
  const zeynep = Array.from(names.values()).find((n) => n.slug === 'zeynep');
  const yusuf = Array.from(names.values()).find((n) => n.slug === 'yusuf');
  const emir = Array.from(names.values()).find((n) => n.slug === 'emir');

  if (elif) {
    frequencies.push(
      {
        id: 1n,
        nameId: elif.id,
        year: 2024,
        gender: 'K',
        provinceCode: null,
        count: 12500,
        rank: 1,
        source: { tuik: 'https://nip.tuik.gov.tr/' }
      },
      {
        id: 2n,
        nameId: elif.id,
        year: 2023,
        gender: 'K',
        provinceCode: null,
        count: 13200,
        rank: 1,
        source: { tuik: 'https://nip.tuik.gov.tr/' }
      }
    );
  }

  if (zeynep) {
    frequencies.push({
      id: 3n,
      nameId: zeynep.id,
      year: 2024,
      gender: 'K',
      provinceCode: null,
      count: 10800,
      rank: 2,
      source: { tuik: 'https://nip.tuik.gov.tr/' }
    });
  }

  if (yusuf) {
    frequencies.push({
      id: 4n,
      nameId: yusuf.id,
      year: 2024,
      gender: 'E',
      provinceCode: null,
      count: 11200,
      rank: 1,
      source: { tuik: 'https://nip.tuik.gov.tr/' }
    });
  }

  if (emir) {
    frequencies.push({
      id: 5n,
      nameId: emir.id,
      year: 2024,
      gender: 'E',
      provinceCode: null,
      count: 10500,
      rank: 2,
      source: { tuik: 'https://nip.tuik.gov.tr/' }
    });
  }

  console.log(`✅ Mock DB initialized with ${names.size} names and ${frequencies.length} frequency records`);
}

/**
 * Mock Prisma client implementation
 */
export const mockPrisma = {
  name: {
    findMany: async (args?: any) => {
      let results = Array.from(names.values());

      // Apply where filters
      if (args?.where) {
        if (args.where.gender && args.where.gender !== 'ALL') {
          results = results.filter(
            (n) => n.gender === args.where.gender || n.gender === 'U'
          );
        }
        if (args.where.origin) {
          results = results.filter((n) => n.origin === args.where.origin);
        }
        if (args.where.slug) {
          results = results.filter((n) => n.slug === args.where.slug);
        }
        // Handle OR conditions for search
        if (args.where.OR) {
          const orResults: Name[] = [];
          args.where.OR.forEach((condition: any) => {
            if (condition.display?.contains) {
              const query = condition.display.contains.toLowerCase();
              results.forEach((n) => {
                if (n.display.toLowerCase().includes(query)) {
                  orResults.push(n);
                }
              });
            }
            if (condition.slug?.contains) {
              const query = condition.slug.contains.toLowerCase();
              results.forEach((n) => {
                if (n.slug.toLowerCase().includes(query)) {
                  orResults.push(n);
                }
              });
            }
          });
          results = orResults;
        }
      }

      // Apply skip/take for pagination
      if (args?.skip) {
        results = results.slice(args.skip);
      }
      if (args?.take) {
        results = results.slice(0, args.take);
      }

      return results;
    },

    findUnique: async (args: any) => {
      if (args.where.slug) {
        return Array.from(names.values()).find((n) => n.slug === args.where.slug) || null;
      }
      if (args.where.id) {
        return names.get(args.where.id) || null;
      }
      return null;
    },

    count: async (args?: any) => {
      let results = Array.from(names.values());

      if (args?.where) {
        if (args.where.gender && args.where.gender !== 'ALL') {
          results = results.filter(
            (n) => n.gender === args.where.gender || n.gender === 'U'
          );
        }
        if (args.where.origin) {
          results = results.filter((n) => n.origin === args.where.origin);
        }
      }

      return results.length;
    }
  },

  nameFrequency: {
    findMany: async (args?: any) => {
      let results = frequencies;

      if (args?.where?.nameId) {
        results = results.filter((f) => f.nameId === args.where.nameId);
      }

      if (args?.orderBy) {
        results = [...results].sort((a, b) => {
          if (args.orderBy.year === 'desc') {
            return b.year - a.year;
          }
          return a.year - b.year;
        });
      }

      if (args?.take) {
        results = results.slice(0, args.take);
      }

      return results;
    }
  }
};

// Initialize on import
initMockDb();

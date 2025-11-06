/**
 * Manual seed data for Turkish Baby Name Finder
 *
 * This file contains a curated list of Turkish names with complete metadata.
 * Data sources:
 * - TDK Kişi Adları Sözlüğü: https://sozluk.gov.tr/
 * - TÜİK Nüfus İstatistikleri: https://nip.tuik.gov.tr/
 *
 * Each entry includes provenance (source links) for transparency and licensing.
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

export interface SeedName {
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
  source: {
    tdk: string;
    tuik?: string;
    notes?: string;
  };
}

/**
 * Core Turkish names - manually curated from TDK
 * This is a starter set for testing. Full ETL will add 1000+ names.
 */
export const SEED_NAMES: SeedName[] = [
  // Popular Turkish girl names
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
    source: {
      tdk: 'https://sozluk.gov.tr/',
      tuik: 'https://nip.tuik.gov.tr/',
      notes: 'Most popular Turkish girl name for decades'
    }
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
    source: {
      tdk: 'https://sozluk.gov.tr/',
      tuik: 'https://nip.tuik.gov.tr/',
      notes: 'Traditional name, very common'
    }
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
    source: {
      tdk: 'https://sozluk.gov.tr/',
      tuik: 'https://nip.tuik.gov.tr/',
      notes: 'Short, elegant, very popular in 2000s-2020s'
    }
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
    source: {
      tdk: 'https://sozluk.gov.tr/',
      tuik: 'https://nip.tuik.gov.tr/',
      notes: 'Nature name, rising in popularity'
    }
  },
  {
    display: 'Nehir',
    gender: 'K',
    origin: 'Türkçe',
    meaning: 'Akarsu',
    isPureTurkish: true,
    styleTags: ['Modern', 'Doğa'],
    semanticTags: ['Doğa', 'Su'],
    morphTags: [],
    nicknameCandidates: [],
    isUnisex: false,
    source: {
      tdk: 'https://sozluk.gov.tr/',
      notes: 'Modern nature name'
    }
  },
  {
    display: 'Ela',
    gender: 'K',
    origin: 'Türkçe',
    meaning: 'Ela gözlü, açık kahverengi',
    isPureTurkish: true,
    styleTags: ['Modern', 'Minimal'],
    semanticTags: ['Renk'],
    morphTags: [],
    nicknameCandidates: [],
    isUnisex: false,
    source: {
      tdk: 'https://sozluk.gov.tr/',
      tuik: 'https://nip.tuik.gov.tr/',
      notes: 'Short, modern, popular in 2010s'
    }
  },
  {
    display: 'Azra',
    gender: 'K',
    origin: 'Arapça',
    meaning: 'Bakire, tertemiz',
    isPureTurkish: false,
    styleTags: ['Klasik', 'Dini'],
    semanticTags: ['Erdem'],
    morphTags: [],
    nicknameCandidates: [],
    isUnisex: false,
    source: {
      tdk: 'https://sozluk.gov.tr/',
      notes: 'Classical Arabic origin'
    }
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
    source: {
      tdk: 'https://sozluk.gov.tr/',
      tuik: 'https://nip.tuik.gov.tr/',
      notes: 'Popular unisex name, more common for boys'
    }
  },

  // Popular Turkish boy names
  {
    display: 'Mehmet',
    gender: 'E',
    origin: 'Arapça',
    meaning: 'Övülmüş, övülmeye layık',
    isPureTurkish: false,
    styleTags: ['Klasik', 'Dini'],
    semanticTags: ['Erdem'],
    morphTags: [],
    nicknameCandidates: ['Memo', 'Met'],
    isUnisex: false,
    source: {
      tdk: 'https://sozluk.gov.tr/',
      tuik: 'https://nip.tuik.gov.tr/',
      notes: 'Most common Turkish male name historically'
    }
  },
  {
    display: 'Ahmet',
    gender: 'E',
    origin: 'Arapça',
    meaning: 'Çok övülen',
    isPureTurkish: false,
    styleTags: ['Klasik', 'Dini'],
    semanticTags: ['Erdem'],
    morphTags: [],
    nicknameCandidates: ['Ahmo'],
    isUnisex: false,
    source: {
      tdk: 'https://sozluk.gov.tr/',
      tuik: 'https://nip.tuik.gov.tr/',
      notes: 'Second most common Turkish male name'
    }
  },
  {
    display: 'Mustafa',
    gender: 'E',
    origin: 'Arapça',
    meaning: 'Seçilmiş, tercih edilmiş',
    isPureTurkish: false,
    styleTags: ['Klasik', 'Dini'],
    semanticTags: ['Erdem'],
    morphTags: [],
    nicknameCandidates: ['Musti'],
    isUnisex: false,
    source: {
      tdk: 'https://sozluk.gov.tr/',
      tuik: 'https://nip.tuik.gov.tr/',
      notes: 'Traditional name, very common'
    }
  },
  {
    display: 'Ali',
    gender: 'E',
    origin: 'Arapça',
    meaning: 'Yüce, yüksek',
    isPureTurkish: false,
    styleTags: ['Klasik', 'Minimal', 'Dini'],
    semanticTags: ['Erdem'],
    morphTags: [],
    nicknameCandidates: [],
    isUnisex: false,
    source: {
      tdk: 'https://sozluk.gov.tr/',
      tuik: 'https://nip.tuik.gov.tr/',
      notes: 'Short, classic, timeless'
    }
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
    source: {
      tdk: 'https://sozluk.gov.tr/',
      tuik: 'https://nip.tuik.gov.tr/',
      notes: 'Biblical/Quranic name, very popular in 2000s-2010s'
    }
  },
  {
    display: 'Ege',
    gender: 'E',
    origin: 'Türkçe',
    meaning: 'Ege Denizi',
    isPureTurkish: true,
    styleTags: ['Modern', 'Minimal', 'Doğa'],
    semanticTags: ['Doğa', 'Su'],
    morphTags: [],
    nicknameCandidates: [],
    isUnisex: false,
    source: {
      tdk: 'https://sozluk.gov.tr/',
      tuik: 'https://nip.tuik.gov.tr/',
      notes: 'Modern geographical name, popular in 2000s'
    }
  },
  {
    display: 'Arda',
    gender: 'E',
    origin: 'Türkçe',
    meaning: 'Irmak adı (Bulgaristan)',
    isPureTurkish: true,
    styleTags: ['Modern', 'Minimal'],
    semanticTags: ['Doğa', 'Su'],
    morphTags: [],
    nicknameCandidates: [],
    isUnisex: false,
    source: {
      tdk: 'https://sozluk.gov.tr/',
      tuik: 'https://nip.tuik.gov.tr/',
      notes: 'Modern name, very popular in 2000s-2010s'
    }
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
    source: {
      tdk: 'https://sozluk.gov.tr/',
      tuik: 'https://nip.tuik.gov.tr/',
      notes: 'Modern favorite, top 10 in 2010s-2020s'
    }
  },

  // Names with morphological tags
  {
    display: 'Alican',
    gender: 'E',
    origin: 'Türkçe + Arapça',
    meaning: 'Ali\'nin canı',
    isPureTurkish: false,
    styleTags: ['Klasik'],
    semanticTags: ['Erdem'],
    morphTags: ['-can'],
    nicknameCandidates: ['Ali'],
    isUnisex: false,
    source: {
      tdk: 'https://sozluk.gov.tr/',
      notes: 'Compound name with -can suffix'
    }
  },
  {
    display: 'Alphan',
    gender: 'E',
    origin: 'Türkçe',
    meaning: 'Yiğit han',
    isPureTurkish: true,
    styleTags: ['Modern'],
    semanticTags: ['Erdem'],
    morphTags: ['-alp', '-han'],
    nicknameCandidates: ['Alp'],
    isUnisex: false,
    source: {
      tdk: 'https://sozluk.gov.tr/',
      notes: 'Compound with Turkic roots'
    }
  },
  {
    display: 'Aylin',
    gender: 'K',
    origin: 'Türkçe',
    meaning: 'Ay\'ın halkası, Ay gibi',
    isPureTurkish: true,
    styleTags: ['Modern', 'Doğa'],
    semanticTags: ['Gökyüzü', 'Işık'],
    morphTags: [],
    nicknameCandidates: ['Ayl'],
    isUnisex: false,
    source: {
      tdk: 'https://sozluk.gov.tr/',
      tuik: 'https://nip.tuik.gov.tr/',
      notes: 'Modern moon-related name'
    }
  },
  {
    display: 'Yağmur',
    gender: 'K',
    origin: 'Türkçe',
    meaning: 'Yağmur',
    isPureTurkish: true,
    styleTags: ['Modern', 'Doğa'],
    semanticTags: ['Doğa', 'Su'],
    morphTags: [],
    nicknameCandidates: [],
    isUnisex: false,
    source: {
      tdk: 'https://sozluk.gov.tr/',
      tuik: 'https://nip.tuik.gov.tr/',
      notes: 'Nature name, popular in 2000s'
    }
  }
];

/**
 * Generate enriched name data for database insertion
 */
export function enrichName(seedName: SeedName) {
  const slug = generateSlug(seedName.display);
  const syllables = countSyllables(seedName.display);
  const stress = estimateStress(seedName.display);
  const diacritics = hasTurkishDiacritics(seedName.display);
  const asciiTwin = toAsciiTwin(seedName.display);
  const letters = extractLetters(seedName.display);
  const strictTurkish = isStrictTurkishAlphabet(seedName.display);

  const firstLetter = seedName.display[0];
  const lastLetter = seedName.display[seedName.display.length - 1];

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
    startsWith: firstLetter,
    endsWith: lastLetter,
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

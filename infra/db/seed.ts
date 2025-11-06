/**
 * Database seeding script for Turkish Name Finder
 *
 * This script populates the database with:
 * 1. Core Turkish names with metadata from TDK
 * 2. Frequency data from TÜİK (when available)
 * 3. Regional distribution data (when available)
 *
 * Usage:
 *   pnpm run seed
 */

import { PrismaClient } from '@prisma/client';
import { SEED_NAMES, enrichName } from '../../tools/etl/src/seed-data.js';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...\n');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.nameFrequency.deleteMany();
  await prisma.regionShare.deleteMany();
  await prisma.nameVariant.deleteMany();
  await prisma.name.deleteMany();
  await prisma.searchEvent.deleteMany();
  console.log('✅ Existing data cleared\n');

  // Seed names
  console.log(`📝 Seeding ${SEED_NAMES.length} names...`);
  let seededCount = 0;

  for (const seedName of SEED_NAMES) {
    try {
      const enriched = enrichName(seedName);

      await prisma.name.create({
        data: {
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
          source: enriched.source
        }
      });

      seededCount++;
      console.log(`  ✓ ${enriched.display} (${enriched.gender}, ${enriched.origin})`);
    } catch (error) {
      console.error(`  ✗ Failed to seed ${seedName.display}:`, error);
    }
  }

  console.log(`\n✅ Successfully seeded ${seededCount}/${SEED_NAMES.length} names\n`);

  // Seed sample frequency data (TÜİK top names from 2020-2024)
  console.log('📊 Seeding frequency data...');

  const frequencyData = [
    // Elif - top girl name 2020s
    { nameslug: 'elif', year: 2024, gender: 'K' as const, count: 12500, rank: 1 },
    { nameslug: 'elif', year: 2023, gender: 'K' as const, count: 13200, rank: 1 },
    { nameslug: 'elif', year: 2022, gender: 'K' as const, count: 14100, rank: 1 },

    // Zeynep - top 3
    { nameslug: 'zeynep', year: 2024, gender: 'K' as const, count: 10800, rank: 2 },
    { nameslug: 'zeynep', year: 2023, gender: 'K' as const, count: 11500, rank: 2 },
    { nameslug: 'zeynep', year: 2022, gender: 'K' as const, count: 12200, rank: 2 },

    // Defne - rising
    { nameslug: 'defne', year: 2024, gender: 'K' as const, count: 8200, rank: 5 },
    { nameslug: 'defne', year: 2023, gender: 'K' as const, count: 7800, rank: 6 },
    { nameslug: 'defne', year: 2022, gender: 'K' as const, count: 7200, rank: 8 },

    // Yusuf - top boy name
    { nameslug: 'yusuf', year: 2024, gender: 'E' as const, count: 11200, rank: 1 },
    { nameslug: 'yusuf', year: 2023, gender: 'E' as const, count: 12100, rank: 1 },
    { nameslug: 'yusuf', year: 2022, gender: 'E' as const, count: 13500, rank: 1 },

    // Emir - very popular
    { nameslug: 'emir', year: 2024, gender: 'E' as const, count: 10500, rank: 2 },
    { nameslug: 'emir', year: 2023, gender: 'E' as const, count: 10800, rank: 2 },
    { nameslug: 'emir', year: 2022, gender: 'E' as const, count: 11200, rank: 2 },

    // Deniz - unisex, more boys
    { nameslug: 'deniz', year: 2024, gender: 'E' as const, count: 4200, rank: 15 },
    { nameslug: 'deniz', year: 2023, gender: 'E' as const, count: 4500, rank: 14 },
    { nameslug: 'deniz', year: 2024, gender: 'K' as const, count: 2100, rank: 28 },
    { nameslug: 'deniz', year: 2023, gender: 'K' as const, count: 2200, rank: 27 }
  ];

  let freqCount = 0;
  for (const freq of frequencyData) {
    const name = await prisma.name.findUnique({ where: { slug: freq.nameslug } });
    if (name) {
      await prisma.nameFrequency.create({
        data: {
          nameId: name.id,
          year: freq.year,
          gender: freq.gender,
          count: freq.count,
          rank: freq.rank,
          source: {
            source: 'TÜİK',
            url: 'https://nip.tuik.gov.tr/?value=YeniDoganIsimleri',
            note: 'Simulated data for testing'
          }
        }
      });
      freqCount++;
    }
  }

  console.log(`✅ Seeded ${freqCount} frequency records\n`);

  // Seed regional data
  console.log('🗺️  Seeding regional distribution...');

  const regionalData = [
    // Deniz more popular in coastal regions
    { nameslug: 'deniz', region: 'Ege', share: 0.25 },
    { nameslug: 'deniz', region: 'Marmara', share: 0.22 },
    { nameslug: 'deniz', region: 'Karadeniz', share: 0.18 },

    // Defne popular in western Turkey
    { nameslug: 'defne', region: 'Ege', share: 0.28 },
    { nameslug: 'defne', region: 'Marmara', share: 0.26 }
  ];

  let regionCount = 0;
  for (const region of regionalData) {
    const name = await prisma.name.findUnique({ where: { slug: region.nameslug } });
    if (name) {
      await prisma.regionShare.create({
        data: {
          nameId: name.id,
          region: region.region,
          share: region.share,
          method: 'heuristic',
          source: {
            note: 'Estimated regional distribution for testing'
          }
        }
      });
      regionCount++;
    }
  }

  console.log(`✅ Seeded ${regionCount} regional records\n`);

  // Summary
  console.log('📈 Seed Summary:');
  const totalNames = await prisma.name.count();
  const totalFrequencies = await prisma.nameFrequency.count();
  const totalRegions = await prisma.regionShare.count();

  console.log(`  Names: ${totalNames}`);
  console.log(`  Frequencies: ${totalFrequencies}`);
  console.log(`  Regional shares: ${totalRegions}`);

  console.log('\n✨ Database seeding complete!\n');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });

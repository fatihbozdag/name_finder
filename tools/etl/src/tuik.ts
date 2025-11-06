/**
 * TÜİK (Türkiye İstatistik Kurumu) ETL Script
 *
 * Fetches frequency data from TÜİK Nüfus İstatistikleri
 * Source: https://nip.tuik.gov.tr/
 *
 * Data available:
 * 1. En Çok Verilen Bebek İsimleri (Yearly top-30 by gender)
 *    https://nip.tuik.gov.tr/?value=YeniDoganIsimleri
 *
 * 2. En Çok Kullanılan İsimler (Stock counts, all ages)
 *    https://nip.tuik.gov.tr/?value=EnCokKullanilanIsimler
 *
 * IMPORTANT: TÜİK data is public but requires attribution.
 * - Always cite source URL
 * - Store year and methodology
 * - Handle missing years gracefully (only top-30 available)
 *
 * Usage:
 *   pnpm run tuik
 */

console.log('📊 TÜİK ETL Script');
console.log('==================\n');

console.log('ℹ️  TÜİK publishes:');
console.log('  - Yearly top-30 baby names (by gender)');
console.log('  - Stock counts (total population with name)');
console.log('  - Provincial data (limited availability)\n');

console.log('⚠️  Limitations:');
console.log('  - Only top-30 names per year published');
console.log('  - Rare names have no trend data');
console.log('  - Historical data limited to recent years');
console.log('  - Provincial breakdown not always available\n');

console.log('📖 Data Structure:');
console.log('  {');
console.log('    year: 2024,');
console.log('    gender: "K" | "E",');
console.log('    rank: 1-30,');
console.log('    name: "Elif",');
console.log('    count: 12500,  // approximate');
console.log('    province: "34" // optional, İstanbul');
console.log('  }\n');

console.log('💡 Implementation Options:');
console.log('  1. Manual entry from published tables');
console.log('  2. CSV export if TÜİK provides');
console.log('  3. Web scraping (check robots.txt)');
console.log('  4. API if available (preferred)\n');

console.log('📝 For now, sample data included in seed.ts');
console.log('   Run: pnpm --filter=@turkish-name-finder/db run seed\n');

/**
 * Example TÜİK data fetcher (not implemented)
 *
 * async function fetchTUIKYearlyData(year: number, gender: 'K' | 'E') {
 *   // Fetch from TÜİK portal
 *   const url = `https://nip.tuik.gov.tr/?value=YeniDoganIsimleri&year=${year}`;
 *
 *   // Parse table or API response
 *   // Extract top-30 names with counts and ranks
 *
 *   return names.map(n => ({
 *     year,
 *     gender,
 *     name: n.name,
 *     rank: n.rank,
 *     count: n.count,
 *     source: {
 *       tuik: url,
 *       fetchedAt: new Date().toISOString()
 *     }
 *   }));
 * }
 *
 * async function main() {
 *   const years = [2020, 2021, 2022, 2023, 2024];
 *   const genders = ['K', 'E'];
 *
 *   for (const year of years) {
 *     for (const gender of genders) {
 *       const data = await fetchTUIKYearlyData(year, gender);
 *       // Store in database
 *       console.log(`Fetched ${data.length} names for ${year} ${gender}`);
 *     }
 *   }
 * }
 */

// Exit for now
process.exit(0);

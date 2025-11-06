/**
 * TDK (Türk Dil Kurumu) ETL Script
 *
 * Scrapes Turkish name data from TDK Kişi Adları Sözlüğü
 * Source: https://sozluk.gov.tr/
 *
 * IMPORTANT: This script must respect TDK's terms of service.
 * - Rate limiting implemented (1 request per second)
 * - User-Agent set appropriately
 * - Attribution and deep-links required
 * - Request permission for bulk scraping
 *
 * Usage:
 *   pnpm run tdk
 *
 * Note: This is a template. Actual implementation requires:
 * 1. Reviewing TDK's robots.txt and ToS
 * 2. Potentially requesting API access
 * 3. Implementing proper rate limiting
 * 4. Adding retry logic with exponential backoff
 */

console.log('📚 TDK ETL Script');
console.log('=================\n');

console.log('⚠️  WARNING: This script is a template.');
console.log('Before running, you must:');
console.log('  1. Review TDK Terms of Service');
console.log('  2. Check robots.txt: https://sozluk.gov.tr/robots.txt');
console.log('  3. Request permission for bulk scraping if needed');
console.log('  4. Implement rate limiting (1 req/sec minimum)');
console.log('  5. Set proper User-Agent header\n');

console.log('📖 Recommended Approach:');
console.log('  - Manual curation for initial 500 names');
console.log('  - Use TDK API if available');
console.log('  - Scrape responsibly with delays');
console.log('  - Always deep-link to source entries');
console.log('  - Store provenance metadata\n');

console.log('💡 For now, use the manual seed data in seed-data.ts');
console.log('   Run: pnpm --filter=@turkish-name-finder/db run seed\n');

/**
 * Example structure for TDK scraping (not implemented)
 *
 * async function scrapeTDKName(name: string) {
 *   // Respect rate limits
 *   await sleep(1000);
 *
 *   // Set proper headers
 *   const response = await fetch(`https://sozluk.gov.tr/?q=${name}`, {
 *     headers: {
 *       'User-Agent': 'TurkishNameFinder/0.1.0 (Educational; [email])'
 *     }
 *   });
 *
 *   // Parse response
 *   const html = await response.text();
 *
 *   // Extract:
 *   // - Name (display form)
 *   // - Gender
 *   // - Origin (Türkçe, Arapça, Farsça, etc.)
 *   // - Meaning
 *   // - Etymology notes
 *
 *   // Return with provenance
 *   return {
 *     name,
 *     data: { ... },
 *     source: {
 *       tdk: `https://sozluk.gov.tr/?q=${name}`,
 *       scrapedAt: new Date().toISOString()
 *     }
 *   };
 * }
 */

// Exit for now
process.exit(0);

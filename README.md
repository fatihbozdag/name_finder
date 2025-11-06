# Turkish Baby Name Finder

An interactive Turkish baby-name finder that interviews parents for 60–90 seconds, then ranks names by fit across culture, sound, frequency, trend, regional flavor, paperwork sanity, and family constraints.

## Project Structure

```
turkish-name-finder/
├── apps/
│   ├── web/         # Next.js 15 web application
│   ├── mobile/      # Expo mobile application
│   └── server/      # Optional Fastify microservice (or Next.js API routes)
├── packages/
│   ├── ui/          # Shared UI components (web + mobile)
│   ├── core/        # Scoring engine, Turkish NLP helpers
│   ├── data/        # Zod schemas, Prisma types
│   └── api-client/  # TanStack Query hooks, tRPC client
├── infra/
│   └── db/          # Prisma schema and migrations
└── tools/
    └── etl/         # TDK, TÜİK data scrapers
```

## Key Features

- **6-Screen Onboarding**: Captures preferences across goal, style, sound, popularity, family, and logistics
- **Turkish-Native**: ICU/CLDR case mapping, collation, and NLP via Zeyrek/Zemberek
- **Transparent Scoring**: 20+ factors with visible weights and explanations
- **Data Sources**: TDK (meanings), TÜİK (frequency/trends), verified Turkish linguistic data
- **Web + iOS**: Next.js for SEO, Expo for mobile, shared React Native Web components

## Data Sources

- **TDK Kişi Adları Sözlüğü**: https://sozluk.gov.tr/
- **TÜİK Nüfus İstatistikleri**: https://nip.tuik.gov.tr/
- **ICU Case Mappings**: https://unicode-org.github.io/icu/userguide/transforms/casemappings.html
- **Zeyrek (Turkish NLP)**: https://github.com/obulat/zeyrek

## Getting Started

```bash
# Install dependencies
npm install

# Set up database
npm run db:migrate

# Seed with initial data
npm run db:seed

# Start development servers
npm run dev
```

## Turkish Language Handling

This project uses proper Turkish case mapping and collation via ICU/CLDR:
- Never DIY i/ı/İ/I conversions
- Use `Intl.Collator('tr')` for sorting
- Use `toLocaleLowerCase('tr')` and `toLocaleUpperCase('tr')`

## Privacy & Compliance

- KVKK compliant
- No personal data storage beyond optional surname (local computation only)
- Telemetry opt-in from first run
- Ephemeral partner share links (7-day expiry)

## License

TBD - Respect TDK and TÜİK licensing requirements

# Development Guide

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your PostgreSQL credentials

# Generate Prisma client
cd infra/db && npm run generate && cd ../..

# Run migrations
npm run db:migrate

# Seed database (when ETL is ready)
npm run db:seed

# Start development servers
npm run dev
```

## Project Structure

```
turkish-name-finder/
├── apps/
│   ├── web/              # Next.js 15 web app
│   │   ├── src/
│   │   │   ├── app/      # App Router pages
│   │   │   ├── components/  # React components
│   │   │   └── lib/      # Utilities, tRPC setup
│   │   └── package.json
│   ├── mobile/           # Expo mobile app (TODO)
│   └── server/           # Optional standalone server (TODO)
│
├── packages/
│   ├── core/             # Scoring engine, Turkish NLP
│   │   ├── src/
│   │   │   ├── turkish.ts     # ICU/CLDR helpers
│   │   │   ├── phonotactics.ts  # Euphony scoring
│   │   │   └── scoring.ts     # Main scoring engine
│   │   └── package.json
│   ├── data/             # Schemas and types
│   │   ├── src/
│   │   │   └── schemas.ts  # Zod schemas for 40 questions
│   │   └── package.json
│   └── ui/               # Shared components (TODO)
│
├── infra/
│   └── db/               # Prisma schema
│       ├── schema.prisma
│       ├── migrations/
│       └── seed.ts       # Database seeding
│
└── tools/
    └── etl/              # Data ingestion scripts (TODO)
        ├── tdk.ts        # TDK scraper
        └── tuik.ts       # TÜİK scraper
```

## Key Technologies

- **Monorepo**: Turborepo
- **Web**: Next.js 15 (App Router), React 18, Tailwind CSS
- **Mobile**: Expo (React Native)
- **Database**: PostgreSQL + Prisma
- **API**: tRPC for type-safe APIs
- **Validation**: Zod
- **Testing**: Vitest
- **Turkish NLP**: Built-in Intl API (ICU/CLDR)

## Development Workflow

### 1. Database Changes

```bash
# Edit infra/db/schema.prisma
cd infra/db

# Create migration
npm run migrate

# Generate Prisma client
npm run generate
```

### 2. Adding New Packages

```bash
# Create new package
mkdir -p packages/new-package/src
cd packages/new-package

# Initialize
npm init -y

# Add to workspace (already done via package.json workspaces)
```

### 3. Running Tests

```bash
# All tests
npm run test

# Specific package
cd packages/core
npm run test

# Watch mode
npm run test -- --watch
```

### 4. Type Checking

```bash
# All packages
npm run typecheck

# Specific app
cd apps/web
npm run typecheck
```

## Turkish Language Handling

### CRITICAL: Never DIY i/ı/İ/I conversions!

Always use the helpers from `@turkish-name-finder/core`:

```typescript
import { toLowerCaseTurkish, toUpperCaseTurkish, equalsTurkish } from '@turkish-name-finder/core';

// ❌ WRONG
const lower = str.toLowerCase(); // 'I' becomes 'i' (wrong!)

// ✅ CORRECT
const lower = toLowerCaseTurkish(str); // 'I' becomes 'ı'
```

### Collation and Sorting

```typescript
import { sortTurkish, turkishCollator } from '@turkish-name-finder/core';

// ✅ Sort array of names
const sorted = sortTurkish(names, (n) => n.display);

// ✅ Compare two strings
if (turkishCollator.compare(a, b) === 0) {
  // Equal according to Turkish rules
}
```

## Data Sources

### TDK (Türk Dil Kurumu)

- **URL**: https://sozluk.gov.tr/
- **Usage**: Meanings, origins, unisex flags
- **License**: Respect TDK terms, deep-link to source
- **Scraping**: Must be conservative, request permission for bulk

### TÜİK (Türkiye İstatistik Kurumu)

- **URL**: https://nip.tuik.gov.tr/
- **Data**: "En çok verilen bebek isimleri" (yearly top-30)
- **Data**: "En çok kullanılan isimler" (stock counts)
- **Usage**: Frequency, trends, regional distribution

### ICU/CLDR

- **URL**: https://unicode-org.github.io/icu/
- **Usage**: Turkish case mapping, collation rules
- **Implementation**: Built into JavaScript `Intl` API

## Scoring Model

The scoring engine in `packages/core/src/scoring.ts` implements 20+ factors:

1. **Hard Constraints** (return -Infinity if violated)
   - Gender match
   - Origin (e.g., "Sadece Türkçe")
   - Strict Turkish alphabet (no W,Q,X)
   - Must-have/avoid letters
   - Starts/ends with
   - Syllable range
   - Veto list

2. **Soft Scoring** (additive with weights)
   - Style tags overlap
   - Semantic domain match
   - Syllable affinity
   - Stress pattern
   - Surname euphony
   - Initials policy
   - Nickname preference
   - Morphological affixes
   - Uniqueness quantile
   - Trend slope (Theil–Sen)
   - Regional distribution
   - Religious preference
   - Diaspora pronounceability
   - Diacritics policy
   - Registry risk
   - Spelling confusion
   - Negative associations
   - Bully scan

All weights are in `packages/data/src/schemas.ts` as `DEFAULT_WEIGHTS`.

## API Routes

Using tRPC for type-safe APIs:

```typescript
// In app code
import { trpc } from '@/lib/trpc';

const { data } = trpc.names.useQuery({
  gender: 'K',
  page: 1
});
```

Available procedures:
- `health`: Health check
- `names`: List names with filters
- `name`: Get single name by slug
- `score`: Score names based on preferences
- `euphony`: Calculate name-surname compatibility
- `bullyScan`: Check for potential teasing
- `diaspora`: Pronounceability in other languages

## ETL (Extract, Transform, Load)

### TDK Ingestion (TODO)

```bash
npm run etl:tdk
```

Scrapes TDK Kişi Adları Sözlüğü for:
- Display name
- Gender
- Origin
- Meaning
- Provenance (deep-link)

### TÜİK Ingestion (TODO)

```bash
npm run etl:tuik
```

Fetches TÜİK data for:
- Yearly top-30 names (by gender)
- Stock counts (total people with name)
- Provincial distribution (when available)

## Component Development

### Naming Convention

- PascalCase for components: `NameCard.tsx`
- kebab-case for utilities: `turkish-helpers.ts`
- UPPERCASE for constants: `DEFAULT_WEIGHTS`

### Accessibility

All components must be accessible:
- Keyboard navigation
- ARIA labels
- Focus indicators
- Screen reader support

### Testing

Write tests for:
- Turkish case handling (critical!)
- Scoring logic
- Phonotactics
- API endpoints

Example:
```bash
cd packages/core
npm run test -- turkish.test.ts
```

## Deployment

### Database

1. Provision PostgreSQL 14+ with ICU support
2. Run migrations: `npm run db:migrate:prod`
3. Seed with ETL: `npm run db:seed`

### Web App

```bash
cd apps/web
npm run build
npm run start
```

Or deploy to Vercel:
```bash
vercel --prod
```

### Mobile App

```bash
cd apps/mobile
eas build --platform ios
eas submit --platform ios
```

## Common Issues

### Prisma Client Not Found

```bash
cd infra/db
npm run generate
```

### Turkish Case Mapping Bugs

Always use helpers from `@turkish-name-finder/core`. Write tests!

### Missing Data

Ensure ETL has run and database is seeded:
```bash
npm run db:seed
```

## Resources

- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js 15 Docs](https://nextjs.org/docs)
- [tRPC Docs](https://trpc.io/docs)
- [Turkish ICU](https://unicode-org.github.io/icu/userguide/transforms/casemappings.html)
- [TDK Sözlük](https://sozluk.gov.tr/)
- [TÜİK](https://nip.tuik.gov.tr/)

## Contributing

1. Create feature branch: `git checkout -b feature/new-feature`
2. Make changes
3. Run tests: `npm run test`
4. Type check: `npm run typecheck`
5. Commit: `git commit -m "Add new feature"`
6. Push and create PR

## License

TBD - Must respect TDK and TÜİK licensing

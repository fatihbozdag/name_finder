# Implementation Plan: Turkish Baby Name Finder

## Overview

This document provides a roadmap for implementing the Turkish Baby Name Finder application based on the comprehensive specification.

## Phase 1: Foundation (Days 1-2) ✅ COMPLETED

### Day 1: Infrastructure ✅
- [x] Monorepo setup with Turborepo
- [x] PostgreSQL database schema with Prisma
- [x] Shared TypeScript types and Zod schemas
- [x] Turkish ICU/CLDR helpers for proper case handling
- [x] Core scoring engine skeleton
- [x] Next.js web app with App Router
- [x] tRPC API setup

### Day 2: Core Features (TODO)
- [ ] Complete scoring engine with all 20+ factors
- [ ] Implement trend analysis (Theil-Sen regression)
- [ ] Add uniqueness quantile calculations
- [ ] Build euphony scoring with vowel harmony
- [ ] Create diaspora pronounceability scoring
- [ ] Implement bully scan logic
- [ ] Write comprehensive tests for Turkish handling

## Phase 2: Data Ingestion (Days 3-4)

### ETL Scripts
- [ ] **TDK Scraper** (`tools/etl/tdk.ts`)
  - Scrape TDK Kişi Adları Sözlüğü
  - Extract: display, gender, origin, meaning
  - Store provenance with deep-links
  - Respect rate limits and licensing
  - Target: 500-1000 names initially

- [ ] **TÜİK Scraper** (`tools/etl/tuik.ts`)
  - Fetch "En çok verilen bebek isimleri" (yearly top-30)
  - Fetch "En çok kullanılan isimler" (stock counts)
  - Store 3-5 years of data per name
  - Handle provincial data when available

- [ ] **NLP Processing** (`tools/etl/nlp-enrich.ts`)
  - Use Zeyrek or Zemberek for syllable counting
  - Estimate stress patterns
  - Generate ASCII twins
  - Extract morphological tags (-can, -han, etc.)

### Database Seeding
- [ ] Seed script (`infra/db/seed.ts`)
  - Load processed data into PostgreSQL
  - Validate all foreign keys
  - Create indexes for performance
  - Generate test data for development

## Phase 3: UI Components (Days 5-7)

### Shared UI Package (`packages/ui/`)
- [ ] Design system tokens
- [ ] Core components:
  - [ ] `Button`, `Input`, `Select`, `Slider`, `Toggle`
  - [ ] `Chip`, `Card`, `Badge`, `Tag`
  - [ ] `Modal`, `Drawer`, `Tooltip`
- [ ] Name-specific components:
  - [ ] `NameCard` - display name with all metadata
  - [ ] `Sparkline` - TÜİK trend visualization
  - [ ] `TrendBadge` - rising/falling/stable indicator
  - [ ] `ScoreBreakdown` - transparent scoring explanation
  - [ ] `WhyThisName` - top 3-5 reasons for ranking
  - [ ] `RiskBadge` - registry/spelling/diaspora warnings
  - [ ] `EuphonyMeter` - surname compatibility visual
  - [ ] `DiasporaDots` - pronounceability per locale

### Web App Pages
- [ ] `/` - Landing page with feature overview
- [ ] `/onboard` - 6-screen wizard
  - [ ] Screen 1: Goal, Gender, Origin
  - [ ] Screen 2: Style, Meaning
  - [ ] Screen 3: Sound, Form
  - [ ] Screen 4: Popularity, Trend, Region
  - [ ] Screen 5: Family, Collaboration
  - [ ] Screen 6: Logistics, Sensitivity
  - [ ] Live preview panel (updates as preferences change)
- [ ] `/results` - Scored name list
- [ ] `/name/[slug]` - Detailed name page
- [ ] `/compare` - Side-by-side comparison
- [ ] `/shortlist` - Saved favorites
- [ ] `/partner` - Collaborative merge interface

## Phase 4: Advanced Features (Days 8-10)

### Partner Collaboration
- [ ] Ephemeral share links (7-day expiry)
- [ ] Merge algorithms:
  - [ ] Intersection (only common names)
  - [ ] Average (mean scores)
  - [ ] Borda count (rank-based)
- [ ] Conflict resolution UI
- [ ] Privacy-safe implementation (no PII storage)

### Trend Analysis
- [ ] Theil-Sen slope estimation
- [ ] Handle missing data (top-30 coverage gaps)
- [ ] Backfill with stock counts
- [ ] Sparkline with confidence intervals
- [ ] "Rising star" / "Fading" badges

### Regional Features
- [ ] Provincial frequency maps
- [ ] Region-specific recommendations
- [ ] Heuristic regional shares
- [ ] Regional phonotactic patterns

### Diaspora Support
- [ ] Phone inventory per locale (en, de, fr, nl, se, no)
- [ ] Cluster difficulty scoring
- [ ] ASCII twin generation
- [ ] Pronunciation hints per language

## Phase 5: Mobile App (Days 11-14)

### Expo Setup (`apps/mobile/`)
- [ ] Initialize Expo with expo-router
- [ ] Configure React Native Web compatibility
- [ ] Share components from `packages/ui/`
- [ ] Adapt layouts for mobile screens
- [ ] Add gesture navigation
- [ ] Implement offline mode (cached preferences)

### Mobile-Specific Features
- [ ] Push notifications for partner updates
- [ ] Share name cards via native share sheet
- [ ] Camera integration for surname input (OCR)
- [ ] Voice input for preferences
- [ ] Dark mode support

### iOS Deployment
- [ ] Configure EAS Build
- [ ] App Store metadata
- [ ] Privacy policy page
- [ ] TestFlight beta testing
- [ ] App Store submission

## Phase 6: Testing & Quality (Days 15-16)

### Unit Tests
- [x] Turkish case handling (packages/core/src/turkish.test.ts)
- [ ] Phonotactics and euphony
- [ ] Scoring engine with fixtures
- [ ] Zod schema validation
- [ ] tRPC procedures

### Integration Tests
- [ ] Database queries
- [ ] ETL pipeline end-to-end
- [ ] API endpoints
- [ ] Onboarding flow

### E2E Tests
- [ ] Full user journey (onboard → results → shortlist)
- [ ] Partner collaboration flow
- [ ] Mobile app critical paths

### Performance
- [ ] Database indexing
- [ ] Query optimization
- [ ] tRPC batching
- [ ] Image optimization
- [ ] Bundle size analysis

## Phase 7: Deployment (Day 17)

### Infrastructure
- [ ] Provision PostgreSQL (Supabase/Railway/RDS)
- [ ] Configure connection pooling
- [ ] Set up backups and monitoring
- [ ] Run production migrations

### Web Deployment
- [ ] Deploy to Vercel
- [ ] Configure environment variables
- [ ] Set up custom domain
- [ ] Enable analytics (privacy-respecting)

### Mobile Deployment
- [ ] EAS Build for iOS
- [ ] TestFlight beta
- [ ] App Store review submission
- [ ] (Future) Android build

### Monitoring
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring
- [ ] Database metrics
- [ ] User telemetry (opt-in)

## Phase 8: Launch & Iteration (Day 18+)

### Pre-Launch Checklist
- [ ] Privacy policy and KVKK compliance
- [ ] Terms of service
- [ ] TDK and TÜİK attribution
- [ ] Rate limiting on APIs
- [ ] User feedback form

### Post-Launch
- [ ] Monitor usage patterns
- [ ] Collect user feedback
- [ ] Iterate on scoring weights
- [ ] Add more names to database
- [ ] Expand regional data
- [ ] Android app development

## Future Enhancements

### Advanced Features
- [ ] Sibling name compatibility scoring
- [ ] "Name a twins" mode (pair recommendations)
- [ ] Historical popularity graphs (10+ years)
- [ ] Celebrity associations
- [ ] Literary references
- [ ] Sound-alike name finder
- [ ] Reverse search (describe meaning → find names)

### Data Expansion
- [ ] Province-level frequency data
- [ ] Historical trends (50+ years from TÜİK)
- [ ] Regional dialect considerations
- [ ] Minority language support (Kurdish, Arabic, etc.)
- [ ] Compound name generator

### Integrations
- [ ] Social media handle availability checker
- [ ] Domain name availability
- [ ] WhatsApp sharing integration
- [ ] Export to PDF (birth certificate ready)
- [ ] Calendar integration (decision deadline reminders)

## Technical Debt & Notes

### Known Limitations
1. **Top-30 Coverage**: TÜİK only provides yearly top-30, so rare names lack trend data
2. **Provincial Data**: Not consistently available across all years
3. **TDK Licensing**: Need formal permission for bulk scraping
4. **Zeyrek Integration**: Not yet implemented, using heuristics for now

### Improvements Needed
- [ ] Add Zeyrek/Zemberek for better syllable detection
- [ ] Implement vowel harmony scoring
- [ ] Build ML model for spelling confusion prediction
- [ ] Create admin dashboard for data curation
- [ ] Add A/B testing framework for scoring weights

### Performance Optimizations
- [ ] Implement caching layer (Redis)
- [ ] Pre-compute common preference combinations
- [ ] Use database materialized views for aggregations
- [ ] Lazy-load name cards in results
- [ ] Optimize Prisma queries with `select` statements

## Success Metrics

### MVP Goals (Week 1)
- [ ] 500+ names in database with TDK meanings
- [ ] 3-5 years of TÜİK frequency data
- [ ] All 6 onboarding screens functional
- [ ] Core scoring working for 15+ factors
- [ ] Web app deployed and accessible

### Post-Launch Goals (Month 1)
- [ ] 1,000+ active users
- [ ] 90%+ user satisfaction
- [ ] <2s p95 API response time
- [ ] <5% error rate
- [ ] iOS app submitted to App Store

### Long-Term Goals (6 months)
- [ ] 10,000+ active users
- [ ] 2,000+ names in database
- [ ] Android app launched
- [ ] Regional data for top 50 provinces
- [ ] Partnership with parenting community

## Resources

### Documentation
- See `DEVELOPMENT.md` for detailed dev guide
- See `README.md` for project overview
- See specification document for full requirements

### External Links
- TDK: https://sozluk.gov.tr/
- TÜİK: https://nip.tuik.gov.tr/
- ICU: https://unicode-org.github.io/icu/
- Zeyrek: https://github.com/obulat/zeyrek

### Team
- Developer: TBD
- Designer: TBD
- Data curator: TBD
- Turkish linguist: TBD (consultant)

---

**Status**: Phase 1 Complete ✅
**Next**: Complete core scoring engine and begin ETL development
**Updated**: 2025-11-06

/**
 * tRPC context for Next.js App Router (Mock mode)
 * Uses in-memory mock database when Prisma is not available
 */

import { mockPrisma } from '@turkish-name-finder/data/src/mock-db';

export function createTRPCContext() {
  return {
    prisma: mockPrisma as any
  };
}

export type Context = ReturnType<typeof createTRPCContext>;

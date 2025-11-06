/**
 * tRPC HTTP handler for Next.js App Router
 */

import { fetchRequestHandler } from '@trpc/server/adapters/fetch';
import { appRouter } from '@/lib/server/trpc/router';
// Use mock context when Prisma is not available
import { createTRPCContext } from '@/lib/server/trpc/context-mock';

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: '/api/trpc',
    req,
    router: appRouter,
    createContext: createTRPCContext
  });

export { handler as GET, handler as POST };

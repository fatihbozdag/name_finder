/**
 * tRPC client setup for Next.js App Router
 */

import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from './server/trpc/router';

export const trpc = createTRPCReact<AppRouter>();

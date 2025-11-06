/**
 * tRPC router for Turkish Name Finder API
 */

import { router, publicProcedure } from './trpc';
import { ScoreRequestSchema, ScoreResponseSchema } from '@turkish-name-finder/data';
import { z } from 'zod';

export const appRouter = router({
  // Health check
  health: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Get names with basic filters
  names: publicProcedure
    .input(
      z.object({
        query: z.string().optional(),
        gender: z.enum(['K', 'E', 'U', 'ALL']).optional(),
        origin: z.string().optional(),
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(100).default(20)
      })
    )
    .query(async ({ input, ctx }) => {
      const { query, gender, origin, page, limit } = input;
      const skip = (page - 1) * limit;

      const where: any = {};

      if (query) {
        where.OR = [
          { display: { contains: query, mode: 'insensitive' } },
          { slug: { contains: query, mode: 'insensitive' } }
        ];
      }

      if (gender && gender !== 'ALL') {
        where.gender = gender;
      }

      if (origin) {
        where.origin = origin;
      }

      const [names, total] = await Promise.all([
        ctx.prisma.name.findMany({
          where,
          skip,
          take: limit,
          orderBy: { display: 'asc' }
        }),
        ctx.prisma.name.count({ where })
      ]);

      return {
        names,
        total,
        page,
        pages: Math.ceil(total / limit)
      };
    }),

  // Get single name by slug
  name: publicProcedure.input(z.object({ slug: z.string() })).query(async ({ input, ctx }) => {
    const name = await ctx.prisma.name.findUnique({
      where: { slug: input.slug },
      include: {
        frequencies: {
          orderBy: { year: 'desc' },
          take: 10
        },
        regionShares: true,
        variants: true
      }
    });

    return name;
  }),

  // Score names based on preferences
  score: publicProcedure.input(ScoreRequestSchema).mutation(async ({ input, ctx }) => {
    // TODO: Implement full scoring logic
    // This is a placeholder that returns mock data

    return {
      results: [],
      guardrails: [
        {
          filter: 'origin',
          excluded: 0
        }
      ]
    } satisfies z.infer<typeof ScoreResponseSchema>;
  }),

  // Calculate euphony for name + surname
  euphony: publicProcedure
    .input(
      z.object({
        name: z.string(),
        surname: z.string()
      })
    )
    .mutation(async ({ input }) => {
      const { calculateEuphony } = await import('@turkish-name-finder/core');
      return calculateEuphony(input.name, input.surname);
    }),

  // Bully scan
  bullyScan: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input }) => {
      // TODO: Implement bully scan logic
      return {
        risk: 0,
        reasons: []
      };
    }),

  // Diaspora pronounceability
  diaspora: publicProcedure
    .input(
      z.object({
        name: z.string(),
        locales: z.array(z.enum(['en', 'de', 'fr', 'nl', 'se', 'no']))
      })
    )
    .mutation(async ({ input }) => {
      const { toAsciiTwin } = await import('@turkish-name-finder/core');

      // TODO: Implement full diaspora scoring
      return {
        pronounceability: {
          en: 0.8,
          de: 0.7,
          fr: 0.6
        },
        asciiTwin: toAsciiTwin(input.name)
      };
    })
});

export type AppRouter = typeof appRouter;

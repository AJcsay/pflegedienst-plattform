/**
 * Email Template tRPC Router
 * Handles template CRUD operations
 */

import { router, protectedProcedure } from './_core/trpc';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import {
  createTemplate,
  getTemplate,
  getAllTemplates,
  updateTemplate,
  deleteTemplate,
  duplicateTemplate,
} from './template-service';

export const templateRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1),
        subject: z.string().min(1),
        preheader: z.string().min(1),
        blocks: z.array(z.any()),
        backgroundColor: z.string().default('#ffffff'),
        fontFamily: z.string().default('Arial'),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const template = await createTemplate(
          {
            name: input.name,
            subject: input.subject,
            preheader: input.preheader,
            blocks: input.blocks,
            backgroundColor: input.backgroundColor,
            fontFamily: input.fontFamily,
          },
          String(ctx.user.id)
        );
        return { success: true, template };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: (error as Error).message,
        });
      }
    }),

  get: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      try {
        const template = await getTemplate(input.id);
        if (!template) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Template not found',
          });
        }
        return template;
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: (error as Error).message,
        });
      }
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    try {
      return await getAllTemplates(String(ctx.user.id));
    } catch (error) {
      throw new TRPCError({
        code: 'INTERNAL_SERVER_ERROR',
        message: (error as Error).message,
      });
    }
  }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        subject: z.string().optional(),
        preheader: z.string().optional(),
        blocks: z.array(z.any()).optional(),
        backgroundColor: z.string().optional(),
        fontFamily: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const { id, ...updates } = input;
        const template = await updateTemplate(id, updates as any);
        return { success: true, template };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: (error as Error).message,
        });
      }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      try {
        const success = await deleteTemplate(input.id);
        if (!success) {
          throw new TRPCError({
            code: 'NOT_FOUND',
            message: 'Template not found',
          });
        }
        return { success: true };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: (error as Error).message,
        });
      }
    }),

  duplicate: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const template = await duplicateTemplate(input.id, String(ctx.user.id));
        return { success: true, template };
      } catch (error) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: (error as Error).message,
        });
      }
    }),
});

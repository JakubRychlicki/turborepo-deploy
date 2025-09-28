import { z } from 'zod'
import { prisma } from '@repo/database'
import { protectedProcedure, createTRPCRouter } from '../trpc.js'

export const narratorRouter = createTRPCRouter({
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const narrator = await prisma.narrator.findUnique({
        where: { id: input.id },
        include: {
          users: {
            select: {
              id: true,
              email: true,
              name: true
            }
          }
        }
      })

      if (!narrator) {
        throw new Error('Narrator nie został znaleziony')
      }

      return narrator
    }),

  create: protectedProcedure
    .input(
      z.object({
        name: z
          .string()
          .min(1, 'Nazwa narratora jest wymagana')
          .max(100, 'Nazwa narratora jest zbyt długa'),
        isActive: z.boolean().default(true)
      })
    )
    .mutation(async ({ input }) => {
      const narrator = await prisma.narrator.create({
        data: {
          name: input.name,
          isActive: input.isActive
        }
      })

      return narrator
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        name: z
          .string()
          .min(1, 'Nazwa narratora jest wymagana')
          .max(100, 'Nazwa narratora jest zbyt długa')
          .optional(),
        isActive: z.boolean().optional()
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updateData } = input

      const existingNarrator = await prisma.narrator.findUnique({
        where: { id }
      })

      if (!existingNarrator) {
        throw new Error('Narrator nie został znaleziony')
      }

      const narrator = await prisma.narrator.update({
        where: { id },
        data: updateData
      })

      return narrator
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const existingNarrator = await prisma.narrator.findUnique({
        where: { id: input.id }
      })

      if (!existingNarrator) {
        throw new Error('Narrator nie został znaleziony')
      }

      const usersCount = await prisma.user.count({
        where: { narratorId: input.id }
      })

      if (usersCount > 0) {
        throw new Error(
          'Nie można usunąć narratora, który jest przypisany do użytkowników'
        )
      }

      const narrator = await prisma.narrator.update({
        where: { id: input.id },
        data: { isActive: false }
      })

      return narrator
    }),

  permanentDelete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const existingNarrator = await prisma.narrator.findUnique({
        where: { id: input.id }
      })

      if (!existingNarrator) {
        throw new Error('Narrator nie został znaleziony')
      }

      const usersCount = await prisma.user.count({
        where: { narratorId: input.id }
      })

      if (usersCount > 0) {
        throw new Error(
          'Nie można usunąć narratora, który jest przypisany do użytkowników'
        )
      }

      await prisma.narrator.delete({
        where: { id: input.id }
      })

      return { success: true, message: 'Narrator został trwale usunięty' }
    }),

  restore: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const narrator = await prisma.narrator.update({
        where: { id: input.id },
        data: { isActive: true }
      })

      return narrator
    })
})

import { z } from 'zod'
import { prisma } from '@repo/database'
import { protectedProcedure, createTRPCRouter } from '../trpc.js'
import { TRPCError } from '@trpc/server'

export const programRouter = createTRPCRouter({
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const program = await prisma.program.findUnique({
        where: { id: input.id },
        include: {
          thumbnail: true,
          category: true,
          keywords: true,
          audioSessions: {
            include: {
              media: true
            }
          },
          worksheets: {
            include: {
              file: true
            }
          }
        }
      })

      if (!program) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Program nie został znaleziony' })
      }

      return program
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, 'Tytuł jest wymagany'),
        level: z.number().min(1).max(10).default(1),
        description: z
          .string()
          .min(1, 'Opis jest wymagany')
          .max(1000, 'Opis jest zbyt długi'),
        targetAudience: z
          .string()
          .min(1, 'Grupa docelowa jest wymagana')
          .max(200, 'Grupa docelowa jest zbyt długa'),
        expectedEffects: z
          .string()
          .min(1, 'Oczekiwane efekty są wymagane')
          .max(500, 'Oczekiwane efekty są zbyt długie'),
        isPaid: z.boolean().default(false),
        price: z.number().min(0).optional(),
        categoryId: z.number().min(1, 'Kategoria jest wymagana'),
        thumbnailId: z.number().min(1, 'Miniatura jest wymagana'),
        keywordIds: z.array(z.number()).optional().default([]),
        audioSessionIds: z.array(z.number()).optional().default([]),
        worksheetIds: z.array(z.number()).optional().default([])
      })
    )
    .mutation(async ({ input }) => {
      const { keywordIds, audioSessionIds, worksheetIds, ...programData } = input

      // Sprawdź czy kategoria istnieje
      const category = await prisma.programCategory.findUnique({
        where: { id: programData.categoryId }
      })
      if (!category) {
        throw new Error('Kategoria nie została znaleziona')
      }

      // Sprawdź czy miniatura istnieje
      const thumbnail = await prisma.media.findUnique({
        where: { id: programData.thumbnailId }
      })
      if (!thumbnail) {
        throw new Error('Miniatura nie została znaleziona')
      }

      // Sprawdź czy słowa kluczowe istnieją
      if (keywordIds.length > 0) {
        const keywords = await prisma.programKeyword.findMany({
          where: { id: { in: keywordIds } }
        })
        if (keywords.length !== keywordIds.length) {
          throw new Error('Jeden lub więcej słów kluczowych nie zostało znalezionych')
        }
      }

      // Sprawdź czy sesje audio istnieją
      if (audioSessionIds.length > 0) {
        const audioSessions = await prisma.audioSession.findMany({
          where: { id: { in: audioSessionIds } }
        })
        if (audioSessions.length !== audioSessionIds.length) {
          throw new Error('Jedna lub więcej sesji audio nie zostało znalezionych')
        }
      }

      // Sprawdź czy arkusze programu istnieją
      if (worksheetIds.length > 0) {
        const worksheets = await prisma.programWorksheet.findMany({
          where: { id: { in: worksheetIds } }
        })
        if (worksheets.length !== worksheetIds.length) {
          throw new Error('Jeden lub więcej arkuszy programu nie zostało znalezionych')
        }
      }

      const program = await prisma.program.create({
        data: {
          ...programData,
          keywords: {
            connect: keywordIds.map(id => ({ id }))
          },
          audioSessions: {
            connect: audioSessionIds.map(id => ({ id }))
          },
          worksheets: {
            connect: worksheetIds.map(id => ({ id }))
          }
        },
        include: {
          category: true,
          keywords: true,
          audioSessions: {
            include: {
              media: true
            }
          },
          worksheets: {
            include: {
              file: true
            }
          }
        }
      })

      return program
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1, 'Tytuł jest wymagany').optional(),
        level: z.number().min(1).max(10).optional(),
        description: z
          .string()
          .min(1, 'Opis jest wymagany')
          .max(1000, 'Opis jest zbyt długi')
          .optional(),
        targetAudience: z
          .string()
          .min(1, 'Grupa docelowa jest wymagana')
          .max(200, 'Grupa docelowa jest zbyt długa')
          .optional(),
        expectedEffects: z
          .string()
          .min(1, 'Oczekiwane efekty są wymagane')
          .max(500, 'Oczekiwane efekty są zbyt długie')
          .optional(),
        isPaid: z.boolean().optional(),
        price: z.number().min(0).optional(),
        categoryId: z.number().min(1, 'Kategoria jest wymagana').optional(),
        thumbnailId: z.number().min(1, 'Miniatura jest wymagana').optional(),
        keywordIds: z.array(z.number()).optional(),
        audioSessionIds: z.array(z.number()).optional(),
        worksheetIds: z.array(z.number()).optional()
      })
    )
    .mutation(async ({ input }) => {
      const { id, keywordIds, audioSessionIds, worksheetIds, ...updateData } = input

      const existingProgram = await prisma.program.findUnique({
        where: { id }
      })

      if (!existingProgram) {
        throw new Error('Program nie został znaleziony')
      }

      // Sprawdź czy kategoria istnieje (jeśli podano)
      if (updateData.categoryId) {
        const category = await prisma.programCategory.findUnique({
          where: { id: updateData.categoryId }
        })
        if (!category) {
          throw new Error('Kategoria nie została znaleziona')
        }
      }

      // Sprawdź czy miniatura istnieje (jeśli podano)
      if (updateData.thumbnailId) {
        const thumbnail = await prisma.media.findUnique({
          where: { id: updateData.thumbnailId }
        })
        if (!thumbnail) {
          throw new Error('Miniatura nie została znaleziona')
        }
      }

      // Sprawdź czy słowa kluczowe istnieją (jeśli podano)
      if (keywordIds !== undefined && keywordIds.length > 0) {
        const keywords = await prisma.programKeyword.findMany({
          where: { id: { in: keywordIds } }
        })
        if (keywords.length !== keywordIds.length) {
          throw new Error('Jeden lub więcej słów kluczowych nie zostało znalezionych')
        }
      }

      // Sprawdź czy sesje audio istnieją (jeśli podano)
      if (audioSessionIds !== undefined && audioSessionIds.length > 0) {
        const audioSessions = await prisma.audioSession.findMany({
          where: { id: { in: audioSessionIds } }
        })
        if (audioSessions.length !== audioSessionIds.length) {
          throw new Error('Jedna lub więcej sesji audio nie została znalezionych')
        }
      }

      // Sprawdź czy arkusze programu istnieją (jeśli podano)
      if (worksheetIds !== undefined && worksheetIds.length > 0) {
        const worksheets = await prisma.programWorksheet.findMany({
          where: { id: { in: worksheetIds } }
        })
        if (worksheets.length !== worksheetIds.length) {
          throw new Error('Jeden lub więcej arkuszy programu nie zostało znalezionych')
        }
      }

      const program = await prisma.program.update({
        where: { id },
        data: {
          ...updateData,
          ...(keywordIds !== undefined && {
            keywords: {
              set: keywordIds.map(id => ({ id }))
            }
          }),
          ...(audioSessionIds !== undefined && {
            audioSessions: {
              set: audioSessionIds.map(id => ({ id }))
            }
          }),
          ...(worksheetIds !== undefined && {
            worksheets: {
              set: worksheetIds.map(id => ({ id }))
            }
          })
        },
        include: {
          category: true,
          keywords: true,
          audioSessions: {
            include: {
              media: true
            }
          },
          worksheets: {
            include: {
              file: true
            }
          }
        }
      })

      return program
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const existingProgram = await prisma.program.findUnique({
        where: { id: input.id }
      })

      if (!existingProgram) {
        throw new Error('Program nie został znaleziony')
      }

      await prisma.program.delete({
        where: { id: input.id }
      })

      return { success: true, message: 'Program został usunięty' }
    })
})

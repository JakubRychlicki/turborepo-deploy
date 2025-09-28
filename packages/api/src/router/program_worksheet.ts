import { z } from 'zod'
import { prisma } from '@repo/database'
import { protectedProcedure, createTRPCRouter } from '../trpc.js'

export const programWorksheetRouter = createTRPCRouter({
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const worksheet = await prisma.programWorksheet.findUnique({
        where: { id: input.id },
        include: {
          file: true
        }
      })

      if (!worksheet) {
        throw new Error('Arkusz programu nie został znaleziony')
      }

      return worksheet
    }),

  create: protectedProcedure
    .input(
      z.object({
        fileId: z.number().min(1, 'ID pliku jest wymagane')
      })
    )
    .mutation(async ({ input }) => {
      const file = await prisma.media.findUnique({
        where: { id: input.fileId }
      })

      if (!file) {
        throw new Error('Plik nie został znaleziony')
      }

      const worksheet = await prisma.programWorksheet.create({
        data: {
          fileId: input.fileId
        },
        include: {
          file: true
        }
      })

      return worksheet
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        fileId: z.number().min(1, 'ID pliku jest wymagane')
      })
    )
    .mutation(async ({ input }) => {
      const { id, fileId } = input

      const existingWorksheet = await prisma.programWorksheet.findUnique({
        where: { id }
      })

      if (!existingWorksheet) {
        throw new Error('Arkusz programu nie został znaleziony')
      }

      const file = await prisma.media.findUnique({
        where: { id: fileId }
      })

      if (!file) {
        throw new Error('Plik nie został znaleziony')
      }

      const worksheet = await prisma.programWorksheet.update({
        where: { id },
        data: { fileId },
        include: {
          file: true
        }
      })

      return worksheet
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const existingWorksheet = await prisma.programWorksheet.findUnique({
        where: { id: input.id }
      })

      if (!existingWorksheet) {
        throw new Error('Arkusz programu nie został znaleziony')
      }

      const programsCount = await prisma.program.count({
        where: {
          worksheets: {
            some: {
              id: input.id
            }
          }
        }
      })

      if (programsCount > 0) {
        throw new Error(
          'Nie można usunąć arkusza programu, który jest przypisany do programów'
        )
      }

      await prisma.programWorksheet.delete({
        where: { id: input.id }
      })

      return { success: true, message: 'Arkusz programu został usunięty' }
    })
})

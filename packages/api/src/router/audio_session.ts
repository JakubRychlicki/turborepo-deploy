import { z } from 'zod'
import { prisma } from '@repo/database'
import { protectedProcedure, createTRPCRouter } from '../trpc.js'

export const audioSessionRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
        search: z.string().optional()
      })
    )
    .query(async ({ input }) => {
      const { page, limit, search } = input

      const where = search
        ? {
            OR: [{ title: { contains: search } }]
          }
        : {}

      const [audioSessions, meta] = await prisma.audioSession
        .paginate({
          where,
          orderBy: { id: 'desc' },
          include: {
            media: true
          }
        })
        .withPages({
          limit,
          page
        })

      return {
        audioSessions,
        meta
      }
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const audioSession = await prisma.audioSession.findUnique({
        where: { id: input.id },
        include: {
          media: true
        }
      })

      if (!audioSession) {
        throw new Error('Sesja audio nie została znaleziona')
      }

      return audioSession
    }),

  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1, 'Tytuł jest wymagany'),
        description: z.string().optional(),
        durationSeconds: z.number().optional(),
        mediaId: z.number().min(1, 'ID mediów jest wymagane')
      })
    )
    .mutation(async ({ input }) => {
      const media = await prisma.media.findUnique({
        where: { id: input.mediaId }
      })

      if (!media) {
        throw new Error('Media nie zostały znalezione')
      }

      const audioSession = await prisma.audioSession.create({
        data: {
          title: input.title,
          description: input.description,
          durationSeconds: input.durationSeconds,
          mediaId: input.mediaId
        },
        include: {
          media: true
        }
      })

      return audioSession
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().min(1, 'Tytuł jest wymagany'),
        description: z.string().optional(),
        durationSeconds: z.number().optional(),
        mediaId: z.number().min(1, 'ID mediów jest wymagane')
      })
    )
    .mutation(async ({ input }) => {
      const { id, mediaId } = input

      const existingAudioSession = await prisma.audioSession.findUnique({
        where: { id }
      })

      if (!existingAudioSession) {
        throw new Error('Sesja audio nie została znaleziona')
      }

      const media = await prisma.media.findUnique({
        where: { id: mediaId }
      })

      if (!media) {
        throw new Error('Media nie zostały znalezione')
      }

      const audioSession = await prisma.audioSession.update({
        where: { id },
        data: { mediaId },
        include: {
          media: true
        }
      })

      return audioSession
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const existingAudioSession = await prisma.audioSession.findUnique({
        where: { id: input.id }
      })

      if (!existingAudioSession) {
        throw new Error('Sesja audio nie została znaleziona')
      }

      const programsCount = await prisma.program.count({
        where: {
          audioSessions: {
            some: {
              id: input.id
            }
          }
        }
      })

      if (programsCount > 0) {
        throw new Error(
          'Nie można usunąć sesji audio, która jest przypisana do programów'
        )
      }

      await prisma.audioSession.delete({
        where: { id: input.id }
      })

      return { success: true, message: 'Sesja audio została usunięta' }
    })
})

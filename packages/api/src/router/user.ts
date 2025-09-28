import { z } from 'zod'
import { prisma } from '@repo/database'
import { protectedProcedure, createTRPCRouter } from '../trpc.js'

const SortKey = z.enum(['firstname', 'email', 'createdAt'])
const SortOrder = z.enum(['asc', 'desc'])
const UserRole = z.enum(['admin', 'user'])

export const userRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
        sort: z
          .string()
          .regex(/^(firstname|email|createdAt):(asc|desc)$/)
          .optional(),
        role: UserRole.optional()
      })
    )
    .query(async ({ input }) => {
      const { page, limit, sort, role } = input

      const [sortBy, sortOrder] = input.sort
        ? (input.sort.split(':') as [
            z.infer<typeof SortKey>,
            z.infer<typeof SortOrder>
          ])
        : (['createdAt', 'desc'] as const)

      const orderBy = { [sortBy]: sortOrder } as const

      const where = role ? { role } : {}

      const [users, meta] = await prisma.user
        .paginate({
          where,
          orderBy
        })
        .withPages({
          limit,
          page
        })

      return {
        users,
        meta
      }
    }),

  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { id: input.id },
        include: {
          narrator: true,
          goals: true
        }
      })

      if (!user) {
        throw new Error('Użytkownik nie został znaleziony')
      }

      return user
    }),

  getMe: protectedProcedure.query(async ({ ctx }) => {
    const user = await prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      include: {
        narrator: true,
        goals: true
      }
    })

    if (!user) {
      throw new Error('Użytkownik nie został znaleziony')
    }

    return user
  }),

  update: protectedProcedure
    .input(
      z.object({
        firstname: z
          .string()
          .min(1, 'Imię jest wymagane')
          .max(50, 'Imię jest zbyt długie')
          .optional(),
        lastname: z
          .string()
          .min(1, 'Nazwisko jest wymagane')
          .max(50, 'Nazwisko jest zbyt długie')
          .optional(),
        gender: z.enum(['MALE', 'FEMALE', 'OTHER']).optional(),
        narratorId: z.number().optional(),
        goalIds: z.array(z.number()).optional()
      })
    )
    .mutation(async ({ input, ctx }) => {
      const userId = ctx.session.user.id
      const { goalIds, ...updateData } = input

      if (updateData.narratorId) {
        const narrator = await prisma.narrator.findUnique({
          where: { id: updateData.narratorId }
        })
        if (!narrator) {
          throw new Error('Narrator nie został znaleziony')
        }
      }

      if (goalIds && goalIds.length > 0) {
        const goals = await prisma.goal.findMany({
          where: { id: { in: goalIds } }
        })
        if (goals.length !== goalIds.length) {
          throw new Error('Jeden lub więcej celów nie zostało znalezionych')
        }
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          ...updateData,
          ...(goalIds !== undefined && {
            goals: {
              set: goalIds.map((id) => ({ id }))
            }
          })
        },
        include: {
          narrator: true,
          goals: true
        }
      })

      return updatedUser
    })
})

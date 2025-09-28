import { z } from 'zod'

// ADD PROGRAM
export function getAddProgramFormSchema(
  t?: (key: string, values?: { min?: number; max?: number }) => string
) {
  return z
    .object({
      title: z
        .string()
        .min(1, {
          message: t ? t('required') : 'To pole jest wymagane'
        })
        .max(100, {
          message: t
            ? t('maxLength', { max: 100 })
            : 'To pole nie może przekroczyć 100 znaków'
        }),
      description: z
        .string()
        .min(1, {
          message: t ? t('required') : 'To pole jest wymagane'
        })
        .max(1000, {
          message: t
            ? t('maxLength', { max: 1000 })
            : 'To pole nie może przekroczyć 1000 znaków'
        }).optional(),
      level: z.number(),
      targetAudience: z
        .string()
        .min(1, {
          message: t ? t('required') : 'To pole jest wymagane'
        })
        .max(200, {
          message: t
            ? t('maxLength', { max: 200 })
            : 'To pole nie może przekroczyć 200 znaków'
        }).optional(),
      expectedEffects: z
        .string()
        .min(1, {
          message: t ? t('required') : 'To pole jest wymagane'
        })
        .max(500, {
          message: t
            ? t('maxLength', { max: 500 })
            : 'To pole nie może przekroczyć 500 znaków'
        }).optional(),
      categoryId: z.number().nullish(),
      thumbnailId: z.number().nullish(),
      audioSessionIds: z.array(z.number()).optional()
    })
    .superRefine((val, ctx) => {
      if (!val.categoryId) {
        ctx.addIssue({
          code: 'custom',
          path: ['categoryId'],
          message: t ? t('required') : 'To pole jest wymagane'
        })
      }
      if (!val.thumbnailId) {
        ctx.addIssue({
          code: 'custom',
          path: ['thumbnailId'],
          message: t ? t('required') : 'To pole jest wymagane'
        })
      }
    })
}

export type AddProgramFormValues = z.infer<
  Awaited<ReturnType<typeof getAddProgramFormSchema>>
>

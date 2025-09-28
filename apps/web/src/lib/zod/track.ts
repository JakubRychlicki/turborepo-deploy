import { z } from 'zod'

export function getTrackFormSchema(
  t?: (key: string, values?: { min?: number; max?: number }) => string
) {
  return z.object({
    title: z
      .string()
      .min(1, {
        message: t ? t('required') : 'To pole jest wymagane'
      })
      .max(200, {
        message: t
          ? t('maxLength', { max: 200 })
          : 'To pole nie może przekroczyć 200 znaków'
      }),
    description: z
      .string()
      .max(500, {
        message: t
          ? t('maxLength', { max: 500 })
          : 'To pole nie może przekroczyć 500 znaków'
      })
      .optional(),
    durationSeconds: z.string().min(1, {
      message: t ? t('required') : 'To pole jest wymagane'
    }),
    mediaId: z.number().nullish()
  })
}

export type AddTrackFormValues = z.infer<
  Awaited<ReturnType<typeof getTrackFormSchema>>
>

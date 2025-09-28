import { z } from 'zod'

export function getAddCategoryFormSchema(
  t?: (key: string, values?: { min?: number; max?: number }) => string
) {
  return z.object({
    name: z
      .string()
      .min(1, {
        message: t ? t('required') : 'To pole jest wymagane'
      })
      .max(100, {
        message: t
          ? t('maxLength', { max: 100 })
          : 'To pole nie może przekroczyć 100 znaków'
      })
  })
}

export type AddCategoryFormValues = z.infer<
  Awaited<ReturnType<typeof getAddCategoryFormSchema>>
>

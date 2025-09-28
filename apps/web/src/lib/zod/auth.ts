import { z } from 'zod'

export function getLoginFormSchema() {
  return z.object({
    email: z
      .email('Niepoprawny adres email')
      .min(1, { message: 'To pole jest wymagane' }),
    password: z.string().min(1, {
      message: 'To pole jest wymagane'
    })
  })
}

export type LoginFormValues = z.infer<
  Awaited<ReturnType<typeof getLoginFormSchema>>
>

export function getResetPasswordFormSchema() {
  return z.object({
    password: z
      .string()
      .min(8, { message: 'Hasło musi mieć co najmniej 8 znaków' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: 'Hasło musi zawierać małą literę, wielką literę i cyfrę'
      }),
    confirmPassword: z.string().min(1, { message: 'To pole jest wymagane' })
  }).refine((data) => data.password === data.confirmPassword, {
    message: 'Hasła nie są identyczne',
    path: ['confirmPassword']
  })
}

export type ResetPasswordFormValues = z.infer<
  Awaited<ReturnType<typeof getResetPasswordFormSchema>>
>


export function getRegisterFormSchema() {
  return z.object({
    name: z.string().min(1, { message: 'To pole jest wymagane' }),
    email: z.email({ message: 'Niepoprawny adres email' }).min(1, { message: 'To pole jest wymagane' }),
    password: z.string().min(1, { message: 'To pole jest wymagane' })
  })
}

export type RegisterFormValues = z.infer<
  Awaited<ReturnType<typeof getRegisterFormSchema>>
>
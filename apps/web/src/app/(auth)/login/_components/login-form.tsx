'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { CustomInputText } from '@/components/controls/custom-input-text'
import { CustomInputPassword } from '@/components/controls/custom-input-password'
import { getLoginFormSchema, type LoginFormValues } from '@/lib/zod/auth'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { NAVIGATION } from '@/config/constants'
import { useTranslations } from 'next-intl'

export default function LoginForm() {
  const router = useRouter()
  const t = useTranslations('pages.login')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormValues>({
    resolver: zodResolver(getLoginFormSchema()),
    defaultValues: {
      email: '',
      password: ''
    },
    mode: 'onSubmit'
  })

  async function onSubmit(values: LoginFormValues) {
    await authClient.signIn.email(
      {
        email: values.email,
        password: values.password
      },
      {
        onSuccess: async () => {
          const session = await authClient.getSession();
  
          if (session?.data?.user.role !== "admin") {
            await authClient.signOut();
            toast.error(t('toast.error_admin'));
            return;
          }
  
          router.push(NAVIGATION.DASHBOARD);
          toast.success(t('toast.success'));
        },
        onError: (error) => {
          switch (error.error.message) {
            case 'Invalid email or password':
              toast.error(t('toast.error'));
              break;
            default:
              toast.error(t('toast.error_default'));
          }
        }
      }
    )
  }

  return (
    <>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-foreground mb-2">{t('title')}</h1>
        <p className="text-sm text-muted-foreground">
          {t('description')}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex flex-col gap-4">
          {/* Email Field */}
          <CustomInputText
            id="email"
            label={t('email')}
            errors={errors.email?.message}
            autoComplete="email"
            {...register('email')}
          />

          {/* Password Field */}
          <CustomInputPassword
            id="password"
            label={t('password')}
            errors={errors.password?.message}
            autoComplete="current-password"
            {...register('password')}
          />
        </div>

        <Button
          size="lg"
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? <LoadingSpinner className='text-white' /> : t('submit')}
        </Button>
      </form>
    </>
  )
}

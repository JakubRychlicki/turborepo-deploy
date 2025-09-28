import { getTranslations } from 'next-intl/server'
import { CheckCircle } from 'lucide-react'

export default async function Confirmation() {
  const t = await getTranslations('pages.confirmation')

  return (
    <div className="max-w-md mx-auto space-y-8">
      <div className="text-center space-y-6">
        <div className="mx-auto size-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
          <CheckCircle className="size-6 text-white" />
        </div>

        <h1 className="text-2xl font-bold text-green-600">{t('title')}</h1>
      </div>

      <div className="text-center">
        <div className="p-6 bg-green-50 rounded-xl border border-green-200 shadow-sm">
          <p className="text-lg font-semibold text-green-600 mb-3">
            {t('gratulations')}
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {t('description')}
          </p>
        </div>
      </div>
    </div>
  )
}

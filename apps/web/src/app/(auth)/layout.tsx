import Logo from '@/components/icons/logo'
import { getTranslations } from 'next-intl/server'

export default async function AuthLayout({
  children
}: {
  readonly children: React.ReactNode
}) {
  const tMeta = await getTranslations('meta')
  const tFooter = await getTranslations('footer')

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(135deg, #FFA5A5 0%, #FFC8C8 50%, #FFE1E1 100%)'
      }}
    >
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-3 px-4 py-2 rounded-lg">
            <Logo className="size-9" />
            <span className="text-2xl font-bold text-foreground">
              {tMeta('appName')}
            </span>
          </div>
        </div>

        <div className="bg-card p-8 rounded-2xl shadow-sm border border-border">
          {children}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            {tFooter('madeBy')}{' '}
            <a
              href="https://dogtronic.io"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-foreground hover:underline"
            >
              {tFooter('dogtronic')}
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

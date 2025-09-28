import { SidebarTrigger } from '@/components/ui/sidebar'
import { useTranslations } from 'next-intl'
import Logo from '@/components/icons/logo'

export function SiteHeader() {
  const tMeta = useTranslations('meta')
  return (
    <header className="flex h-(--header-height) shrink-0 items-center border-b border-border bg-card backdrop-blur supports-[backdrop-filter]:bg-card md:hidden">
      <div className="flex w-full items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Logo className="size-6" />
          <span className="text-lg font-bold text-foreground">
            {tMeta('appName')}
          </span>
        </div>
        <SidebarTrigger />
      </div>
    </header>
  )
}

import { AppSidebar } from '@/components/layout/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import { SiteHeader } from '@/components/layout/site-header'

export default async function DashboardLayout({
  children
}: {
  readonly children: React.ReactNode
}) {
  return (
      <SidebarProvider
        style={
          {
            '--sidebar-width': 'calc(var(--spacing) * 62)',
            '--header-height': 'calc(var(--spacing) * 12)'
          } as React.CSSProperties
        }
      >
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <SiteHeader />
          <main className="@container/main flex flex-1 flex-col p-4 md:p-8">
            {children}
          </main>
        </div>
      </SidebarProvider>
  )
}

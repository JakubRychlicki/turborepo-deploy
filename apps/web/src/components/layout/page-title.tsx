import { type LucideIcon } from 'lucide-react'
import { type ComponentType } from 'react'

interface PageTitleProps {
  icon: LucideIcon | ComponentType<{ className?: string }>
  children: React.ReactNode
  className?: string
}

export function PageTitle({ icon: Icon, children, className = '' }: PageTitleProps) {
  return (
    <h1 className={`flex items-center gap-3 text-2xl font-bold ${className}`}>
      <Icon className="size-6" />
      {children}
    </h1>
  )
}

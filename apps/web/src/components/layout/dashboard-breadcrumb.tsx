'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { NAVIGATION } from '@/config/constants'

interface DashboardBreadcrumbProps {
  currentPageLabel: string
  parentSection: 'programs' | 'tracks' | 'users'
}

export function DashboardBreadcrumb({ 
  currentPageLabel, 
  parentSection 
}: DashboardBreadcrumbProps) {
  const tNavigation = useTranslations('navigation')

  const getParentNavigation = () => {
    switch (parentSection) {
      case 'programs':
        return NAVIGATION.PROGRAMS
      case 'tracks':
        return NAVIGATION.TRACKS
      case 'users':
        return NAVIGATION.USERS
      default:
        return NAVIGATION.DASHBOARD
    }
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={NAVIGATION.DASHBOARD}>{tNavigation('dashboard')}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link href={getParentNavigation()}>
              {tNavigation(parentSection)}
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>{currentPageLabel}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}

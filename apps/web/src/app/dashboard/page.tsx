"use client"

import { Users } from 'lucide-react'
import { UsersTable } from './_components/table/users-table'
import { useTranslations } from 'next-intl'
import { UsersStats } from './_components/users-stats'
import { PageTitle } from '@/components/layout/page-title'

export default function Dashboard() {
  const tDashboard = useTranslations('pages.dashboard')
  
  return (
    <div className='space-y-6'>
      <PageTitle icon={Users}>
        {tDashboard('title')}
      </PageTitle>

      <UsersStats />
      <UsersTable />
    </div>
  )
}

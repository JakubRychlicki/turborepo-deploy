'use client'

import { IconMusic } from '@tabler/icons-react'
import { PageTitle } from '@/components/layout/page-title'
import { DashboardBreadcrumb } from '@/components/layout/dashboard-breadcrumb'
import { AddProgramForm } from './_components/add-program-form'
import { useTranslations } from 'next-intl'

export default function AddProgramPage() {
  const tPrograms = useTranslations('pages.programs')

  return (
    <div className="space-y-6">
      <DashboardBreadcrumb 
        currentPageLabel={tPrograms('addProgram')}
        parentSection="programs"
      />

      <PageTitle icon={IconMusic}>
        {tPrograms('addProgram')}
      </PageTitle>

      <AddProgramForm />
    </div>
  )
}

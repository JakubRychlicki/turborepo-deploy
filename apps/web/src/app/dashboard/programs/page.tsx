'use client'

import { ProgramsStats } from '@/app/dashboard/programs/_components/programs-stats'
import { IconMusic } from '@tabler/icons-react'
import { useTranslations } from 'next-intl'
import { PageTitle } from '@/components/layout/page-title'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { NAVIGATION } from '@/config/constants'

export default function ProgramsPage() {
  const tPrograms = useTranslations('pages.programs')

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <PageTitle icon={IconMusic}>
          {tPrograms('title')}
        </PageTitle>
        <Button asChild className="self-start">
          <Link href={NAVIGATION.PROGRAMS_ADD}>
            <Plus className="size-4" />
            {tPrograms('addProgram')}
          </Link>
        </Button>
      </div>

      <ProgramsStats />
    </div>
  )
}

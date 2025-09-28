"use client"

import { PageTitle } from '@/components/layout/page-title'
import { DashboardBreadcrumb } from '@/components/layout/dashboard-breadcrumb'
import { useTranslations } from 'next-intl'
import { IconPlaylist } from '@tabler/icons-react'
import { AddTrackForm } from './_components/add-track-form'

export default function AddTrackPage() {
  const tTracks = useTranslations('pages.tracks')

  return (
    <div className="space-y-6">
      <DashboardBreadcrumb 
        currentPageLabel={tTracks('addTrack')}
        parentSection="tracks"
      />

      <PageTitle icon={IconPlaylist}>
        {tTracks('addTrack')}
      </PageTitle>

      <AddTrackForm />
    </div>
  )
}
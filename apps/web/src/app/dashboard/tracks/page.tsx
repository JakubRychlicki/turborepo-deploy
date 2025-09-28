'use client'

import { IconMusic } from '@tabler/icons-react'
import { useTranslations } from 'next-intl'
import { PageTitle } from '@/components/layout/page-title'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { NAVIGATION } from '@/config/constants'
import { trpc } from '@/utils/trpc'
import { useQuery } from '@tanstack/react-query'
import { AudioSessionCard } from './_components/audio-session-card'

export default function TracksPage() {
  const tTracks = useTranslations('pages.tracks')

  const { data: audioSessions } = useQuery(trpc.audioSession.getAll.queryOptions({ page: 1, limit: 10 }))

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <PageTitle icon={IconMusic}>
          {tTracks('title')}
        </PageTitle>
        <Button asChild className="self-start">
          <Link href={NAVIGATION.TRACKS_ADD}>
            <Plus className="size-4" />
            {tTracks('addTrack')}
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {audioSessions?.audioSessions.map((audioSession) => (
          <AudioSessionCard key={audioSession.id} audioSession={audioSession} />
        ))}
      </div>
    </div>
  )
}

'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useQuery } from '@tanstack/react-query'
import { trpc } from '@/utils/trpc'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { X, Plus, Music, ChevronLeft, ChevronRight, Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Input } from '@/components/ui/input'
import { PAGE_SIZE } from '@/config/constants'
import type { AudioSession } from '@/types/audio_session'

interface AudioSessionSelectorProps {
  selectedAudioSessions: AudioSession[]
  onSelectionChange: (audioSessions: AudioSession[]) => void
  maxSelections?: number
}

export function AudioSessionSelector({
  selectedAudioSessions,
  onSelectionChange,
  maxSelections
}: AudioSessionSelectorProps) {
  const t = useTranslations('common')
  const tProgram = useTranslations('entities.program')
  const tPagination = useTranslations('pagination')

  const [isExpanded, setIsExpanded] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('')

  // Debounce search query
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery)
      setCurrentPage(1) // Reset to first page when searching
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery])

  const { data: audioSessionsData, isLoading } = useQuery(
    trpc.audioSession.getAll.queryOptions({
      page: currentPage,
      limit: PAGE_SIZE,
      search: debouncedSearchQuery || undefined
    })
  )

  const audioSessions = audioSessionsData?.audioSessions || []
  const meta = audioSessionsData?.meta

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
  }

  const handleToggleSelection = (session: AudioSession) => {
    const isSelected = selectedAudioSessions.some(selected => selected.id === session.id)
    
    if (isSelected) {
      onSelectionChange(selectedAudioSessions.filter((selected) => selected.id !== session.id))
    } else {
      if (!maxSelections || selectedAudioSessions.length < maxSelections) {
        onSelectionChange([...selectedAudioSessions, session])
      }
    }
  }

  const handleRemoveSelection = (sessionId: number) => {
    onSelectionChange(selectedAudioSessions.filter((selected) => selected.id !== sessionId))
  }

  const formatDuration = (seconds?: number) => {
    if (!seconds) return ''
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-4">
      {selectedAudioSessions.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground">
              {tProgram('selectedAudioSessions')} ({selectedAudioSessions.length})
            </h4>
            {maxSelections && (
              <Badge variant="secondary">
                {selectedAudioSessions.length}/{maxSelections}
              </Badge>
            )}
          </div>
          <div className="space-y-2">
            {selectedAudioSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-3 bg-accent/10 border-accent rounded-lg border shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <Music className="size-4 text-accent" />
                  <div>
                    <p className="font-medium text-sm text-accent">{session.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {session.durationSeconds && (
                        <span className="ml-2">
                          • {formatDuration(session.durationSeconds)}
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveSelection(session.id)}
                  className="h-8 w-8 p-0"
                >
                  <X className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      <Button
        type="button"
        variant="outline"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full justify-between"
        disabled={isLoading}
      >
        <span>
          {isExpanded
            ? tProgram('hideAudioSessions')
            : tProgram('selectAudioSessions')}
        </span>
        <Plus
          className={cn(
            'size-4 transition-transform',
            isExpanded && 'rotate-45'
          )}
        />
      </Button>

      {isExpanded && (
        <Card className="px-6 gap-3">
          <CardTitle className="text-sm">
            {tProgram('availableAudioSessions')}
          </CardTitle>
          <CardDescription className="text-xs">
            {tProgram('selectAudioSessionsDescription')}
          </CardDescription>
          <CardContent className="px-0 pt-4">
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground size-4" />
              <Input
                placeholder={tProgram('searchAudioSessions')}
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            {isLoading ? (
              <div className="text-center py-4 text-muted-foreground">
                {t('loading')}...
              </div>
            ) : audioSessions.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                {tProgram('noAudioSessionsAvailable')}
              </div>
            ) : (
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {audioSessions.map((session) => {
                  const isSelected = selectedAudioSessions.some(selected => selected.id === session.id)
                  const isDisabled =
                    !isSelected &&
                    maxSelections &&
                    selectedAudioSessions.length >= maxSelections

                  return (
                    <div
                      key={session.id}
                      className={cn(
                        'flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all duration-200',
                        isSelected
                          ? 'bg-accent/10 border-accent text-accent shadow-sm'
                          : isDisabled
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-muted/50 hover:border-muted-foreground/20'
                      )}
                      onClick={() =>
                        !isDisabled && handleToggleSelection(session)
                      }
                    >
                      <div className="flex items-center gap-3">
                        <Music className={cn(
                          "size-4",
                          isSelected ? "text-accent" : "text-muted-foreground"
                        )} />
                        <div>
                          <p className={cn(
                            "font-medium text-sm",
                            isSelected ? "text-accent" : "text-foreground"
                          )}>{session.title}</p>
                          <p className={cn(
                            "text-xs",
                            isSelected ? "text-muted-foreground" : "text-muted-foreground"
                          )}>
                            {session.durationSeconds && (
                              <span className="ml-2">
                                • {formatDuration(session.durationSeconds)}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      {isSelected && (
                        <Badge variant="outline" className="text-xs text-accent border-accent">
                          {t('selected')}
                        </Badge>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {meta && meta.pageCount > 1 && (
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  {tPagination('info', {
                    start: (currentPage - 1) * PAGE_SIZE + 1,
                    end: Math.min(currentPage * PAGE_SIZE, meta.totalCount),
                    total: meta.totalCount
                  })}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="size-4" />
                  </Button>

                  <div className="flex items-center gap-1">
                    {Array.from(
                      { length: Math.min(5, meta.pageCount) },
                      (_, i) => {
                        const pageNum =
                          Math.max(
                            1,
                            Math.min(meta.pageCount - 4, currentPage - 2)
                          ) + i
                        if (pageNum > meta.pageCount) return null

                        return (
                          <Button
                            type="button"
                            key={pageNum}
                            variant={
                              currentPage === pageNum ? 'default' : 'outline'
                            }
                            size="icon"
                            onClick={() => handlePageChange(pageNum)}
                          >
                            {pageNum}
                          </Button>
                        )
                      }
                    )}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === meta.pageCount}
                  >
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

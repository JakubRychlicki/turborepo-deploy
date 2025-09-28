'use client'

import { Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import type { UserRow } from '@/types/user'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { NAVIGATION } from '@/config/constants'

interface UserActionsProps {
  user: UserRow
}

export function UserActions({ user }: UserActionsProps) {
  const t = useTranslations('common')   
  const router = useRouter()

  const handleViewUser = () => {
    router.push(`${NAVIGATION.USERS}/${user.id}`)
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleViewUser}
          className="size-8 p-0"
        >
          <Eye className="size-4" />
          <span className="sr-only">{t('actions.preview')}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent side='right'>
        <p>{t('actions.preview')}</p>
      </TooltipContent>
    </Tooltip>
  )
}

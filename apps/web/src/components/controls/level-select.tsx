'use client'

import { Button } from '@/components/ui/button'
import { Check, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { DropdownMenu } from './custom-dropdown-menu'

interface LevelSelectProps {
  selectedLevel?: number
  min?: number
  max?: number
  disabled?: boolean
  size?: string
  onSelect: (selected: number) => void
}

export function LevelSelect({
  selectedLevel = 1,
  min = 1,
  max = 10,
  size = 'w-[160px]',
  disabled,
  onSelect
}: LevelSelectProps) {
  const t = useTranslations('common')
  const [open, setOpen] = useState(false)

  const levels = Array.from({ length: max - min + 1 }, (_, i) => ({
    id: min + i,
    name: `${t('level')} ${min + i}`
  }))

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
  }

  const handleSelect = (levelId: number) => {
    onSelect(levelId)
  }

  const getDisplayText = () => {
    const level = levels.find((level) => level.id === selectedLevel)
    return level?.name || `${t('level')} ${selectedLevel}`
  }

  const trigger = (
    <Button
      type="button"
      variant="outline"
      className={cn('justify-between', size)}
      disabled={disabled}
    >
      <span className="truncate">{getDisplayText()}</span>
      <ChevronDown
        className={cn(
          'size-4 transition-transform duration-200',
          open && 'rotate-180'
        )}
      />
    </Button>
  )

  const content = (
    <div className={cn('p-1', size)}>
      <div className="pr-2 max-h-[236px] overflow-y-auto flex flex-col gap-1">
        {levels.map((level) => (
          <Button
            key={level.id}
            type="button"
            variant="dropdown-item"
            className="w-full justify-between items-center px-2"
            data-selected={selectedLevel === level.id}
            onClick={() => handleSelect(level.id)}
          >
            <span className="truncate">{level.name}</span>
            {selectedLevel === level.id && <Check className="size-4" />}
          </Button>
        ))}
      </div>
    </div>
  )

  return (
    <div className={cn('flex flex-col gap-2', size)}>
      <h4 className="text-sm font-medium text-foreground">{t('level')}</h4>
      <DropdownMenu
        open={open}
        onOpenChange={handleOpenChange}
        align="start"
        trigger={trigger}
      >
        {content}
      </DropdownMenu>
    </div>
  )
}

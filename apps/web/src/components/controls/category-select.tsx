'use client'

import { Button } from '@/components/ui/button'
import { Check, ChevronDown, Search, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { useTranslations } from 'next-intl'
import { Input } from '@/components/ui/input'
import { useDebouncedCallback } from "use-debounce";
import { useInfiniteQuery } from '@tanstack/react-query'
import { DropdownMenu } from './custom-dropdown-menu'
import { trpcClient } from '@/utils/trpc'
import type { CategoryOption } from '@/types/category'
import { PAGE_SIZE } from '@/config/constants'

interface CategorySelectProps {
  disabled?: boolean
  onSelect: (selected: CategoryOption | null) => void
  selectedValue?: number | null
  selectedName?: string | null
  size?: string
}

export function CategorySelect({
  disabled,
  onSelect,
  selectedValue,
  selectedName,
  size = 'w-[250px]',
}: CategorySelectProps) {
  const t = useTranslations('common')
  const tCategory = useTranslations('entities.category')
  const tPagination = useTranslations('pagination')
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [inputValue, setInputValue] = useState('')
  const debouncedSearch = useDebouncedCallback((value: string) => {
    setSearch(value);
  }, 300);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (!newOpen) {
      setSearch('')
      setInputValue('')
    }
  }

  const resetSearch = () => {
    setSearch('')
    setInputValue('')
  }

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ['categories-select', search],
    queryFn: async ({ pageParam = 1 }) => {
      const result = await trpcClient.programCategory.getAll.query({
        page: pageParam as number,
        limit: PAGE_SIZE,
        search: search || undefined
      });
      return result;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.meta.isLastPage) return undefined;
      return lastPage.meta.nextPage;
    },
    initialPageParam: 1,
    enabled: open,
  })

  const options = data?.pages.flatMap((page) => page.categories) ?? [];
  const hasMore = hasNextPage;

  const handleLoadMore = () => {
    fetchNextPage();
  };

  const handleSelect = (option: CategoryOption) => {
    if (selectedValue === option.id) {
      onSelect(null);
    } else {
      onSelect(option);
      setOpen(false);
    }
  };

  const trigger = (
    <Button
      type="button"
      variant="outline"
      className={cn('justify-between', size)}
      disabled={disabled}
    >
      <span className="truncate">
        {selectedName || tCategory('select.default')}
      </span>
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
      <div className="px-2 py-1.5">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder={t('actions.search')}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              debouncedSearch(e.target.value);
            }}
            className="pl-8 pr-8"
          />
          {inputValue && (
            <button
              type="button"
              className="absolute right-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-sm"
              onClick={resetSearch}
              aria-label="Wyczyść wyszukiwanie"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center py-2 px-2">
          <div className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : options.length > 0 ? (
        <div className="px-2 max-h-[250px] overflow-y-auto flex flex-col gap-1">
          {options.map((option: CategoryOption) => (
            <Button
              key={option.id}
              type="button"
              variant="dropdown-item"
              className="w-full justify-between items-center px-2"
              data-selected={selectedValue === option.id}
              onClick={() => handleSelect(option)}
            >
              <span className="truncate">{option.name}</span>
              {selectedValue === option.id && <Check className="size-4" />}
            </Button>
          ))}
          {hasMore && (
            <Button
              type="button"
              variant="ghost"
              className="w-full text-sm text-muted-foreground hover:text-foreground"
              onClick={handleLoadMore}
              disabled={isFetchingNextPage}
            >
              {isFetchingNextPage ? tPagination("loading") : tPagination("loadMore")}
            </Button>
          )}
        </div>
      ) : (
        <p className="px-4 py-1.5 text-sm text-muted-foreground">
          {t("messages.noResults")}
        </p>
      )}
    </div>
  )

  return (
    <div className={cn("flex flex-col gap-2", size)}>
      <h4 className="text-sm font-medium text-foreground">
        {tCategory('select.title')}
      </h4>
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

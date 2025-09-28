'use client'

import { useState } from 'react'
import {
  type SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableHeaderRow,
  TableRow
} from '@/components/ui/table'

import { TablePagination } from '@/components/table/table-pagination'
import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { useTranslations } from 'next-intl'
import { useUsersColumns } from './users-columns'
import { PAGE_SIZE } from '@/config/constants'
import { trpc } from '@/utils/trpc'
import { getSortParam } from '@/utils/table-utils'
import Loader from '@/components/loader'

export function UsersTable() {
  const t = useTranslations('common')
  const tClient = useTranslations('entities.user')

  // State management
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(PAGE_SIZE)
  const [sorting, setSorting] = useState<SortingState>([])

  const sortParam = getSortParam(sorting)

  const { data, isLoading } = useQuery({
    ...trpc.user.getAll.queryOptions({
      page,
      limit: pageSize,
      role: 'user',
      ...(sortParam && { sort: sortParam }),
    }),
    placeholderData: keepPreviousData,
  })

  const columns = useUsersColumns({
    tColumns: tClient
  })

  const table = useReactTable({
    data: data?.users || [],
    columns,
    manualPagination: true,
    pageCount: data?.meta.pageCount || 0,
    meta: { total: data?.meta.totalCount || 0 },
    state: {
      sorting,
      pagination: {
        pageIndex: page - 1,
        pageSize: pageSize
      }
    },
    defaultColumn: {
      minSize: 0,
      size: 200,
      maxSize: 500
    },
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === 'function'
          ? updater({
              pageIndex: page - 1,
              pageSize: pageSize
            })
          : updater

      setPage(newPagination.pageIndex + 1)
      setPageSize(newPagination.pageSize)
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel()
  })

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex flex-col space-y-4 bg-card rounded-md border shadow-sm">
        <div className="flex-1 relative">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableHeaderRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{
                        width:
                          header.getSize() === Number.MAX_SAFE_INTEGER
                            ? 'auto'
                            : header.getSize()
                      }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableHeaderRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 py-8 text-center pointer-events-none"
                  >
                    <Loader />
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    {t('messages.noResults')}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {table.options.meta?.total && table.options.meta?.total > 0 ? (
          <TablePagination table={table} />
        ) : null}
      </div>
    </div>
  )
}

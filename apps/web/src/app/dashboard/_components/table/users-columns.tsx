'use client'

import { TableColumnHeader } from '@/components/table/table-column-header'
import { TableCellContent } from '@/components/ui/table'
import type { ColumnDef } from '@tanstack/react-table'
import type { UserRow } from '@/types/user'
import { UserActions } from './user-actions'

interface UsersColumnsProps {
  tColumns: (key: string) => string
}

export function useUsersColumns({
  tColumns
}: UsersColumnsProps): ColumnDef<UserRow>[] {
  return [
    {
      id: 'firstname',
      header: ({ column }) => (
        <TableColumnHeader column={column} title={tColumns('fullname')} />
      ),
      meta: {
        label: tColumns('fullname')
      },
      size: 200,
      accessorFn: (row) => `${row.firstname} ${row.lastname}`,
      cell: ({ row }) => (
        <TableCellContent>
          <div className="truncate w-full">
            {row.getValue('firstname') || '-'}
          </div>
        </TableCellContent>
      )
    },
    {
      id: 'email',
      accessorKey: 'email',
      header: ({ column }) => (
        <TableColumnHeader column={column} title={tColumns('email')} />
      ),
      meta: {
        label: tColumns('email')
      },
      size: 200,
      cell: ({ row }) => (
        <TableCellContent>
          <span className="truncate w-full">{row.getValue('email')}</span>
        </TableCellContent>
      )
    },
    {
      id: 'createdAt',
      accessorKey: 'createdAt',
      header: ({ column }) => (
        <TableColumnHeader column={column} title={tColumns('createdAt')} />
      ),
      meta: {
        label: tColumns('createdAt')
      },
      size: 150,
      cell: ({ row }) => {
        const createdAt = row.getValue('createdAt') as Date | undefined
        return (
          <TableCellContent>
            <span className="truncate w-full">
              {createdAt ? createdAt.toLocaleDateString('pl-PL') : '-'}
            </span>
          </TableCellContent>
        )
      }
    },
    {
      id: "actions",
      enableHiding: false,
      size: 100,
      cell: ({ row }) => (
        <UserActions user={row.original} />
      ),
    },
  ]
}

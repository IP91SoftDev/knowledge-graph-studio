'use client'

import { useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
} from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import { formatDistance } from 'date-fns'
import { cn } from '@/lib/utils'
import { StatusBadge } from './status-badge'
import { ProgressBar } from './progress-bar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'

interface Resource {
  id: string
  title: string
  status: 'verified' | 'review' | 'queue' | 'rejected'
  category: string
  aiConfidence: number
  lastModified: Date
  platform?: string
}

interface ResourceTableProps {
  data: Resource[]
  onRowSelect?: (ids: string[]) => void
  onAction?: (action: string, id: string) => void
  className?: string
}

export function ResourceTable({ data, onRowSelect, onAction, className }: ResourceTableProps) {
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState('')
  
  const columnHelper = createColumnHelper<Resource>()
  
  const columns = [
    columnHelper.display({
      id: 'select',
      header: ({ table }) => (
        <input
          type="checkbox"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
          className="w-4 h-4"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          className="w-4 h-4"
        />
      ),
    }),
    columnHelper.accessor('title', {
      header: 'Resource',
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-accent/10 flex items-center justify-center">
            <span className="text-accent font-semibold text-sm">
              {row.original.title[0]}
            </span>
          </div>
          <div>
            <div className="font-medium text-foreground">{row.original.title}</div>
            {row.original.platform && (
              <div className="text-xs text-muted">{row.original.platform}</div>
            )}
          </div>
        </div>
      ),
    }),
    columnHelper.accessor('status', {
      header: 'Status',
      cell: ({ getValue }) => <StatusBadge status={getValue()} />,
      filterFn: 'equals',
    }),
    columnHelper.accessor('category', {
      header: 'Category',
      cell: ({ getValue }) => (
        <span className="text-sm text-muted-foreground">{getValue()}</span>
      ),
      filterFn: 'equals',
    }),
    columnHelper.accessor('aiConfidence', {
      header: 'AI Confidence',
      cell: ({ getValue }) => <ProgressBar value={getValue()} showLabel={true} />,
      sortingFn: 'basic',
    }),
    columnHelper.accessor('lastModified', {
      header: 'Last Modified',
      cell: ({ getValue }) => (
        <span className="text-sm text-muted-foreground">
          {formatDistance(getValue(), new Date(), { addSuffix: true })}
        </span>
      ),
      sortingFn: 'datetime',
    }),
    columnHelper.display({
      id: 'actions',
      header: '',
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreHorizontal className="w-4 h-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => onAction?.('edit', row.id)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction?.('approve', row.id)}>
              Approve
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onAction?.('reject', row.id)}>
              Reject
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => onAction?.('delete', row.id)}
              className="text-error"
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    }),
  ]
  
  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
      globalFilter,
    },
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })
  
  return (
    <div className={cn('border border-border rounded-lg overflow-hidden', className)}>
      {/* Search Bar */}
      <div className="p-4 border-b border-border">
        <input
          type="text"
          placeholder="Search resources..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="w-full px-4 py-2 bg-surface border border-border rounded-md text-sm text-foreground placeholder:text-muted"
        />
      </div>
      
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className="border-b border-border bg-surface-hover">
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="h-12 px-4 text-left text-sm font-medium text-muted"
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className={cn(
                  'border-b border-border transition-colors duration-200 cursor-pointer',
                  row.getIsSelected() ? 'bg-accent/10' : 'hover:bg-surface-hover/50'
                )}
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="p-4 text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="p-4 border-t border-border flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          Showing {table.getPaginationRowModel().rows.length} of {data.length}
        </span>
        <div className="flex gap-2">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="px-3 py-1 text-sm border border-border rounded disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="px-3 py-1 text-sm border border-border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}

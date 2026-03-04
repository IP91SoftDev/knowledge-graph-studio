'use client'

import { useState } from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

interface Resource {
  id: string
  title: string
  category: string
  aiConfidence: number
  status: 'verified' | 'needs_review' | 'ai_queue' | 'rejected'
  lastModified: string
}

interface ResourceDatagridProps {
  resources: Resource[]
  onBulkApprove?: (ids: string[]) => void
  onBulkReject?: (ids: string[]) => void
}

export function ResourceDatagrid({ 
  resources, 
  onBulkApprove, 
  onBulkReject 
}: ResourceDatagridProps) {
  const [rowSelection, setRowSelection] = useState({})

  const columns = [
    {
      id: 'select',
      header: ({ table }: any) => (
        <input
          type="checkbox"
          checked={table.getIsAllRowsSelected()}
          onChange={table.getToggleAllRowsSelectedHandler()}
          className="w-4 h-4"
        />
      ),
      cell: ({ row }: any) => (
        <input
          type="checkbox"
          checked={row.getIsSelected()}
          onChange={row.getToggleSelectedHandler()}
          className="w-4 h-4"
        />
      ),
      size: 48,
    },
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ getValue }: any) => (
        <div className="font-medium truncate">{getValue<string>()}</div>
      ),
    },
    {
      accessorKey: 'category',
      header: 'Category',
      cell: ({ getValue }: any) => (
        <Badge variant="secondary">{getValue<string>()}</Badge>
      ),
      size: 140,
    },
    {
      accessorKey: 'aiConfidence',
      header: 'AI Confidence',
      cell: ({ getValue }: any) => (
        <div className="flex items-center gap-2">
          <div className="w-24 h-2 bg-surface rounded-full overflow-hidden">
            <div 
              className="h-full bg-accent transition-all"
              style={{ width: `${getValue<number>()}%` }}
            />
          </div>
          <span className="text-sm text-muted-foreground">
            {getValue<number>()}%
          </span>
        </div>
      ),
      size: 120,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ getValue }: any) => {
        const status = getValue<'verified' | 'needs_review' | 'ai_queue' | 'rejected'>()
        const variants = {
          verified: 'success',
          needs_review: 'warning',
          ai_queue: 'accent',
          rejected: 'destructive',
        }
        return <Badge variant={variants[status]}>{status.replace('_', ' ')}</Badge>
      },
      size: 100,
    },
    {
      accessorKey: 'lastModified',
      header: 'Last Modified',
      cell: ({ getValue }: any) => (
        <span className="text-sm text-muted-foreground">{getValue<string>()}</span>
      ),
      size: 140,
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }: any) => (
        <div className="flex gap-2">
          <Button variant="ghost" size="sm">Edit</Button>
          <Button variant="ghost" size="sm">View</Button>
        </div>
      ),
      size: 120,
    },
  ]

  const table = useReactTable({
    data: resources,
    columns,
    state: { rowSelection },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  })

  // Virtualization for 1000+ rows
  const { rows } = table.getRowModel()
  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => document.getElementById('datagrid-scroll'),
    estimateSize: () => 56, // Row height
    overscan: 5,
  })

  return (
    <div className="border border-border rounded-lg">
      {/* Toolbar */}
      <div className="border-b border-border p-4 flex items-center gap-4">
        {/* Filters, Sort, View Options placeholders */}
      </div>
      
      {/* Table */}
      <div id="datagrid-scroll" className="overflow-auto max-h-[400px]">
        <table className="w-full">
          <thead className="bg-surface sticky top-0">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th 
                    key={header.id}
                    className="h-12 px-4 text-left text-sm font-medium text-muted-foreground border-b border-border"
                    style={{ width: header.getSize() }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {virtualizer.getVirtualItems().map((virtualRow) => {
              const row = rows[virtualRow.index]
              return (
                <tr 
                  key={row.id}
                  className="hover:bg-surface/50 transition-colors border-b border-border"
                  style={{ height: `${virtualRow.size}px` }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="border-t border-border p-4 flex items-center justify-between">
        <span className="text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} resources
        </span>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}
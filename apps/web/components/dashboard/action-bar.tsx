'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Sparkles, Download, CheckSquare, X } from 'lucide-react'
import { Loader2 } from 'lucide-react'

interface ActionBarProps {
  selectedCount: number
  isProcessing?: boolean
  onRunAI?: () => void
  onExport?: () => void
  onBulkApprove?: () => void
  onBulkReject?: () => void
}

export function ActionBar({
  selectedCount,
  isProcessing = false,
  onRunAI,
  onExport,
  onBulkApprove,
  onBulkReject,
}: ActionBarProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-14 border-t border-border bg-background px-6 flex items-center gap-3 z-50">
      <Button 
        variant="default" 
        className="bg-accent hover:bg-accent-hover"
        onClick={onRunAI}
        disabled={isProcessing}
      >
        {isProcessing ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Sparkles className="w-4 h-4 mr-2" />
        )}
        Run AI Queue
      </Button>
      
      <Button variant="outline" onClick={onExport}>
        <Download className="w-4 h-4 mr-2" />
        Export Data
      </Button>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" disabled={selectedCount === 0}>
            <CheckSquare className="w-4 h-4 mr-2" />
            Bulk Actions
            <span className="ml-2 text-xs text-muted-foreground">
              ({selectedCount} selected)
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={onBulkApprove}>
            <CheckSquare className="w-4 h-4 mr-2" />
            Approve Selected
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onBulkReject}>
            <X className="w-4 h-4 mr-2" />
            Reject Selected
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
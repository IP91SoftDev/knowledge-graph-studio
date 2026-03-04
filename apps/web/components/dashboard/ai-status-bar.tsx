'use client'

import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { Cpu, DollarSign, ChevronDown } from 'lucide-react'

interface AIStatusBarProps {
  queueCount: number
  queueTotal: number
  budgetUsed: number
  budgetTotal: number
  isExpanded?: boolean
  onToggle?: () => void
}

export function AIStatusBar({
  queueCount,
  queueTotal,
  budgetUsed,
  budgetTotal,
  isExpanded = false,
  onToggle
}: AIStatusBarProps) {
  const progress = (queueCount / queueTotal) * 100
  const budgetWarning = budgetUsed / budgetTotal > 0.8
  
  return (
    <div className="bg-surface border-b border-border px-6 py-3">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium">AI Processing</span>
        </div>
        <Progress 
          value={progress} 
          className="w-48 h-2"
          indicatorClassName="bg-gradient-to-r from-accent to-purple-500"
        />
        <span className="text-sm text-muted-foreground">
          {queueCount}/{queueTotal} resources
        </span>
        <div className="w-px h-4 bg-border" />
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4" />
          <span className={`text-sm ${budgetWarning ? 'text-warning' : 'text-muted-foreground'}`}>
            ${budgetUsed.toFixed(2)} / ${budgetTotal.toFixed(2)}
          </span>
        </div>
        {onToggle && (
          <Button variant="ghost" size="sm" className="ml-auto" onClick={onToggle}>
            <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </Button>
        )}
      </div>
    </div>
  )
}
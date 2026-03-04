'use client'

import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string | number
  trend?: string
  trendUp?: boolean
  icon?: React.ElementType
  className?: string
}

export function StatCard({
  title,
  value,
  trend,
  trendUp,
  icon: Icon,
  className,
}: StatCardProps) {
  return (
    <div className={cn(
      'bg-surface border border-border rounded-lg p-4 h-28 relative',
      'hover:shadow-md transition-shadow duration-200',
      className
    )}>
      {/* Title Row with Trend */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-muted font-medium">{title}</span>
        {trend && (
          <span className={cn(
            'text-xs flex items-center gap-1',
            trendUp ? 'text-success' : 'text-error'
          )}>
            {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {trend}
          </span>
        )}
      </div>
      
      {/* Value */}
      <div className="text-2xl font-bold text-foreground">{value}</div>
      
      {/* Optional Icon */}
      {Icon && (
        <Icon className="w-5 h-5 text-muted absolute top-4 right-4" />
      )}
    </div>
  )
}

import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number // 0-100
  showLabel?: boolean
  size?: 'sm' | 'md'
  className?: string
}

const getProgressColor = (value: number) => {
  if (value >= 80) return 'bg-success'
  if (value >= 50) return 'bg-warning'
  return 'bg-error'
}

export function ProgressBar({
  value,
  showLabel = false,
  size = 'sm',
  className,
}: ProgressBarProps) {
  const height = size === 'sm' ? 'h-2' : 'h-3'
  const color = getProgressColor(value)

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={cn('flex-1 bg-surface-hover rounded-full overflow-hidden', height)}>
        <div
          className={cn('h-full rounded-full transition-all duration-300', color)}
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-muted-foreground min-w-[3rem] text-right">
          {value}%
        </span>
      )}
    </div>
  )
}

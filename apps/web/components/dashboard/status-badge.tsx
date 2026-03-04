import { cn } from '@/lib/utils'
import { CheckCircle, Eye, Clock, XCircle } from 'lucide-react'

type StatusVariant = 'verified' | 'review' | 'queue' | 'rejected'

interface StatusBadgeProps {
  status: StatusVariant
  label?: string
  className?: string
}

const statusConfig: Record<StatusVariant, {
  label: string
  bgColor: string
  textColor: string
  borderColor: string
  icon: React.ElementType
}> = {
  verified: {
    label: 'Verified',
    bgColor: 'bg-success/10',
    textColor: 'text-success',
    borderColor: 'border-success/20',
    icon: CheckCircle,
  },
  review: {
    label: 'Review',
    bgColor: 'bg-warning/10',
    textColor: 'text-warning',
    borderColor: 'border-warning/20',
    icon: Eye,
  },
  queue: {
    label: 'AI Queue',
    bgColor: 'bg-accent/10',
    textColor: 'text-accent',
    borderColor: 'border-accent/20',
    icon: Clock,
  },
  rejected: {
    label: 'Rejected',
    bgColor: 'bg-error/10',
    textColor: 'text-error',
    borderColor: 'border-error/20',
    icon: XCircle,
  },
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  const config = statusConfig[status]
  const Icon = config.icon

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border',
        config.bgColor,
        config.textColor,
        config.borderColor,
        className
      )}
    >
      <Icon className="w-3.5 h-3.5" />
      {label || config.label}
    </span>
  )
}

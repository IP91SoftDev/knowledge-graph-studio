import { Badge } from './Badge';

export type ResourceStatus = 'pending' | 'processing' | 'review' | 'approved' | 'rejected' | 'archived';

interface StatusBadgeProps {
  status: ResourceStatus;
  className?: string;
}

const statusConfig: Record<ResourceStatus, { label: string; variant: 'default' | 'secondary' | 'warning' | 'success' | 'danger' }> = {
  pending: { label: 'Pending', variant: 'secondary' },
  processing: { label: 'Processing', variant: 'default' },
  review: { label: 'Needs Review', variant: 'warning' },
  approved: { label: 'Approved', variant: 'success' },
  rejected: { label: 'Rejected', variant: 'danger' },
  archived: { label: 'Archived', variant: 'secondary' },
};

export function StatusBadge({ status, className = '' }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className={className}>
      {config.label}
    </Badge>
  );
}

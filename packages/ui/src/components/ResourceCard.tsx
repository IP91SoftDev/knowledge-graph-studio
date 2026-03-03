import Link from 'next/link';
import { StatusBadge, type ResourceStatus } from './StatusBadge';
import { Badge } from './Badge';

export interface ResourceCardProps {
  id: string;
  title: string;
  url: string;
  category?: string | null;
  tags?: string[] | null;
  status: ResourceStatus;
  aiConfidence?: number | null;
  resourceType?: string | null;
}

export function ResourceCard({
  id,
  title,
  url,
  category,
  tags,
  status,
  aiConfidence,
  resourceType,
}: ResourceCardProps) {
  const host = new URL(url).hostname;

  return (
    <Link href={`/resource/${id}`}>
      <div className="group rounded-lg border border-gray-200 bg-white p-4 transition-all hover:border-indigo-300 hover:shadow-md">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-gray-900 truncate group-hover:text-indigo-600">
              {title}
            </h3>
            <p className="mt-1 text-xs text-gray-500 truncate">{host}</p>
          </div>
          <StatusBadge status={status} />
        </div>

        <div className="mt-3 flex flex-wrap gap-1">
          {category && (
            <Badge variant="default" className="text-xs">
              {category}
            </Badge>
          )}
          {resourceType && (
            <Badge variant="outline" className="text-xs">
              {resourceType}
            </Badge>
          )}
          {tags?.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {tags && tags.length > 3 && (
            <Badge variant="secondary" className="text-xs">
              +{tags.length - 3}
            </Badge>
          )}
        </div>

        {aiConfidence !== null && aiConfidence !== undefined && (
          <div className="mt-2 flex items-center gap-1">
            <div className="h-1.5 w-16 rounded-full bg-gray-200">
              <div
                className={`h-1.5 rounded-full ${
                  aiConfidence >= 0.7
                    ? 'bg-green-500'
                    : aiConfidence >= 0.5
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${aiConfidence * 100}%` }}
              />
            </div>
            <span className="text-xs text-gray-500">
              {(aiConfidence * 100).toFixed(0)}%
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

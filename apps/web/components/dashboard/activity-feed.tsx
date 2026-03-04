'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { formatDistance } from 'date-fns'

interface Activity {
  id: string
  type: 'ai_auto' | 'manual_approve' | 'manual_reject' | 'system' | 'alert'
  description: string
  timestamp: Date
}

interface ActivityFeedProps {
  activities: Activity[]
}

export function ActivityFeed({ activities }: ActivityFeedProps) {
  const getDotVariant = (type: Activity['type']) => {
    const variants = {
      ai_auto: 'bg-accent animate-pulse',
      manual_approve: 'bg-success',
      manual_reject: 'bg-destructive',
      system: 'bg-muted',
      alert: 'bg-warning',
    }
    return variants[type]
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-base">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex gap-3">
            <div className={`w-2 h-2 rounded-full mt-2 ${getDotVariant(activity.type)}`} />
            <div>
              <p className="text-sm">{activity.description}</p>
              <span className="text-xs text-muted-foreground">
                {formatDistance(activity.timestamp, new Date())} ago
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
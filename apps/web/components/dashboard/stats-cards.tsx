'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LineChart, Line, ResponsiveContainer } from 'recharts'

interface StatsCardsProps {
  verified: { count: number; trend: number; sparkline: number[] }
  needsReview: { count: number }
  aiQueue: { count: number; status: string }
  rejected: { count: number; trend: number }
}

export function StatsCards({ verified, needsReview, aiQueue, rejected }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* Verified */}
      <Card className="group hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Verified Resources
            </CardTitle>
            <Badge variant="success" className="animate-fade-in">
              +{verified.trend}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight">{verified.count}</div>
          <div className="mt-2 h-8 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={verified.sparkline.map((v, i) => ({ i, v }))}>
                <Line 
                  type="monotone" 
                  dataKey="v" 
                  stroke="var(--color-accent)" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Needs Review */}
      <Card className="group hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Needs Review
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight">{needsReview.count}</div>
        </CardContent>
      </Card>

      {/* AI Queue */}
      <Card className="group hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            AI Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight">{aiQueue.count}</div>
          <div className="text-xs text-muted-foreground mt-1">{aiQueue.status}</div>
        </CardContent>
      </Card>

      {/* Rejected */}
      <Card className="group hover:shadow-lg transition-shadow">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Rejected
            </CardTitle>
            <Badge variant="destructive">
              {rejected.trend}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold tracking-tight">{rejected.count}</div>
        </CardContent>
      </Card>
    </div>
  )
}
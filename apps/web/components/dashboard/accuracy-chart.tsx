'use client'

import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

interface AccuracyData {
  date: string
  accuracy: number
  target: number
}

interface AccuracyChartProps {
  data: AccuracyData[]
  currentAccuracy: number
  targetAccuracy: number
  avgConfidence: number
}

export function AccuracyChart({
  data,
  currentAccuracy,
  targetAccuracy,
  avgConfidence,
}: AccuracyChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Accuracy Metrics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Current Accuracy</p>
            <p className="text-2xl font-bold">{currentAccuracy}%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Target</p>
            <p className="text-2xl font-bold">{targetAccuracy}%</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Avg AI Confidence</p>
            <p className="text-2xl font-bold">{avgConfidence}%</p>
          </div>
        </div>
        <div className="h-[150px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(v) => v.slice(5)}
              />
              <YAxis domain={[80, 100]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="accuracy" 
                stroke="var(--color-accent)" 
                strokeWidth={2}
                dot={false}
              />
              <Line 
                type="monotone" 
                dataKey="target" 
                stroke="var(--color-success)" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
'use client'

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, CartesianGrid } from 'recharts'

interface AccuracyAreaChartProps {
  data: Array<{ date: string; accuracy: number }>
  targetAccuracy?: number
  className?: string
}

export function AccuracyAreaChart({
  data,
  targetAccuracy = 95,
  className,
}: AccuracyAreaChartProps) {
  return (
    <ResponsiveContainer width="100%" height={320}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
          </linearGradient>
        </defs>
        
        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
        
        <XAxis 
          dataKey="date" 
          tick={{ fill: '#a1a1aa', fontSize: 12 }}
          axisLine={{ stroke: '#27272a' }}
          tickLine={{ stroke: '#27272a' }}
        />
        
        <YAxis 
          domain={[80, 100]} 
          tick={{ fill: '#a1a1aa', fontSize: 12 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(value) => `${value}%`}
        />
        
        <Tooltip 
          contentStyle={{ 
            backgroundColor: '#18181b', 
            border: '1px solid #27272a',
            borderRadius: '8px',
            color: '#fafafa'
          }}
          formatter={(value) => [`${value}%`, 'Accuracy']}
          labelFormatter={(label) => `Date: ${label}`}
        />
        
        <Area 
          type="monotone" 
          dataKey="accuracy" 
          stroke="#3B82F6" 
          strokeWidth={2}
          fillOpacity={1} 
          fill="url(#colorAccuracy)" 
        />
        
        <ReferenceLine 
          y={targetAccuracy} 
          stroke="#999" 
          strokeDasharray="3 3" 
          label={{ value: `${targetAccuracy}% Target`, fill: '#999', fontSize: 11 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}

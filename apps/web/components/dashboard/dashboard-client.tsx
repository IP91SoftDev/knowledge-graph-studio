'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { pageLoadVariants } from '@/lib/animations'
import { Sidebar } from '@/components/layout/sidebar'
import { AIStatusBar } from './ai-status-bar'
import { StatCard } from './stat-card'
import { AccuracyAreaChart } from './accuracy-area-chart'
import { ResourceTable } from './resource-table'
import { ActivityFeed } from './activity-feed'
import { ActionBar } from './action-bar'
import { Database } from 'lucide-react'

interface Resource {
  id: string
  title: string
  status: 'verified' | 'review' | 'queue' | 'rejected'
  category: string
  aiConfidence: number
  lastModified: Date
  platform?: string
}

export function DashboardClient() {
  const [activeItem, setActiveItem] = useState('dashboard')

  // Mock data
  const mockStats = {
    total: { value: '19.5M', trend: '+12.3%', trendUp: true },
    verified: { value: '847', trend: '+4.2%', trendUp: true },
    queue: { value: '23', trend: '-2.1%', trendUp: false },
    errors: { value: '12', trend: '-0.8%', trendUp: false },
  }

  const mockChartData = [
    { date: 'Mon', accuracy: 87.2 },
    { date: 'Tue', accuracy: 89.5 },
    { date: 'Wed', accuracy: 91.3 },
    { date: 'Thu', accuracy: 88.7 },
    { date: 'Fri', accuracy: 93.1 },
    { date: 'Sat', accuracy: 94.8 },
    { date: 'Sun', accuracy: 96.2 },
  ]

  const mockResources: Resource[] = [
    {
      id: '1',
      title: 'API Documentation',
      status: 'verified',
      category: 'API',
      aiConfidence: 95,
      lastModified: new Date(Date.now() - 3600000 * 2),
      platform: 'Web',
    },
    {
      id: '2',
      title: 'Database Schema',
      status: 'review',
      category: 'DB',
      aiConfidence: 72,
      lastModified: new Date(Date.now() - 3600000 * 24),
      platform: 'Backend',
    },
    {
      id: '3',
      title: 'ML Model Config',
      status: 'queue',
      category: 'ML',
      aiConfidence: 45,
      lastModified: new Date(Date.now() - 3600000 * 48),
      platform: 'AI',
    },
    {
      id: '4',
      title: 'Auth Middleware',
      status: 'rejected',
      category: 'Security',
      aiConfidence: 28,
      lastModified: new Date(Date.now() - 3600000 * 72),
      platform: 'Backend',
    },
  ]

  const mockActivities = [
    { id: '1', type: 'ai_auto' as const, description: 'AI approved 47 resources', timestamp: new Date() },
    { id: '2', type: 'manual_reject' as const, description: 'Manual reject: 12 resources', timestamp: new Date(Date.now() - 3600000) },
    { id: '3', type: 'alert' as const, description: 'Budget alert: 80% reached', timestamp: new Date(Date.now() - 7200000) },
  ]

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar activeItem={activeItem} onNavigate={setActiveItem} />
      
      {/* Main Content */}
      <motion.div 
        className="flex-1"
        variants={pageLoadVariants}
        initial="hidden"
        animate="visible"
      >
        {/* AI Status Bar */}
        <AIStatusBar
          queueCount={847}
          queueTotal={1000}
          budgetUsed={3.42}
          budgetTotal={5.00}
        />
        
        {/* Main Content Area */}
        <main className="container mx-auto px-6 py-8">
          {/* Stat Cards Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard
              title="Total Resources"
              value={mockStats.total.value}
              trend={mockStats.total.trend}
              trendUp={mockStats.total.trendUp}
              icon={Database}
            />
            <StatCard
              title="Verified"
              value={mockStats.verified.value}
              trend={mockStats.verified.trend}
              trendUp={mockStats.verified.trendUp}
            />
            <StatCard
              title="In Queue"
              value={mockStats.queue.value}
              trend={mockStats.queue.trend}
              trendUp={mockStats.queue.trendUp}
            />
            <StatCard
              title="Errors"
              value={mockStats.errors.value}
              trend={mockStats.errors.trend}
              trendUp={mockStats.errors.trendUp}
            />
          </div>
          
          {/* Accuracy Chart */}
          <div className="mb-8">
            <AccuracyAreaChart data={mockChartData} targetAccuracy={95} />
          </div>
          
          {/* Resource Table + Activity Feed */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <ResourceTable
                data={mockResources}
                onAction={(action, id) => console.log(action, id)}
              />
            </div>
            <ActivityFeed activities={mockActivities} />
          </div>
        </main>
        
        {/* Action Bar (fixed bottom) */}
        <ActionBar
          selectedCount={0}
          onRunAI={() => console.log('Run AI Queue')}
          onExport={() => console.log('Export Data')}
          onBulkApprove={() => console.log('Bulk Approve')}
          onBulkReject={() => console.log('Bulk Reject')}
        />
      </motion.div>
    </div>
  )
}

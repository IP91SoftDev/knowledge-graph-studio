'use client'

import { motion } from 'framer-motion'
import { 
  pageLoadVariants, 
  headerVariants, 
  statusBarVariants,
  statsCardVariants,
  dataGridVariants,
  activityFeedVariants,
  accuracyChartVariants,
  actionBarVariants 
} from '@/lib/animations'
import { AIStatusBar } from './ai-status-bar'
import { StatsCards } from './stats-cards'
import { ResourceDatagrid } from './resource-datagrid'
import { ActivityFeed } from './activity-feed'
import { AccuracyChart } from './accuracy-chart'
import { ActionBar } from './action-bar'

export function DashboardClient() {
  // Mock data for now (will be replaced with real data from Supabase)
  const mockStats = {
    verified: { count: 523, trend: 12.3, sparkline: [45, 52, 48, 61, 55, 67, 72] },
    needsReview: { count: 234 },
    aiQueue: { count: 127, status: 'Processing' },
    rejected: { count: 89, trend: -2.1 }
  }

  const mockActivities = [
    { id: '1', type: 'ai_auto' as const, description: 'AI approved 47 resources', timestamp: new Date() },
    { id: '2', type: 'manual_reject' as const, description: 'Manual reject: 12 resources', timestamp: new Date(Date.now() - 3600000) },
    { id: '3', type: 'alert' as const, description: 'Budget alert: 80% reached', timestamp: new Date(Date.now() - 7200000) },
  ]

  const mockChartData = [
    { date: '2026-02-26', accuracy: 91.2, target: 95 },
    { date: '2026-02-27', accuracy: 92.5, target: 95 },
    { date: '2026-02-28', accuracy: 91.8, target: 95 },
    { date: '2026-03-01', accuracy: 93.1, target: 95 },
    { date: '2026-03-02', accuracy: 92.9, target: 95 },
    { date: '2026-03-03', accuracy: 94.2, target: 95 },
    { date: '2026-03-04', accuracy: 94.2, target: 95 },
  ]

  return (
    <motion.div 
      className="min-h-screen bg-background"
      variants={pageLoadVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.header 
        className="h-16 border-b border-border px-6 flex items-center justify-between sticky top-0 bg-background z-50"
        variants={headerVariants}
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🏛️</span>
            <span className="font-semibold text-lg">Knowledge Graph Studio</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-medium">
            U
          </div>
        </div>
      </motion.header>
      
      {/* AI Status Bar */}
      <motion.div variants={statusBarVariants}>
        <AIStatusBar
          queueCount={847}
          queueTotal={1000}
          budgetUsed={3.42}
          budgetTotal={5.00}
        />
      </motion.div>
      
      {/* Main content */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats Cards Row */}
        <motion.div 
          variants={statsCardVariants}
        >
          <StatsCards {...mockStats} />
        </motion.div>
        
        {/* Content Area */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
          variants={dataGridVariants}
        >
          <motion.div 
            className="lg:col-span-2"
            variants={dataGridVariants}
          >
            <ResourceDatagrid
              resources={[]}
              onBulkApprove={(ids) => console.log('Approve:', ids)}
              onBulkReject={(ids) => console.log('Reject:', ids)}
            />
          </motion.div>
          <motion.div variants={activityFeedVariants}>
            <ActivityFeed activities={mockActivities} />
          </motion.div>
        </motion.div>
        
        {/* Accuracy Metrics */}
        <motion.div variants={accuracyChartVariants}>
          <AccuracyChart
            data={mockChartData}
            currentAccuracy={94.2}
            targetAccuracy={95}
            avgConfidence={87.3}
          />
        </motion.div>
        
        {/* Spacer for action bar */}
        <div className="h-20" />
      </main>
      
      {/* Action Bar (fixed bottom) */}
      <motion.div 
        className="fixed bottom-0 left-0 right-0"
        variants={actionBarVariants}
      >
        <ActionBar
          selectedCount={0}
          onRunAI={() => console.log('Run AI Queue')}
          onExport={() => console.log('Export Data')}
          onBulkApprove={() => console.log('Bulk Approve')}
          onBulkReject={() => console.log('Bulk Reject')}
        />
      </motion.div>
    </motion.div>
  )
}

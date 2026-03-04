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

export function DashboardClient() {
  return (
    <motion.div 
      className="min-h-screen bg-background"
      variants={pageLoadVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.header 
        className="h-16 border-b border-border px-6 flex items-center justify-between"
        variants={headerVariants}
      >
        <div className="flex items-center gap-4">
          {/* Logo placeholder */}
          <div className="w-32 h-8 bg-surface rounded" />
          {/* Search placeholder */}
          <div className="w-64 h-8 bg-surface rounded" />
        </div>
        <div className="flex items-center gap-4">
          {/* AI Status, notifications, profile placeholders */}
          <div className="w-8 h-8 bg-surface rounded-full" />
          <div className="w-8 h-8 bg-surface rounded-full" />
        </div>
      </motion.header>
      
      {/* AI Status Bar */}
      <motion.div 
        className="h-12 border-b border-border px-6"
        variants={statusBarVariants}
      />
      
      {/* Main content */}
      <main className="container mx-auto px-6 py-8">
        {/* Stats Cards Row */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          variants={statsCardVariants}
        >
          {[1, 2, 3, 4].map((i) => (
            <motion.div key={i} variants={statsCardVariants}>
              <div className="h-32 bg-surface rounded-lg border border-border" />
            </motion.div>
          ))}
        </motion.div>
        
        {/* Content Area */}
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8"
          variants={dataGridVariants}
        >
          <motion.div 
            className="lg:col-span-2 min-h-[400px] bg-surface rounded-lg border border-border"
            variants={dataGridVariants}
          />
          <motion.div 
            className="min-h-[400px] bg-surface rounded-lg border border-border"
            variants={activityFeedVariants}
          />
        </motion.div>
        
        {/* Accuracy Metrics */}
        <motion.div 
          className="h-[200px] bg-surface rounded-lg border border-border mb-8"
          variants={accuracyChartVariants}
        />
        
        {/* Action Bar */}
        <motion.div 
          className="h-14 border-t border-border px-6 flex items-center gap-3"
          variants={actionBarVariants}
        />
      </main>
    </motion.div>
  )
}

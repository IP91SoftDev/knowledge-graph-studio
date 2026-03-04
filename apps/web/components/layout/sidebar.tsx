'use client'

import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Folder,
  Clock,
  Eye,
  BarChart3,
  Settings,
  HelpCircle,
  Menu,
  X,
} from 'lucide-react'
import { useState } from 'react'

interface SidebarItem {
  id: string
  label: string
  icon: React.ElementType
  badge?: number
  divider?: boolean
}

const sidebarItems: SidebarItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'resources', label: 'Resources', icon: Folder },
  { id: 'ai-queue', label: 'AI Queue', icon: Clock, badge: 3 },
  { id: 'review', label: 'Review', icon: Eye, badge: 7 },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'divider-1', label: '', divider: true },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'help', label: 'Help', icon: HelpCircle },
]

interface SidebarProps {
  activeItem: string
  onNavigate: (item: string) => void
  className?: string
}

export function Sidebar({ activeItem, onNavigate, className }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-surface border border-border rounded-md"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'bg-background border-r border-border h-full flex flex-col transition-all duration-300 fixed lg:static z-50',
          isCollapsed ? 'w-16' : 'w-60',
          !isOpen && '-translate-x-full lg:translate-x-0',
          className
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center px-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-accent/10 flex items-center justify-center">
              <span className="text-accent font-bold text-sm">KGS</span>
            </div>
            {!isCollapsed && (
              <span className="font-semibold text-foreground">Knowledge Graph Studio</span>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          {sidebarItems.map((item) => {
            if (item.divider) {
              return <div key={item.id} className="border-t border-border my-2" />
            }

            const isActive = activeItem === item.id
            const Icon = item.icon

            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id)
                  setIsOpen(false)
                }}
                className={cn(
                  'w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors',
                  isActive
                    ? 'text-foreground bg-surface-hover border-r-2 border-accent'
                    : 'text-muted hover:text-foreground hover:bg-surface-hover/50'
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {!isCollapsed && (
                  <>
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <span className="bg-accent text-white text-xs px-1.5 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            )
          })}
        </nav>

        {/* Collapse Toggle (Desktop Only) */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex items-center justify-center w-full h-12 border-t border-border text-muted hover:text-foreground transition-colors"
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </aside>
    </>
  )
}

/**
 * AppShell Component
 * 
 * Sidebar-first layout wrapper for all pages.
 * NO top navigation bar - sidebar is the only navigation.
 * 
 * Based on Square UI patterns:
 * - Fixed left sidebar with brand at top
 * - User profile in sidebar footer
 * - Content area with consistent padding
 */

'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

interface Breadcrumb {
  label: string;
  href?: string;
}

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
}

interface User {
  id: string;
  email: string | null;
}

export default function AppShell({
  children,
  title,
  breadcrumbs,
  actions,
}: AppShellProps) {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const supabaseClient = createClient();

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (user) {
        setUser({ id: user.id, email: user.email ?? null });
      }
    };
    getUser();
  }, []);

  // Navigation items for sidebar
  const navItems = [
    { href: '/', label: 'Dashboard', icon: '📊' },
    { href: '/browse', label: 'Browse', icon: '📚' },
    { href: '/search', label: 'Search', icon: '🔍' },
    { href: '/ingest', label: 'Ingest', icon: '📥' },
    { href: '/analytics', label: 'Analytics', icon: '📈' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar - Fixed left (Square UI Style with Icon Rail Mode) */}
      <aside className={`fixed left-0 top-0 h-full border-r border-border/50 bg-card transition-all duration-200 dark:border-white/10 dark:bg-white/[0.02] ${sidebarOpen ? 'w-64' : 'w-16'}`}>
        {/* SidebarHeader - Brand + Hamburger Toggle */}
        <div className="flex h-16 items-center justify-between border-b border-border/50 px-3 dark:border-white/10">
          {/* Logo - Only show when expanded */}
          <div className={`flex items-center gap-2.5 overflow-hidden transition-all duration-200 ${sidebarOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
            <span className="text-2xl" aria-hidden="true">🏛️</span>
            <span className="text-base font-semibold text-foreground tracking-tight whitespace-nowrap">KGS</span>
          </div>
          {/* Hamburger Toggle - Always visible */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors duration-120"
            aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
            aria-expanded={sidebarOpen}
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-0.5 p-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-md px-2.5 py-2 text-sm font-medium transition-all duration-120 ${
                  isActive
                    ? 'bg-primary/10 text-primary dark:bg-primary/20'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                } ${sidebarOpen ? 'justify-start' : 'justify-center'}`}
                title={!sidebarOpen ? item.label : undefined}
              >
                <span className="text-base flex-shrink-0" aria-hidden="true">{item.icon}</span>
                <span className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${sidebarOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer - Profile + Theme Toggle */}
        <div className="absolute bottom-0 w-full border-t border-border/50 p-2 dark:border-white/10">
          <div className={`flex items-center gap-2 ${sidebarOpen ? 'justify-between' : 'justify-center'}`}>
            {user && (
              <Link
                href="/me"
                className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-120 ${sidebarOpen ? 'flex-1' : ''}`}
                title={!sidebarOpen ? 'Profile' : undefined}
              >
                <span className="text-base flex-shrink-0" aria-hidden="true">👤</span>
                <span className={`overflow-hidden whitespace-nowrap transition-all duration-200 ${sidebarOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
                  {user.email?.split('@')[0]}
                </span>
              </Link>
            )}
            <div className={`${sidebarOpen ? '' : ''}`}>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={`transition-all duration-200 ${sidebarOpen ? 'ml-64' : 'ml-16'}`}>
        {/* Page Header */}
        {title && (
          <div className="border-b border-border/50 bg-card dark:border-white/10 dark:bg-white/[0.02]">
            <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6 lg:px-8">
              <div>
                {breadcrumbs && breadcrumbs.length > 0 && (
                  <nav className="mb-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                    {breadcrumbs.map((crumb, index) => (
                      <span key={index} className="flex items-center gap-1.5">
                        {crumb.href ? (
                          <Link
                            href={crumb.href}
                            className="hover:text-foreground transition-colors"
                          >
                            {crumb.label}
                          </Link>
                        ) : (
                          <span className="font-medium text-foreground">{crumb.label}</span>
                        )}
                        {index < breadcrumbs.length - 1 && (
                          <span className="text-muted-foreground">/</span>
                        )}
                      </span>
                    ))}
                  </nav>
                )}
                <h1 className="text-xl font-semibold text-foreground tracking-tight">{title}</h1>
              </div>
              {actions && <div className="flex items-center gap-2">{actions}</div>}
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui';
import { Button } from '@repo/ui';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface DashboardProps {
  totalResources: number;
  byStatus: {
    pending: number;
    review: number;
    approved: number;
  };
  recentActivity: Array<{
    id: string;
    title: string;
    status: string;
    updated_at: string;
  }>;
  aiBudget: {
    spent: number;
    limit: number;
    remaining: number;
  };
  pendingReview: number;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: string;
  trendUp?: boolean;
}

function StatCard({ title, value, icon, trend, trendUp }: StatCardProps) {
  return (
    <Card className="border border-border/50 bg-card shadow-sm transition-all duration-120 hover:border-border hover:shadow-md dark:border-white/10 dark:bg-white/[0.02] dark:hover:border-white/20">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <span className="text-xl" aria-hidden="true">{icon}</span>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold tracking-tight text-foreground">{value}</div>
        {trend && (
          <div className="flex items-center gap-1 mt-1.5">
            {trendUp !== undefined && (
              <svg
                className={`h-3.5 w-3.5 ${trendUp ? 'text-emerald-500' : 'text-red-500'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={trendUp ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"}
                />
              </svg>
            )}
            <span className={`text-xs font-medium ${trendUp ? 'text-emerald-500' : 'text-red-500'}`}>
              {trend}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function getStatusBadgeVariant(status: string): 'default' | 'secondary' | 'outline' | 'success' | 'warning' {
  switch (status.toLowerCase()) {
    case 'approved':
      return 'success';
    case 'pending':
      return 'warning';
    case 'review':
      return 'outline';
    default:
      return 'default';
  }
}

export default function Dashboard({
  totalResources,
  byStatus,
  recentActivity,
  aiBudget,
  pendingReview,
}: DashboardProps) {
  const budgetPercentage = Math.round((aiBudget.spent / aiBudget.limit) * 100);
  const isBudgetWarning = budgetPercentage > 80;

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Stats Grid - 4-up (Square UI inspired) */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Resources"
            value={totalResources.toLocaleString()}
            icon="📚"
            trend="12% from last month"
            trendUp={true}
          />
          <StatCard
            title="Pending Review"
            value={pendingReview.toLocaleString()}
            icon="⏳"
            trend={pendingReview > 0 ? `${pendingReview} awaiting` : 'All caught up'}
            trendUp={pendingReview === 0}
          />
          <StatCard
            title="Approved"
            value={byStatus.approved.toLocaleString()}
            icon="✅"
            trend={`${Math.round((byStatus.approved / Math.max(totalResources, 1)) * 100)}% approval rate`}
            trendUp={true}
          />
          <StatCard
            title="AI Budget (Today)"
            value={`$${aiBudget.spent.toFixed(2)}`}
            icon="💰"
            trend={`of $${aiBudget.limit.toFixed(2)}`}
            trendUp={!isBudgetWarning}
          />
        </div>

        {/* Quick Actions */}
        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Quick Actions</h2>
          </div>
          <div className="mt-3 flex flex-wrap gap-2.5">
            <Link href="/ingest?tab=csv">
              <Button className="gap-1.5 text-sm">
                <span aria-hidden="true">📥</span>
                Upload CSV
              </Button>
            </Link>
            <Link href="/ingest?tab=json">
              <Button variant="outline" className="gap-1.5 text-sm">
                <span aria-hidden="true">📄</span>
                Upload JSON
              </Button>
            </Link>
            {pendingReview > 0 && (
              <Link href={`/browse?status=review`}>
                <Button variant="secondary" className="gap-1.5 text-sm">
                  <span aria-hidden="true">🔍</span>
                  Review ({pendingReview})
                </Button>
              </Link>
            )}
            <Link href="/search">
              <Button variant="ghost" className="gap-1.5 text-sm">
                <span aria-hidden="true">🔎</span>
                Search
              </Button>
            </Link>
          </div>
        </section>

        {/* Recent Activity Table - Dense (Square UI inspired) */}
        <section className="mt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-foreground">Recent Activity</h2>
            <Link href="/browse">
              <Button variant="ghost" size="sm" className="text-xs">
                View All
              </Button>
            </Link>
          </div>
          <Card className="mt-3 border-border/50 bg-card shadow-sm dark:border-white/10 dark:bg-white/[0.02]">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 dark:border-white/10">
                  <TableHead className="h-10 text-xs font-medium text-muted-foreground uppercase tracking-wider w-[60%]">Resource</TableHead>
                  <TableHead className="h-10 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</TableHead>
                  <TableHead className="h-10 text-xs font-medium text-muted-foreground uppercase tracking-wider text-right">Updated</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentActivity.length === 0 ? (
                  <TableRow className="border-border/50 dark:border-white/10">
                    <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                      No recent activity
                    </TableCell>
                  </TableRow>
                ) : (
                  recentActivity.slice(0, 5).map((item) => (
                    <TableRow
                      key={item.id}
                      className="border-border/50 transition-colors hover:bg-muted/30 dark:border-white/10 dark:hover:bg-white/[0.02]"
                    >
                      <TableCell className="h-12 font-medium">
                        <Link
                          href={`/resource/${item.id}`}
                          className="hover:text-primary transition-colors line-clamp-1"
                        >
                          {item.title}
                        </Link>
                      </TableCell>
                      <TableCell className="h-12">
                        <Badge variant={getStatusBadgeVariant(item.status)} className="text-xs">
                          {item.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="h-12 text-right text-xs text-muted-foreground">
                        {new Date(item.updated_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </Card>
        </section>
      </main>
    </div>
  );
}

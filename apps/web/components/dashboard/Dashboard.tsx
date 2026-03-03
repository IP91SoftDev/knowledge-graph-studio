'use client';

import Link from 'next/link';
import { Card, CardHeader, CardTitle, CardContent } from '@repo/ui';
import { Button } from '@repo/ui';

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

export default function Dashboard({
  totalResources,
  byStatus,
  recentActivity,
  aiBudget,
  pendingReview,
}: DashboardProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <h1 className="text-xl font-bold text-gray-900">Knowledge Graph Studio</h1>
          <nav className="flex items-center gap-4">
            <Link href="/browse" className="text-sm text-gray-600 hover:text-gray-900">
              Browse
            </Link>
            <Link href="/search" className="text-sm text-gray-600 hover:text-gray-900">
              Search
            </Link>
            <Link href="/ingest" className="text-sm text-gray-600 hover:text-gray-900">
              Ingest
            </Link>
            <Link href="/analytics" className="text-sm text-gray-600 hover:text-gray-900">
              Analytics
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-4 py-8">
        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Resources
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalResources}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Pending Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{pendingReview}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                Approved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{byStatus.approved}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">
                AI Budget (Today)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ${aiBudget.spent.toFixed(2)}
                <span className="text-sm font-normal text-gray-500">
                  /${aiBudget.limit.toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
          <div className="mt-4 flex gap-4">
            <Link href="/ingest?tab=csv">
              <Button>Upload CSV</Button>
            </Link>
            <Link href="/ingest?tab=json">
              <Button variant="secondary">Upload JSON</Button>
            </Link>
            {pendingReview > 0 && (
              <Link href={`/browse?status=review`}>
                <Button variant="outline">Review Pending ({pendingReview})</Button>
              </Link>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <Card className="mt-4">
            <CardContent className="pt-6">
              {recentActivity.length === 0 ? (
                <p className="text-sm text-gray-500">No recent activity</p>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {recentActivity.map((item) => (
                    <li key={item.id} className="py-3">
                      <Link
                        href={`/resource/${item.id}`}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm font-medium text-gray-900 truncate max-w-md">
                          {item.title}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(item.updated_at).toLocaleDateString()}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

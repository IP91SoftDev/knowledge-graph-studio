import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { DashboardClient } from '@/components/dashboard/dashboard-client';
import AppShell from '@/components/layout/AppShell';

export default async function HomePage() {
  const supabase = await createClient();

  // Check auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Unauthenticated - show landing page (no AppShell)
  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="max-w-3xl text-center">
          <h1 className="mb-6 text-5xl font-bold text-gray-900">
            🏛️ Knowledge Graph Studio
          </h1>
          <p className="mb-8 text-xl text-gray-600">
            Internal knowledge base management with AI-powered categorization
          </p>
          <div className="mb-8 flex justify-center space-x-4">
            <Link
              href="/auth/login"
              className="rounded-md bg-indigo-600 px-6 py-3 text-lg font-medium text-white hover:bg-indigo-700"
            >
              Sign In
            </Link>
            <Link
              href="/auth/register"
              className="rounded-md border border-gray-300 bg-white px-6 py-3 text-lg font-medium text-gray-700 hover:bg-gray-50"
            >
              Register
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="text-3xl">📚</div>
              <h3 className="mt-2 font-semibold text-gray-900">Organize</h3>
              <p className="text-sm text-gray-600">Categorize 1000+ resources</p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="text-3xl">🤖</div>
              <h3 className="mt-2 font-semibold text-gray-900">AI-Powered</h3>
              <p className="text-sm text-gray-600">Auto-categorization</p>
            </div>
            <div className="rounded-lg bg-white p-6 shadow">
              <div className="text-3xl">📊</div>
              <h3 className="mt-2 font-semibold text-gray-900">Track</h3>
              <p className="text-sm text-gray-600">Monitor AI costs & usage</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated - show dashboard
  try {
    // Fetch dashboard data (may fail if tables don't exist yet)
    const [{ count: totalResources }, { count: pendingCount }, { count: reviewCount }, { count: approvedCount }] =
      await Promise.all([
        supabase.from('resources').select('*', { count: 'exact', head: true }),
        supabase.from('resources').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('resources').select('*', { count: 'exact', head: true }).eq('status', 'review'),
        supabase.from('resources').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
      ]);

    const { data: recentActivity } = await supabase
      .from('resources')
      .select('id, title, status, updated_at')
      .order('updated_at', { ascending: false })
      .limit(10);

    // Get AI cost today
    const { data: costData } = await supabase
      .from('ai_logs')
      .select('cost_usd')
      .eq('success', true)
      .gte('created_at', new Date().toISOString().split('T')[0] + 'T00:00:00Z');

    const aiBudget = {
      spent: costData?.reduce((sum, log) => sum + (log.cost_usd ?? 0), 0) ?? 0,
      limit: 5.0,
      remaining: 5.0 - (costData?.reduce((sum, log) => sum + (log.cost_usd ?? 0), 0) ?? 0),
    };

    return <DashboardClient />;
  } catch (error) {
    // Database not set up yet - show welcome message
    return (
      <AppShell title="Dashboard" breadcrumbs={[{ label: 'Home' }]}>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="max-w-2xl text-center">
            <h1 className="mb-4 text-3xl font-bold text-gray-900">
              Welcome, {user.email?.split('@')[0]}!
            </h1>
            <p className="mb-6 text-gray-600">
              Your dashboard will appear here once the database is configured.
            </p>
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-3 text-lg font-semibold text-gray-900">Next Steps:</h2>
              <ol className="space-y-2 text-left text-gray-600">
                <li>1. Apply database migrations (see SETUP.md)</li>
                <li>2. Run <code className="rounded bg-gray-100 px-2 py-1">pnpm db:seed</code></li>
                <li>3. Refresh this page</li>
              </ol>
            </div>
            <div className="mt-6">
              <Link
                href="/me"
                className="inline-block rounded-md bg-indigo-600 px-6 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                View Profile
              </Link>
            </div>
          </div>
        </div>
      </AppShell>
    );
  }
}

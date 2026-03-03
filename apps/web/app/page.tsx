import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Dashboard from '@/components/dashboard/Dashboard';

export default async function HomePage() {
  const supabase = await createClient();

  // Check auth
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  // Fetch dashboard data
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

  // Get AI cost today (simple query, view may not exist yet)
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

  return (
    <Dashboard
      totalResources={totalResources ?? 0}
      byStatus={{
        pending: pendingCount ?? 0,
        review: reviewCount ?? 0,
        approved: approvedCount ?? 0,
      }}
      recentActivity={recentActivity ?? []}
      aiBudget={aiBudget}
      pendingReview={reviewCount ?? 0}
    />
  );
}

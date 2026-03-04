/**
 * Analytics Page - Placeholder
 * 
 * TODO: Implement analytics dashboard
 */

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import AppShell from '@/components/layout/AppShell';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function AnalyticsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <AppShell
      title="Analytics"
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Analytics' }]}
    >
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="w-full max-w-md space-y-6 px-4 text-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold text-foreground">🔜 Coming Soon</h1>
            <p className="text-lg text-muted-foreground">
              Analytics dashboard is under development
            </p>
          </div>
          <Card className="border-border/50 bg-card text-left dark:border-white/10 dark:bg-white/[0.02]">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-semibold text-foreground">What&apos;s planned:</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-primary">•</span>
                  <span>Resource count and growth trends</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-primary">•</span>
                  <span>Category distribution charts</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-primary">•</span>
                  <span>AI processing statistics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-primary">•</span>
                  <span>User activity metrics</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-primary">•</span>
                  <span>Export reports</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          <Link href="/">
            <Button variant="outline" className="gap-2">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </AppShell>
  );
}

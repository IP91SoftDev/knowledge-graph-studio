/**
 * User Profile Page
 * 
 * Shows current user info and allows logout.
 * Protected route - redirects to login if not authenticated.
 */

import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import AppShell from '@/components/layout/AppShell';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default async function MePage() {
  const supabase = await createClient();

  // Get current user
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error || !user) {
    // Not authenticated - redirect to login
    redirect('/auth/login');
  }

  // Get user metadata to check for admin role
  const isAdmin = user.user_metadata?.is_admin || user.user_metadata?.role === 'admin';

  return (
    <AppShell
      title="Your Profile"
      breadcrumbs={[{ label: 'Home', href: '/' }, { label: 'Profile' }]}
    >
      <div className="flex min-h-[60vh] items-center justify-center py-6">
        <div className="w-full max-w-md space-y-6 px-4">
          <Card className="border-border/50 bg-card dark:border-white/10 dark:bg-white/[0.02]">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl font-semibold text-center text-foreground">Your Profile</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-md bg-muted/50 p-4 dark:bg-white/[0.02]">
                <div className="mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</div>
                <div className="text-base font-medium text-foreground">{user.email}</div>
              </div>

              <div className="rounded-md bg-muted/50 p-4 dark:bg-white/[0.02]">
                <div className="mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">User ID</div>
                <div className="text-xs font-mono text-foreground break-all">{user.id}</div>
              </div>

              {isAdmin && (
                <div className="rounded-md bg-primary/10 p-4 dark:bg-primary/20">
                  <div className="mb-1 text-xs font-medium text-primary uppercase tracking-wider">Role</div>
                  <div className="text-base font-semibold text-primary">🏛️ Administrator</div>
                </div>
              )}

              <div className="rounded-md bg-muted/50 p-4 dark:bg-white/[0.02]">
                <div className="mb-1 text-xs font-medium text-muted-foreground uppercase tracking-wider">Email Confirmed</div>
                <div className={`text-base font-medium ${user.email_confirmed_at ? 'text-emerald-600 dark:text-emerald-500' : 'text-amber-600 dark:text-amber-500'}`}>
                  {user.email_confirmed_at ? '✅ Yes' : '⏳ Pending'}
                </div>
              </div>

              <form
                action={async () => {
                  'use server';
                  const supabase = await createClient();
                  await supabase.auth.signOut();
                  redirect('/auth/login');
                }}
              >
                <button
                  type="submit"
                  className="inline-flex h-10 w-full items-center justify-center rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Sign Out
                </button>
              </form>
            </CardContent>
          </Card>

          <div className="text-center">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

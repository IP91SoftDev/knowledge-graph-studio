/**
 * User Profile Page
 * 
 * Shows current user info and allows logout.
 * Protected route - redirects to login if not authenticated.
 */

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

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
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">
          Your Profile
        </h1>

        <div className="space-y-4">
          <div className="rounded-md bg-gray-50 p-4">
            <div className="mb-2 text-sm font-medium text-gray-500">Email</div>
            <div className="text-lg text-gray-900">{user.email}</div>
          </div>

          <div className="rounded-md bg-gray-50 p-4">
            <div className="mb-2 text-sm font-medium text-gray-500">User ID</div>
            <div className="text-sm text-gray-900 font-mono">{user.id}</div>
          </div>

          {isAdmin && (
            <div className="rounded-md bg-indigo-50 p-4">
              <div className="mb-2 text-sm font-medium text-indigo-600">Role</div>
              <div className="text-lg font-semibold text-indigo-900">🏛️ Administrator</div>
            </div>
          )}

          <div className="rounded-md bg-gray-50 p-4">
            <div className="mb-2 text-sm font-medium text-gray-500">Email Confirmed</div>
            <div className={`text-lg ${user.email_confirmed_at ? 'text-green-600' : 'text-yellow-600'}`}>
              {user.email_confirmed_at ? '✅ Yes' : '⏳ Pending'}
            </div>
          </div>

          <div className="mt-6">
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
                className="w-full rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          <a
            href="/"
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
}

/**
 * Database Package
 * 
 * Supabase client and types for Knowledge Graph Studio
 */

import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Types will be generated from Supabase schema
// Run: pnpm db:generate
export type * from './types';

/**
 * Create browser client
 * Note: For Next.js apps, use apps/web/lib/supabase/client.ts instead
 */
export function createClient(
  supabaseUrl?: string,
  supabaseKey?: string
) {
  const url = supabaseUrl ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = supabaseKey ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error('Missing Supabase URL or key');
  }

  return createSupabaseClient(url, key);
}

/**
 * Create admin client with service role key
 * Use only in server-side code
 */
export function createServerClient(
  supabaseUrl?: string,
  supabaseKey?: string
) {
  const url = supabaseUrl ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = supabaseKey ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('Missing Supabase service role key');
  }

  return createSupabaseClient(url, key);
}

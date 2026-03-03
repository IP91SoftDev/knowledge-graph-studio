# Supabase Cloud Mode Setup Guide

**Last Updated:** 2026-03-03  
**Mode:** Cloud (SQL Bundle) — No Supabase CLI project required

---

## Overview

This project uses **Supabase Cloud mode** for database migrations. Instead of running the Supabase CLI locally, you apply migrations directly via the Supabase Dashboard SQL Editor.

**Why Cloud Mode?**
- ✅ No local Supabase CLI project state to manage
- ✅ Works on any machine with just a browser
- ✅ Migrations are versioned SQL files in `supabase/migrations/`
- ✅ Easy to review and audit changes before applying
- ✅ Recommended for initial deployment

---

## Prerequisites

1. **Supabase Project** — Create at https://supabase.com
2. **Environment Variables** — Set in `.env.local`:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key  # For admin operations
   ```

---

## Step 1: Apply Migrations

### Option A: Via Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy and paste the contents of:
   - `supabase/migrations/0001_initial_schema.sql`
   - `supabase/migrations/0002_seed_data.sql`
5. Click **Run** to execute each migration in order

### Option B: Via CLI (If you have Supabase CLI installed)

```bash
# Link to your Supabase project
supabase link --project-ref your-project-ref

# Apply migrations
supabase db push
```

---

## Step 2: Verify Database

After applying migrations, verify the tables exist:

```sql
-- Check tables
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Expected tables:
-- resources, categories, resource_categories, users, admin_logs
```

---

## Step 3: Create Admin User

Run the bootstrap script:

```bash
pnpm bootstrap:admin
```

This will:
- Prompt for admin email and password
- Create user via Supabase Admin API
- Set admin role in user metadata
- Output confirmation

**Alternative (Manual):**
1. Go to Supabase Dashboard → Authentication → Users
2. Click **Add User**
3. Enter email and password
4. Check **Confirm email** (bypasses email verification)
5. Add user metadata: `{"role": "admin", "is_admin": true}`

---

## Step 4: Enable Email Auth (if using magic links)

1. Go to Supabase Dashboard → Authentication → Providers
2. Ensure **Email** is enabled
3. Configure email templates (optional):
   - Go to Authentication → Email Templates
   - Customize "Magic Link" and "Confirm Signup" templates

---

## Step 5: Configure Row Level Security (RLS)

The migrations include RLS policies. Verify they're active:

```sql
-- Check RLS is enabled on tables
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND rowsecurity = true;
```

---

## Step 6: Test Authentication

1. Start the dev server: `pnpm dev`
2. Navigate to `/auth/register` — create a test account
3. Navigate to `/auth/login` — sign in
4. Navigate to `/me` — verify profile page loads
5. For admin: use the bootstrapped admin credentials

---

## Troubleshooting

### "Failed to fetch" on login

**Cause:** Missing or incorrect environment variables.

**Fix:**
```bash
# Verify .env.local exists and has correct values
cat .env.local

# Ensure variables are exported in your shell if needed
export NEXT_PUBLIC_SUPABASE_URL=...
export NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

### "User already registered"

**Cause:** Email auth requires unique emails.

**Fix:** Use a different email or delete the existing user in Supabase Dashboard.

### Migrations fail to apply

**Cause:** SQL syntax error or constraint violation.

**Fix:**
1. Check the SQL file for syntax errors
2. Ensure you're running migrations in order (0001 before 0002)
3. Check Supabase logs in Dashboard → Logs

---

## Migration Checklist

- [ ] Supabase project created
- [ ] Environment variables set in `.env.local`
- [ ] `0001_initial_schema.sql` applied
- [ ] `0002_seed_data.sql` applied
- [ ] Tables verified in SQL Editor
- [ ] Admin user created
- [ ] Email auth enabled (if using magic links)
- [ ] RLS policies verified
- [ ] Test registration completed
- [ ] Test login completed
- [ ] Admin access verified at `/me`

---

## Switching to CLI Mode (Optional)

If you later want to use Supabase CLI for local development:

```bash
# Initialize Supabase CLI project
supabase init

# This creates supabase/config.toml

# Link to your project
supabase link --project-ref your-project-ref

# Pull existing schema
supabase db pull

# Future migrations can be managed via CLI
supabase db diff --use-migra --create migration_name
supabase db push
```

**Note:** If you switch to CLI mode, update `package.json` script `db:migrate` to use `supabase db push` and remove the cloud mode reference.

---

## Support

- Supabase Docs: https://supabase.com/docs
- Project Issues: Check GitHub issues for this repo
- Internal Docs: See `SETUP.md` for full project setup

---

**[AURELIUS] System Note:** This document is part of the Repo State Reconciliation Patch. Keep it updated when migration processes change.

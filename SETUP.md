# Setup Guide - Knowledge Graph Studio

## Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.0.0
- Supabase account + project
- (Optional) AI provider keys (OpenAI, Anthropic, etc.)

---

## Quick Start (5 minutes)

### Step 1: Install Dependencies

```bash
cd knowledge-graph-studio
pnpm install
```

### Step 2: Configure Environment

```bash
# Copy root env template
cp .env.example .env.local

# Edit with your values
nano .env.local

# Sync to apps/web
pnpm env:sync

# Verify environment
pnpm env:check
```

**Required env vars:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=https://your-domain.com  # Optional for dev, required for prod
```

### Step 3: Configure Supabase Auth (CRITICAL)

**Go to Supabase Dashboard → Authentication → URL Configuration:**

1. **Site URL:** Must exactly match `NEXT_PUBLIC_SITE_URL`
   ```
   https://your-domain.com  # (or http://localhost:3000 for dev)
   ```

2. **Redirect URLs:** Must include your domain pattern
   ```
   http://localhost:3000/**
   https://your-domain.com/**
   ```

3. **Email Auth:** Enable "Enable Email signup"

4. **Magic Link:** Ensure "Enable Magic Link" is checked

**Auth Redirect Config Verified:**
- [ ] Site URL matches `NEXT_PUBLIC_SITE_URL` in .env.local
- [ ] Redirect URLs include `${NEXT_PUBLIC_SITE_URL}/**`
- [ ] Magic Link authentication is enabled
- [ ] Test: Request magic link → verify redirect works

### Step 4: Run Database Migrations

**Option A: Supabase CLI (Recommended)**
```bash
# Install if needed
npm i -g supabase

# Login and link
supabase login
supabase link --project-ref your-project-ref

# Run migrations
pnpm db:migrate
```

**Option B: Manual SQL**
1. Go to Supabase Dashboard > SQL Editor
2. Copy `infra/supabase/migrations/0001_initial_schema.sql`
3. Paste and run

### Step 5: Seed Initial Data

```bash
pnpm db:seed
```

Or manually run `infra/supabase/migrations/0002_seed_data.sql` in SQL Editor.

### Step 6: Create Admin User

**Via Dashboard:**
1. Go to Authentication > Users
2. Click "Add User"
3. Enter your email
4. Use magic link login

**Via CLI:**
```bash
supabase auth signup --email your@email.com
```

### Step 7: Check System Limits (VPS only)

```bash
# Check file descriptor limit
pnpm ops:check

# If fails, follow fix instructions or see docs/ops/vps.md
```

### Step 8: Verify Scaffold

```bash
# Run full verification
pnpm verify
```

**Expected output:**
```
🔍 Checking file descriptor limits...
   Current soft limit: 65535
   Minimum required:   8192
   Recommended:        65535
✅ PASS: File descriptor limit is sufficient

✅ Environment validation passed
   Checked: 3 required keys
   All keys present (values not shown)

> web@0.1.0 lint /apps/web
> next lint

✓ No ESLint warnings or errors

> web@0.1.0 typecheck /apps/web
> tsc --noEmit

✓ TypeScript compilation successful

> web@0.1.0 build /apps/web
> next build

✓ Compiled successfully
```

### Step 9: Smoke Test

```bash
pnpm smoke
```

**Expected output:**
```
🔍 Starting smoke test...

📦 Step 1: Building Next.js app...
✓ Compiled successfully
✅ Build successful

🚀 Step 2: Starting production server...
✅ Server started

🌐 Step 3: Testing endpoint http://127.0.0.1:3000/auth/login...
✅ Endpoint returned HTTP 200 (12345 bytes)

✅ Smoke test PASSED
```

### Step 10: Start Development Server

```bash
pnpm dev
```

Open http://localhost:3000

---

## Verification Checklist

Before declaring setup complete:

- [ ] `pnpm ops:check` passes (ulimit >= 8192)
- [ ] `pnpm env:check` passes
- [ ] Supabase Auth URL Configuration verified (see Step 3)
- [ ] `pnpm verify` passes (ops:check + env:check + lint + typecheck + build)
- [ ] `pnpm smoke` returns HTTP 200
- [ ] Login page loads at /auth/login
- [ ] Can authenticate with magic link
- [ ] Dashboard shows seed data
- [ ] Browse page works

---

## Troubleshooting

### "Missing Supabase URL or key"

```bash
# Verify env file exists
ls -la .env.local apps/web/.env.local

# Re-sync environment
pnpm env:sync

# Verify keys present (values hidden)
pnpm env:check
```

### "Too many open files" (VPS only)

```bash
# Check current limit
ulimit -n

# If < 8192, run:
pnpm ops:check  # Shows fix instructions

# Temporary fix for current session
ulimit -n 65535

# Permanent fix: see docs/ops/vps.md
```

### "Cannot find module '@/lib/supabase/client'"

```bash
# Verify tsconfig has path alias
cat apps/web/tsconfig.json | grep -A 5 '"paths"'

# Should show:
# "@/*": ["./*"]

# Reinstall if needed
rm -rf node_modules apps/web/node_modules
pnpm install
```

### "Relation 'resources' does not exist"

```bash
# Run migrations
pnpm db:migrate

# Or check Supabase Dashboard > Table Editor
# Verify 'resources' table exists
```

### Build fails with TypeScript errors

```bash
# Run typecheck to see errors
pnpm -C apps/web typecheck

# Common fixes:
# - Missing types: pnpm db:generate
# - Import errors: check @/ path alias
```

### Magic link redirect fails

```bash
# Verify Supabase Auth URL Configuration:
# 1. Dashboard → Authentication → URL Configuration
# 2. Site URL matches NEXT_PUBLIC_SITE_URL
# 3. Redirect URLs include your domain pattern

# Check browser console for redirect errors
# Check Supabase logs (Dashboard → Logs)
```

### ESLint errors about unused variables

```bash
# Fix the unused variable or prefix with underscore
# Example: const _unused = value;

# Or add to eslint ignore pattern in .eslintrc.json
```

---

## VPS Deployment

See: [`docs/ops/vps.md`](./docs/ops/vps.md)

**Key steps:**
1. Run `pnpm ops:check` — must pass
2. Set ulimit -n 65535 (permanent fix via systemd)
3. Configure systemd service
4. Set up Caddy for HTTPS
5. Configure firewall (UFW)

---

## Next Steps After Setup

1. **Login** at http://localhost:3000/auth/login
2. **Dashboard** should show:
   - Total Resources: 8 (seed data)
   - Pending Review: 0
   - Approved: 8
3. **Browse** page at /browse should show seed resources
4. **Upload CSV** at /ingest

---

## Notes

**These failures are now caught by automated verification gates and cannot silently ship.**

All verification commands are idempotent and safe to re-run.

---

## Version Compatibility

| Component | Version | Notes |
|-----------|---------|-------|
| Node.js | >= 20.0.0 | LTS recommended (20.x, 22.x) |
| pnpm | >= 9.0.0 | Package manager |
| Turbo | 2.0.6 | Pinned (v2+ uses `tasks` not `pipeline`) |
| Next.js | 14.1.0 | Compatible with Node 20+ |
| ESLint | 8.57.0 | Compatible with Next.js 14 |
| TypeScript | >= 5.4.0 | Strict mode enabled |

**Note:** ESLint 9.x may have compatibility issues with Next.js 14. This project pins ESLint 8.x.

---

**Questions?** Check project docs in `/docs/` folder.

**Report issues** with scaffold failures immediately.

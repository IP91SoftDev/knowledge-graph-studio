#!/usr/bin/env node
/**
 * Verify Trigger Script
 * 
 * Validates that critical triggers and hooks are in place.
 * Used by CI/CD and pre-deployment checks.
 * 
 * Usage: pnpm verify-trigger
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');

console.log('[AURELIUS] START — Verify Trigger');

const checks = [];
let passed = 0;
let failed = 0;

// Check 1: Database migrations exist
const migrationsPath = path.join(PROJECT_ROOT, 'infra/supabase/migrations');
if (fs.existsSync(migrationsPath)) {
  const files = fs.readdirSync(migrationsPath).filter(f => f.endsWith('.sql'));
  if (files.length >= 2) {
    checks.push({ name: 'Database migrations', status: 'PASS', detail: `${files.length} SQL files found` });
    passed++;
  } else {
    checks.push({ name: 'Database migrations', status: 'FAIL', detail: `Only ${files.length} SQL files found (need 2+)` });
    failed++;
  }
} else {
  checks.push({ name: 'Database migrations', status: 'FAIL', detail: 'Migrations directory not found' });
  failed++;
}

// Check 2: Auth routes exist
const authLoginPath = path.join(PROJECT_ROOT, 'apps/web/app/auth/login/page.tsx');
const authRegisterPath = path.join(PROJECT_ROOT, 'apps/web/app/auth/register/page.tsx');
const mePath = path.join(PROJECT_ROOT, 'apps/web/app/me/page.tsx');

if (fs.existsSync(authLoginPath) && fs.existsSync(authRegisterPath) && fs.existsSync(mePath)) {
  checks.push({ name: 'Auth routes', status: 'PASS', detail: '/auth/login, /auth/register, /me exist' });
  passed++;
} else {
  const missing = [];
  if (!fs.existsSync(authLoginPath)) missing.push('/auth/login');
  if (!fs.existsSync(authRegisterPath)) missing.push('/auth/register');
  if (!fs.existsSync(mePath)) missing.push('/me');
  checks.push({ name: 'Auth routes', status: 'FAIL', detail: `Missing: ${missing.join(', ')}` });
  failed++;
}

// Check 3: Environment files
const envExamplePath = path.join(PROJECT_ROOT, '.env.example');
const envLocalPath = path.join(PROJECT_ROOT, '.env.local');

if (fs.existsSync(envExamplePath)) {
  checks.push({ name: '.env.example', status: 'PASS', detail: 'Template exists' });
  passed++;
} else {
  checks.push({ name: '.env.example', status: 'FAIL', detail: 'Template missing' });
  failed++;
}

if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  const requiredVars = ['NEXT_PUBLIC_SUPABASE_URL', 'NEXT_PUBLIC_SUPABASE_ANON_KEY'];
  const missing = requiredVars.filter(v => !envContent.includes(v));
  if (missing.length === 0) {
    checks.push({ name: '.env.local', status: 'PASS', detail: 'All required vars present' });
    passed++;
  } else {
    checks.push({ name: '.env.local', status: 'FAIL', detail: `Missing vars: ${missing.join(', ')}` });
    failed++;
  }
} else {
  checks.push({ name: '.env.local', status: 'FAIL', detail: 'File not found (copy from .env.example)' });
  failed++;
}

// Check 4: AI package exists
const aiPackagePath = path.join(PROJECT_ROOT, 'packages/ai/package.json');
if (fs.existsSync(aiPackagePath)) {
  checks.push({ name: 'AI package', status: 'PASS', detail: 'packages/ai configured' });
  passed++;
} else {
  checks.push({ name: 'AI package', status: 'FAIL', detail: 'packages/ai not found' });
  failed++;
}

// Check 5: Database package exists
const dbPackagePath = path.join(PROJECT_ROOT, 'packages/database/package.json');
if (fs.existsSync(dbPackagePath)) {
  checks.push({ name: 'Database package', status: 'PASS', detail: 'packages/database configured' });
  passed++;
} else {
  checks.push({ name: 'Database package', status: 'FAIL', detail: 'packages/database not found' });
  failed++;
}

// Output results
console.log('\n' + '='.repeat(60));
console.log('VERIFY TRIGGER RESULTS');
console.log('='.repeat(60));

checks.forEach((check, i) => {
  const icon = check.status === 'PASS' ? '✅' : '❌';
  console.log(`${icon} ${check.name.padEnd(25)} ${check.status.padEnd(6)} — ${check.detail}`);
});

console.log('='.repeat(60));
console.log(`Passed: ${passed}/${checks.length}`);
console.log(`Failed: ${failed}/${checks.length}`);

if (failed > 0) {
  console.log('\n⚠️  Trigger verification FAILED. Fix issues before proceeding.');
  console.log('[AURELIUS] DONE — Verify Trigger (FAILED)');
  process.exit(1);
} else {
  console.log('\n✅ All triggers verified. System ready.');
  console.log('[AURELIUS] DONE — Verify Trigger (PASSED)');
  process.exit(0);
}

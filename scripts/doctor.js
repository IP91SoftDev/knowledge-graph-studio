#!/usr/bin/env node
/**
 * Repo State Reconciliation Gate
 * 
 * Asserts that required files, scripts, and routes exist.
 * Fails with clear messages if anything is missing.
 * 
 * Usage: pnpm doctor
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');

// Required files
const REQUIRED_FILES = [
  'supabase/migrations/0001_initial_schema.sql',
  'supabase/migrations/0002_seed_data.sql',
  'apps/web/app/auth/login/page.tsx',
  'apps/web/app/auth/register/page.tsx',
  'apps/web/app/me/page.tsx',
  'scripts/verify-trigger.js',
  'scripts/bootstrap-admin.js',
  'scripts/env-sync.js',
  'scripts/env-check.js',
];

// Required scripts in package.json
const REQUIRED_SCRIPTS = [
  'verify-trigger',
  'bootstrap:admin',
  'check:auth',
  'env:sync',
  'env:check',
  'db:apply:cloud',
];

// Required routes (checked via file existence)
const REQUIRED_ROUTES = [
  { route: '/auth/login', file: 'apps/web/app/auth/login/page.tsx' },
  { route: '/auth/register', file: 'apps/web/app/auth/register/page.tsx' },
  { route: '/me', file: 'apps/web/app/me/page.tsx' },
];

let exitCode = 0;
const errors = [];
const warnings = [];

console.log('🏛️  AURELIUS // Repo State Reconciliation Gate\n');

// Check required files
console.log('📁 Checking required files...');
for (const file of REQUIRED_FILES) {
  const filePath = path.join(PROJECT_ROOT, file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${file}`);
  } else {
    console.log(`   ❌ ${file}`);
    errors.push(`Missing required file: ${file}`);
    exitCode = 1;
  }
}

// Check package.json scripts
console.log('\n📜 Checking package.json scripts...');
const packageJsonPath = path.join(PROJECT_ROOT, 'package.json');
let packageJson;
try {
  packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
} catch (error) {
  console.log(`   ❌ Cannot read package.json: ${error.message}`);
  errors.push('Cannot read package.json');
  exitCode = 1;
  packageJson = { scripts: {} };
}

for (const script of REQUIRED_SCRIPTS) {
  if (packageJson.scripts && packageJson.scripts[script]) {
    console.log(`   ✅ ${script}`);
  } else {
    console.log(`   ❌ ${script}`);
    errors.push(`Missing required script: ${script}`);
    exitCode = 1;
  }
}

// Check routes
console.log('\n🛣️  Checking required routes...');
for (const { route, file } of REQUIRED_ROUTES) {
  const filePath = path.join(PROJECT_ROOT, file);
  if (fs.existsSync(filePath)) {
    console.log(`   ✅ ${route}`);
  } else {
    console.log(`   ❌ ${route}`);
    errors.push(`Missing required route: ${route} (file: ${file})`);
    exitCode = 1;
  }
}

// Check Supabase mode (cloud vs CLI)
console.log('\n⚙️  Checking Supabase mode...');
const supabaseConfigPath = path.join(PROJECT_ROOT, 'supabase/config.toml');
const cloudModeDocsPath = path.join(PROJECT_ROOT, 'docs/CLOUD-MODE.md');

if (fs.existsSync(supabaseConfigPath)) {
  console.log('   ℹ️  Supabase CLI mode detected (config.toml exists)');
  if (!fs.existsSync(cloudModeDocsPath)) {
    warnings.push('CLI mode detected but CLOUD-MODE.md missing');
  }
} else if (fs.existsSync(cloudModeDocsPath)) {
  console.log('   ℹ️  Supabase Cloud mode detected (CLOUD-MODE.md exists)');
} else {
  console.log('   ⚠️  No Supabase mode explicitly configured');
  warnings.push('Neither supabase/config.toml nor docs/CLOUD-MODE.md found');
}

// Summary
console.log('\n' + '='.repeat(60));
if (errors.length === 0 && warnings.length === 0) {
  console.log('✅ Repo state is RECONCILED. All checks passed.');
} else {
  if (errors.length > 0) {
    console.log(`\n❌ ERRORS (${errors.length}):`);
    errors.forEach((e, i) => console.log(`   ${i + 1}. ${e}`));
  }
  if (warnings.length > 0) {
    console.log(`\n⚠️  WARNINGS (${warnings.length}):`);
    warnings.forEach((w, i) => console.log(`   ${i + 1}. ${w}`));
  }
  console.log('\n🔧 Run the reconciliation patch to fix missing components.');
}
console.log('='.repeat(60));

process.exit(exitCode);

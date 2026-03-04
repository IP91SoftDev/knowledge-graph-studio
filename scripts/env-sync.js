#!/usr/bin/env node
/**
 * env-sync.js
 * Copies root .env.local -> apps/web/.env.local
 * (Never copies .env.example; that file is just a template.)
 * 
 * SAFETY RULES:
 * 1. Never overwrite root .env.local with .env.example
 * 2. Refuse to sync if root .env.local contains placeholders
 * 3. Always backup existing apps/web/.env.local before overwriting
 */
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const src = path.join(root, '.env.local');
const dest = path.join(root, 'apps', 'web', '.env.local');
const examplePath = path.join(root, '.env.example');

console.log('🔐 env-sync — Secure Environment Sync\n');

// Placeholder patterns that indicate incomplete configuration
const PLACEHOLDER_PATTERNS = [
  { pattern: /your-project\.supabase\.co/i, name: 'NEXT_PUBLIC_SUPABASE_URL' },
  { pattern: /your-anon-key/i, name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY' },
  { pattern: /your-service-role-key/i, name: 'SUPABASE_SERVICE_ROLE_KEY' },
  { pattern: /your-domain\.com/i, name: 'NEXT_PUBLIC_SITE_URL' },
  { pattern: /^sb_[a-z]+_$/i, name: 'Truncated Supabase Key' },
];

// Check 1: Source file must exist
if (!fs.existsSync(src)) {
  console.error('❌ .env.local not found at repo root.');
  console.error('   Create it from .env.example and fill in real values first.');
  console.error('   Command: cp .env.example .env.local  # Then edit with real values');
  process.exit(1);
}

// Check 2: Destination backup (if exists)
if (fs.existsSync(dest)) {
  const backupPath = `${dest}.backup.${Date.now()}`;
  fs.copyFileSync(dest, backupPath);
  console.log(`📦 Backed up existing: ${path.basename(backupPath)}`);
}

const content = fs.readFileSync(src, 'utf8');

// Check 3: Validate no placeholders in source
console.log('🔍 Checking for placeholder values...\n');

let hasPlaceholders = false;
for (const { pattern, name } of PLACEHOLDER_PATTERNS) {
  if (pattern.test(content)) {
    console.error(`❌ Placeholder detected in .env.local: ${name}`);
    hasPlaceholders = true;
  }
}

if (hasPlaceholders) {
  console.error('\n⚠️  SECURITY: Refusing to sync environment with placeholder values.');
  console.error('   This prevents accidentally deploying with example credentials.');
  console.error('\n   Fix: Edit .env.local and replace placeholders with real values:');
  console.error(`   - ${src}`);
  console.error('\n   Required variables:');
  console.error('   - NEXT_PUBLIC_SUPABASE_URL (your actual Supabase project URL)');
  console.error('   - NEXT_PUBLIC_SUPABASE_ANON_KEY (from Supabase Dashboard → Settings → API)');
  console.error('   - SUPABASE_SERVICE_ROLE_KEY (from Supabase Dashboard → Settings → API)');
  process.exit(1);
}

console.log('✅ No placeholders detected');

// Check 4: Validate required variables exist
const requiredVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
];

let missingVars = [];
for (const varName of requiredVars) {
  if (!content.includes(`${varName}=`)) {
    missingVars.push(varName);
  }
}

if (missingVars.length > 0) {
  console.error(`\n❌ Missing required variables: ${missingVars.join(', ')}`);
  process.exit(1);
}

console.log('✅ All required variables present');

// Sync
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, content, 'utf8');

console.log('\n✅ Environment synced successfully');
console.log('   Source: root/.env.local');
console.log('   Destination: apps/web/.env.local');
console.log('\n   Variables synced:');
const varCount = content.split('\n').filter(line => line.trim() && !line.trim().startsWith('#')).length;
console.log(`   - ${varCount} environment variables`);

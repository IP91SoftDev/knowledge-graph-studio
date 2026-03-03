#!/usr/bin/env node

/**
 * Environment Validation Script
 * 
 * Verifies required env keys exist (without printing values)
 * Fails CI if any required keys are missing
 */

const fs = require('fs');
const path = require('path');

const webEnv = path.join(__dirname, '..', 'apps', 'web', '.env.local');

const REQUIRED_KEYS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'NEXT_PUBLIC_SITE_URL'
];

// Check env file exists
if (!fs.existsSync(webEnv)) {
  console.error('❌ Error: apps/web/.env.local not found');
  console.error('   Run: pnpm env:sync to propagate from root');
  process.exit(1);
}

// Read and parse env file
const content = fs.readFileSync(webEnv, 'utf8');
const envLines = content.split('\n');
const definedKeys = new Set();

envLines.forEach(line => {
  const match = line.match(/^([A-Z_][A-Z0-9_]*)=/);
  if (match) {
    definedKeys.add(match[1]);
  }
});

// Check required keys
const missing = REQUIRED_KEYS.filter(key => !definedKeys.has(key));

if (missing.length > 0) {
  console.error('❌ Error: Missing required environment variables:');
  missing.forEach(key => console.error(`   - ${key}`));
  console.error('   Edit: apps/web/.env.local or run pnpm env:sync');
  process.exit(1);
}

console.log('✅ Environment validation passed');
console.log(`   Checked: ${REQUIRED_KEYS.length} required keys`);
console.log('   All keys present (values not shown)');

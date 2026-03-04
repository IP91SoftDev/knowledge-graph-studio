#!/usr/bin/env node

/**
 * Environment Validation Script
 * 
 * Verifies required env keys exist (without printing values)
 * Fails CI if any required keys are missing or contain placeholders
 */

const fs = require('fs');
const path = require('path');

const webEnv = path.join(__dirname, '..', 'apps', 'web', '.env.local');
const rootEnv = path.join(__dirname, '..', '.env.local');

const REQUIRED_KEYS = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'NEXT_PUBLIC_SITE_URL'
];

// Placeholder patterns that indicate incomplete configuration
const PLACEHOLDER_PATTERNS = [
  { pattern: /your-project\.supabase\.co/i, name: 'Supabase URL placeholder' },
  { pattern: /your-anon-key/i, name: 'Anon key placeholder' },
  { pattern: /your-service-role-key/i, name: 'Service role key placeholder' },
  { pattern: /your-domain\.com/i, name: 'Site URL placeholder' },
  { pattern: /^sb_[a-z]+_$/i, name: 'Truncated Supabase key' },
];

console.log('🔐 Environment Check\n');

let exitCode = 0;

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
const keyValuePairs = {};

envLines.forEach(line => {
  const match = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (match) {
    definedKeys.add(match[1]);
    keyValuePairs[match[1]] = match[2];
  }
});

// Check required keys
console.log('📋 Checking required keys...\n');
const missing = REQUIRED_KEYS.filter(key => !definedKeys.has(key));

if (missing.length > 0) {
  console.error('❌ Missing required environment variables:');
  missing.forEach(key => console.error(`   - ${key}`));
  exitCode = 1;
} else {
  console.log('✅ All required keys present');
}

// Check for placeholders
console.log('\n🔍 Checking for placeholder values...\n');

let hasPlaceholders = false;
for (const { pattern, name } of PLACEHOLDER_PATTERNS) {
  if (pattern.test(content)) {
    console.error(`❌ Placeholder detected: ${name}`);
    hasPlaceholders = true;
    exitCode = 1;
  }
}

if (!hasPlaceholders) {
  console.log('✅ No placeholder values detected');
}

// Validate Supabase URL format
console.log('\n🌐 Validating Supabase URL format...\n');

const supabaseUrl = keyValuePairs['NEXT_PUBLIC_SUPABASE_URL'];
if (supabaseUrl) {
  const supabasePattern = /^https:\/\/[a-z]{20}\.supabase\.co$/;
  if (supabasePattern.test(supabaseUrl)) {
    console.log('✅ Supabase URL format valid');
  } else if (!supabaseUrl.includes('supabase.co')) {
    console.error('❌ Supabase URL does not appear to be a valid Supabase project URL');
    exitCode = 1;
  } else {
    console.log('⚠️  Supabase URL format may be non-standard');
  }
}

// Summary
console.log('\n' + '='.repeat(50));
if (exitCode === 0) {
  console.log('✅ Environment validation PASSED');
} else {
  console.log('❌ Environment validation FAILED');
  console.log('\n   Fix issues above and re-run: pnpm env:check');
}
console.log('='.repeat(50));

process.exit(exitCode);

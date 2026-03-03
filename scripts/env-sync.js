#!/usr/bin/env node

/**
 * Environment Sync Script
 * 
 * Copies .env.local from root to apps/web/.env.local
 * Ensures monorepo-wide env consistency
 */

const fs = require('fs');
const path = require('path');

const rootEnv = path.join(__dirname, '..', '.env.local');
const webEnv = path.join(__dirname, '..', 'apps', 'web', '.env.local');

// Check root env exists
if (!fs.existsSync(rootEnv)) {
  console.error('❌ Error: .env.local not found in repo root');
  console.error('   Run: cp .env.example .env.local and fill in values');
  process.exit(1);
}

// Read root env
const rootContent = fs.readFileSync(rootEnv, 'utf8');

// Write to apps/web
fs.writeFileSync(webEnv, rootContent);

console.log('✅ Environment synced: root → apps/web');
console.log('   Files updated:');
console.log('   - apps/web/.env.local');

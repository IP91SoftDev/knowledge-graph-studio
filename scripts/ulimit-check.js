#!/usr/bin/env node

/**
 * Ulimit Check Script
 * 
 * Verifies file descriptor limit is sufficient for Next.js + Turborepo
 * 
 * Requirements:
 * - Development: >= 8192
 * - Production: >= 65535 (recommended)
 * 
 * If limit is too low, prints fix instructions and exits with error.
 */

const { execSync } = require('child_process');
const fs = require('fs');

const MIN_SOFT_LIMIT = 8192;
const RECOMMENDED_LIMIT = 65535;

console.log('🔍 Checking file descriptor limits...\n');

// Get current soft limit
let softLimit;
try {
  const output = execSync('ulimit -n', { encoding: 'utf8' }).trim();
  softLimit = parseInt(output, 10);
} catch (error) {
  console.error('⚠️  Could not determine ulimit (may not be available on this platform)');
  console.error('   Continuing anyway, but watch for "Too many open files" errors\n');
  process.exit(0);
}

console.log(`   Current soft limit: ${softLimit}`);
console.log(`   Minimum required:   ${MIN_SOFT_LIMIT}`);
console.log(`   Recommended:        ${RECOMMENDED_LIMIT}\n`);

if (softLimit < MIN_SOFT_LIMIT) {
  console.error('❌ FAIL: File descriptor limit too low!\n');
  
  console.error('📋 Fix Instructions:\n');
  console.error('   TEMPORARY (current session only):');
  console.error('   $ ulimit -n 65535\n');
  
  console.error('   PERMANENT (requires sudo + reboot/logout):\n');
  console.error('   1. Create systemd config:');
  console.error('      $ sudo mkdir -p /etc/systemd/user.conf.d/');
  console.error('      $ sudo tee /etc/systemd/user.conf.d/limits.conf << EOF');
  console.error('      [Manager]');
  console.error('      DefaultLimitNOFILE=65535');
  console.error('      EOF\n');
  
  console.error('   2. Update PAM limits:');
  console.error('      $ sudo tee -a /etc/security/limits.conf << EOF');
  console.error('      * soft nofile 65535');
  console.error('      * hard nofile 65535');
  console.error('      EOF\n');
  
  console.error('   3. Reboot or logout/login\n');
  
  console.error('   See docs/ops/vps.md for full details.\n');
  
  process.exit(1);
}

if (softLimit < RECOMMENDED_LIMIT) {
  console.warn(`⚠️  WARNING: Limit ${softLimit} is above minimum but below recommended ${RECOMMENDED_LIMIT}`);
  console.warn('   You may encounter issues with large projects or watch modes.\n');
  console.warn('   For permanent fix, see docs/ops/vps.md\n');
} else {
  console.log('✅ PASS: File descriptor limit is sufficient\n');
}

process.exit(0);

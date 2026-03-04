#!/usr/bin/env node
/**
 * auth-doctor.js — Supabase Auth Diagnostic Script
 * 
 * Diagnoses authentication issues by:
 * 1. Validating environment variables (no placeholders)
 * 2. Testing Supabase project connectivity
 * 3. Testing email/password sign-in with test credentials
 * 4. Checking auth provider configuration
 * 
 * Usage: pnpm auth:doctor
 * 
 * Exit codes:
 *   0 — All checks passed
 *   1 — Configuration error (placeholders, missing vars)
 *   2 — Connectivity error (project unreachable)
 *   3 — Auth error (login failed)
 */

const fs = require('fs');
const path = require('path');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const ENV_LOCAL_PATH = path.join(PROJECT_ROOT, '.env.local');

// Placeholder patterns to detect
const PLACEHOLDER_PATTERNS = [
  { pattern: /your-project\.supabase\.co/i, name: 'NEXT_PUBLIC_SUPABASE_URL' },
  { pattern: /your-anon-key/i, name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY' },
  { pattern: /your-service-role-key/i, name: 'SUPABASE_SERVICE_ROLE_KEY' },
  { pattern: /^sb_[a-z]+_$/i, name: 'Supabase Key (appears truncated)' },
  { pattern: /example\.supabase\.co/i, name: 'Example Supabase URL' },
  { pattern: /test-project/i, name: 'Test project placeholder' },
];

console.log('🏛️  AURELIUS // Auth Diagnostic Script\n');
console.log('[AURELIUS] START — Auth Doctor\n');

let exitCode = 0;
const results = [];

function addResult(category, check, status, detail) {
  results.push({ category, check, status, detail });
  const icon = status === 'PASS' ? '✅' : status === 'WARN' ? '⚠️' : '❌';
  console.log(`${icon} [${category}] ${check}`);
  if (detail) console.log(`   ${detail}`);
}

// Load environment
console.log('📋 Loading environment...\n');

let envContent = '';
if (fs.existsSync(ENV_LOCAL_PATH)) {
  envContent = fs.readFileSync(ENV_LOCAL_PATH, 'utf8');
  addResult('ENV', '.env.local exists', 'PASS', `Found at ${ENV_LOCAL_PATH}`);
} else {
  addResult('ENV', '.env.local exists', 'FAIL', 'File not found');
  exitCode = 1;
}

const getEnvVar = (name) => {
  const match = envContent.match(new RegExp(`${name}=(.*)`));
  return match ? match[1].trim() : process.env[name];
};

const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');
const supabaseServiceKey = getEnvVar('SUPABASE_SERVICE_ROLE_KEY');

// Check for placeholders
console.log('\n🔍 Checking for placeholder values...\n');

if (supabaseUrl && supabaseAnonKey) {
  let hasPlaceholders = false;
  
  for (const { pattern, name } of PLACEHOLDER_PATTERNS) {
    if (pattern.test(supabaseUrl) || pattern.test(supabaseAnonKey || '')) {
      addResult('ENV', `Placeholder detected: ${name}`, 'FAIL', 'Environment contains placeholder values');
      hasPlaceholders = true;
      exitCode = 1;
    }
  }
  
  if (!hasPlaceholders) {
    addResult('ENV', 'No placeholder values detected', 'PASS');
  }
} else {
  addResult('ENV', 'Required env vars present', 'FAIL', 'NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY missing');
  exitCode = 1;
}

// Test 1: Project connectivity
console.log('\n🌐 Testing Supabase project connectivity...\n');

async function testConnectivity() {
  if (!supabaseUrl) {
    addResult('CONNECTIVITY', 'Supabase URL configured', 'FAIL');
    return false;
  }
  
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/`, {
      headers: {
        'apikey': supabaseAnonKey || '',
        'Authorization': `Bearer ${supabaseAnonKey || ''}`,
      },
    });
    
    // 401/403 is OK - means project exists but auth failed (expected with wrong key)
    // 404 means project doesn't exist
    // 200 means success
    if (response.status === 404) {
      addResult('CONNECTIVITY', 'Project reachable', 'FAIL', `404 - Project not found: ${supabaseUrl}`);
      return false;
    } else if (response.status === 401 || response.status === 403) {
      addResult('CONNECTIVITY', 'Project reachable', 'PASS', `Project exists (auth required, as expected)`);
      return true;
    } else if (response.ok) {
      addResult('CONNECTIVITY', 'Project reachable', 'PASS', `HTTP ${response.status}`);
      return true;
    } else {
      addResult('CONNECTIVITY', 'Project reachable', 'WARN', `HTTP ${response.status}`);
      return true;
    }
  } catch (error) {
    addResult('CONNECTIVITY', 'Project reachable', 'FAIL', `Connection failed: ${error.message}`);
    return false;
  }
}

// Test 2: Anon key validation
console.log('\n🔑 Testing anon key...\n');

async function testAnonKey() {
  if (!supabaseUrl || !supabaseAnonKey) {
    addResult('AUTH', 'Anon key test', 'SKIP', 'Missing credentials');
    return;
  }
  
  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/settings`, {
      headers: {
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
    });
    
    if (response.ok) {
      const settings = await response.json();
      addResult('AUTH', 'Anon key valid', 'PASS', 'Successfully fetched auth settings');
      
      // Check email provider
      if (settings.external && settings.external.email) {
        addResult('AUTH', 'Email provider enabled', 'PASS', 'Email auth is configured');
      } else {
        addResult('AUTH', 'Email provider enabled', 'WARN', 'Email provider status unknown');
      }
      
      return true;
    } else if (response.status === 401 || response.status === 403) {
      addResult('AUTH', 'Anon key valid', 'FAIL', 'Invalid anon key (401/403)');
      return false;
    } else {
      addResult('AUTH', 'Anon key valid', 'WARN', `HTTP ${response.status}`);
      return true;
    }
  } catch (error) {
    addResult('AUTH', 'Anon key test', 'FAIL', `Error: ${error.message}`);
    return false;
  }
}

// Test 3: Password login test (with test credentials if provided)
console.log('\n🔐 Testing password authentication...\n');

async function testPasswordLogin() {
  const testEmail = process.argv[2];
  const testPassword = process.argv[3];
  
  if (!testEmail || !testPassword) {
    addResult('AUTH', 'Password login test', 'SKIP', 'No test credentials provided');
    console.log('   Usage: pnpm auth:doctor <test-email> <test-password>');
    return;
  }
  
  if (!supabaseUrl || !supabaseAnonKey) {
    addResult('AUTH', 'Password login test', 'SKIP', 'Missing credentials');
    return;
  }
  
  try {
    const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
      },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      addResult('AUTH', 'Password login', 'PASS', `Successfully authenticated as ${testEmail}`);
      return true;
    } else {
      addResult('AUTH', 'Password login', 'FAIL', `HTTP ${response.status}: ${data.msg || data.error || 'Unknown error'}`);
      console.log(`   Response: ${JSON.stringify(data, null, 2)}`);
      
      // Provide diagnostic hints
      if (response.status === 400) {
        console.log('\n   💡 400 Bad Request typically means:');
        console.log('      - Email provider not enabled in Supabase Dashboard');
        console.log('      - User exists but was created via OTP (no password set)');
        console.log('      - Email confirmation required but not completed');
        console.log('      - Password policy violation (min length, etc.)');
        console.log('\n   🔧 Fix: Check Supabase Dashboard → Authentication → Providers → Email');
      } else if (response.status === 401) {
        console.log('\n   💡 401 Unauthorized means:');
        console.log('      - Invalid email or password');
        console.log('      - User does not exist');
      }
      
      exitCode = 3;
      return false;
    }
  } catch (error) {
    addResult('AUTH', 'Password login', 'FAIL', `Error: ${error.message}`);
    exitCode = 3;
    return false;
  }
}

// Test 4: Check middleware exists
console.log('\n📄 Checking middleware configuration...\n');

const middlewarePath = path.join(PROJECT_ROOT, 'apps/web/middleware.ts');
if (fs.existsSync(middlewarePath)) {
  const middlewareContent = fs.readFileSync(middlewarePath, 'utf8');
  if (middlewareContent.includes('createServerClient') && middlewareContent.includes('@supabase/ssr')) {
    addResult('CONFIG', 'Middleware configured', 'PASS', 'SSR middleware found with Supabase client');
  } else {
    addResult('CONFIG', 'Middleware configured', 'WARN', 'Middleware exists but may not have Supabase setup');
  }
} else {
  addResult('CONFIG', 'Middleware configured', 'FAIL', 'middleware.ts not found');
  exitCode = 1;
}

// Test 5: Check auth routes exist
console.log('\n🛣️  Checking auth routes...\n');

const authRoutes = [
  { name: 'Login page', path: 'apps/web/app/auth/login/page.tsx' },
  { name: 'Register page', path: 'apps/web/app/auth/register/page.tsx' },
];

for (const { name, path: routePath } of authRoutes) {
  const fullPath = path.join(PROJECT_ROOT, routePath);
  if (fs.existsSync(fullPath)) {
    addResult('ROUTES', name, 'PASS', routePath);
  } else {
    addResult('ROUTES', name, 'FAIL', `Missing: ${routePath}`);
    exitCode = 1;
  }
}

// Run async tests
(async () => {
  await testConnectivity();
  await testAnonKey();
  await testPasswordLogin();
  
  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('AUTH DOCTOR SUMMARY');
  console.log('='.repeat(60));
  
  const passCount = results.filter(r => r.status === 'PASS').length;
  const failCount = results.filter(r => r.status === 'FAIL').length;
  const warnCount = results.filter(r => r.status === 'WARN').length;
  const skipCount = results.filter(r => r.status === 'SKIP').length;
  
  console.log(`✅ PASS: ${passCount}`);
  console.log(`❌ FAIL: ${failCount}`);
  console.log(`⚠️  WARN: ${warnCount}`);
  console.log(`⏭️  SKIP: ${skipCount}`);
  console.log('='.repeat(60));
  
  if (failCount > 0) {
    console.log('\n❌ Auth doctor found FAILURES. Fix issues before proceeding.\n');
  } else if (warnCount > 0) {
    console.log('\n⚠️  Auth doctor found WARNINGS. Review and address if needed.\n');
  } else {
    console.log('\n✅ All auth checks passed. System ready.\n');
  }
  
  console.log('[AURELIUS] STOP — Auth Doctor\n');
  process.exit(exitCode);
})();

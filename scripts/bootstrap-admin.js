#!/usr/bin/env node
/**
 * Bootstrap Admin Script
 * 
 * Creates the initial admin user in Supabase.
 * Requires Supabase project to be initialized and migrations applied.
 * 
 * Usage: pnpm bootstrap:admin
 * 
 * This script:
 * 1. Reads admin credentials from environment or prompts
 * 2. Creates admin user via Supabase Admin API (bypasses email confirmation)
 * 3. Assigns admin role in the database
 * 4. Outputs credentials for secure storage
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const PROJECT_ROOT = path.resolve(__dirname, '..');

console.log('[AURELIUS] START — Bootstrap Admin User\n');

// Load environment
const envLocalPath = path.join(PROJECT_ROOT, '.env.local');
let envContent = '';
if (fs.existsSync(envLocalPath)) {
  envContent = fs.readFileSync(envLocalPath, 'utf8');
}

const getEnvVar = (name) => {
  const match = envContent.match(new RegExp(`${name}=(.*)`));
  return match ? match[1].trim() : process.env[name];
};

const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const supabaseServiceKey = getEnvVar('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL in .env.local');
  process.exit(1);
}

if (!supabaseServiceKey) {
  console.error('❌ Missing SUPABASE_SERVICE_ROLE_KEY in .env.local');
  console.error('   This is required to create users via Admin API.');
  console.error('   Find it in Supabase Dashboard → Settings → API → Service Role Key');
  process.exit(1);
}

// Prompt for admin credentials
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const prompt = (question) => new Promise((resolve) => {
  rl.question(question, resolve);
});

(async () => {
  try {
    console.log('📋 Admin User Bootstrap\n');
    console.log('This will create an admin user in your Supabase project.\n');

    let adminEmail = process.argv[2];
    let adminPassword = process.argv[3];

    if (!adminEmail) {
      adminEmail = await prompt('Admin email: ');
    }
    if (!adminPassword) {
      adminPassword = await prompt('Admin password (min 6 chars): ');
    }

    rl.close();

    if (!adminEmail || !adminPassword) {
      console.error('❌ Email and password are required.');
      process.exit(1);
    }

    if (adminPassword.length < 6) {
      console.error('❌ Password must be at least 6 characters.');
      process.exit(1);
    }

    console.log('\n🔧 Creating admin user...\n');

    // Create user via Supabase Admin API
    const response = await fetch(`${supabaseUrl}/auth/v1/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
      },
      body: JSON.stringify({
        email: adminEmail,
        password: adminPassword,
        email_confirm: true,
        user_metadata: {
          role: 'admin',
          is_admin: true,
        },
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ Failed to create admin user:');
      console.error(JSON.stringify(result, null, 2));
      process.exit(1);
    }

    console.log('✅ Admin user created successfully!\n');
    console.log('📋 User Details:');
    console.log(`   Email: ${result.email}`);
    console.log(`   ID: ${result.id}`);
    console.log(`   Role: admin`);
    console.log(`   Confirmed: ${result.confirmed_at ? 'Yes' : 'No'}`);

    console.log('\n📝 Next Steps:');
    console.log('   1. Store these credentials securely');
    console.log('   2. Login at /auth/login with these credentials');
    console.log('   3. Navigate to /me to verify admin access');
    console.log('   4. Change password after first login (recommended)');

    console.log('\n[AURELIUS] DONE — Bootstrap Admin User');
  } catch (error) {
    rl.close();
    console.error('❌ Error:', error.message);
    console.log('\n[AURELIUS] DONE — Bootstrap Admin User (FAILED)');
    process.exit(1);
  }
})();

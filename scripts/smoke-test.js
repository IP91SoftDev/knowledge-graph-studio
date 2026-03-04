#!/usr/bin/env node

/**
 * Smoke Test Script
 * 
 * 1. Builds Next.js app
 * 2. Starts production server
 * 3. Curls /auth/login with strict error checking
 * 4. Verifies HTTP 200 response
 * 5. Cleans up server process
 * 
 * Fails if:
 * - Build fails
 * - Server doesn't start
 * - HTTP status != 200
 * - Response is empty
 */

const { execSync, spawn } = require('child_process');
const http = require('http');

const PORT = 3000;
const HOST = '127.0.0.1';

// Route Health Gate
// - Public routes: expect 200
// - Protected routes (unauthenticated): expect 307 (redirect to login)
const ROUTES = [
  // Public routes
  { path: '/', expectStatus: 200, description: 'Home/Landing', type: 'public' },
  { path: '/auth/login', expectStatus: 200, description: 'Login page', type: 'public' },
  { path: '/auth/register', expectStatus: 200, description: 'Register page', type: 'public' },
  // Protected routes (should redirect when unauthenticated)
  { path: '/me', expectStatus: 307, description: 'Profile', type: 'protected' },
  { path: '/browse', expectStatus: 307, description: 'Browse', type: 'protected' },
  { path: '/search', expectStatus: 307, description: 'Search', type: 'protected' },
  { path: '/ingest', expectStatus: 307, description: 'Ingest', type: 'protected' },
  { path: '/analytics', expectStatus: 307, description: 'Analytics', type: 'protected' },
];

console.log('🔍 Starting smoke test...\n');

// Step 1: Build
console.log('📦 Step 1: Building Next.js app...');
try {
  execSync('pnpm -C apps/web build', { stdio: 'inherit' });
  console.log('✅ Build successful\n');
} catch (error) {
  console.error('❌ Build failed');
  process.exit(1);
}

// Step 2: Start server
console.log('🚀 Step 2: Starting production server...');
const server = spawn('pnpm', ['-C', 'apps/web', 'start', '--', '--hostname', HOST, '--port', PORT], {
  stdio: ['ignore', 'pipe', 'pipe'],
  detached: true,
});

let serverReady = false;
const serverOutput = [];

server.stdout.on('data', (data) => {
  const line = data.toString();
  serverOutput.push(line);
  if (line.includes('Ready') || line.includes('started')) {
    serverReady = true;
  }
});

server.stderr.on('data', (data) => {
  serverOutput.push(data.toString());
});

// Wait for server to be ready
function waitForServer(maxAttempts = 30) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    
    const check = () => {
      attempts++;
      
      if (serverReady || attempts >= maxAttempts) {
        resolve();
      } else {
        setTimeout(check, 500);
      }
    };
    
    check();
  });
}

// HTTP request with status check
function checkEndpoint(path, expectStatus) {
  const url = `http://${HOST}:${PORT}${path}`;
  return new Promise((resolve, reject) => {
    const req = http.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode !== expectStatus) {
          reject(new Error(`${path}: HTTP ${res.statusCode} (expected ${expectStatus})`));
        } else if (expectStatus === 200 && data.length < 100) {
          reject(new Error(`${path}: Response too short (empty or error page)`));
        } else if (expectStatus === 200 && !data.includes('<!DOCTYPE html') && !data.includes('<html')) {
          reject(new Error(`${path}: Response does not appear to be valid HTML`));
        } else {
          resolve({ path, statusCode: res.statusCode, size: data ? data.length : 0 });
        }
      });
    });
    
    req.on('error', (err) => {
      reject(new Error(`${path}: ${err.message}`));
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error(`${path}: Request timeout (5s)`));
    });
  });
}

// Cleanup
function cleanup() {
  console.log('\n🧹 Cleaning up...');
  try {
    // Kill server process
    if (server.pid) {
      process.kill(-server.pid, 'SIGTERM');
    }
    // Also kill any remaining next processes on our port
    execSync(`pkill -f "next start.*${PORT}" || true`, { stdio: 'ignore' });
  } catch (e) {
    // Ignore cleanup errors
  }
  console.log('✅ Cleanup complete');
}

// Main execution
(async () => {
  try {
    await waitForServer();
    
    if (!serverReady) {
      console.error('❌ Server did not start within timeout');
      console.error('Server output:');
      serverOutput.forEach(line => console.error(line));
      cleanup();
      process.exit(1);
    }
    
    console.log('✅ Server started\n');
    
    console.log('🌐 Step 3: Route Health Gate\n');
    const results = [];
    
    for (const route of ROUTES) {
      try {
        const result = await checkEndpoint(route.path, route.expectStatus);
        results.push({ ...result, status: 'PASS', description: route.description, type: route.type });
        const typeLabel = route.type === 'public' ? 'PUBLIC' : 'PROT  ';
        console.log(`✅ ${route.description.padEnd(15)} ${route.path.padEnd(20)} HTTP ${result.statusCode} [${typeLabel}]`);
      } catch (error) {
        results.push({ path: route.path, status: 'FAIL', error: error.message, description: route.description, type: route.type });
        const typeLabel = route.type === 'public' ? 'PUBLIC' : 'PROT  ';
        console.log(`❌ ${route.description.padEnd(15)} ${route.path.padEnd(20)} ${error.message} [${typeLabel}]`);
      }
    }
    
    console.log('\n' + '='.repeat(70));
    const passed = results.filter(r => r.status === 'PASS').length;
    const failed = results.filter(r => r.status === 'FAIL').length;
    const publicPassed = results.filter(r => r.status === 'PASS' && r.type === 'public').length;
    const publicTotal = results.filter(r => r.type === 'public').length;
    const protectedPassed = results.filter(r => r.status === 'PASS' && r.type === 'protected').length;
    const protectedTotal = results.filter(r => r.type === 'protected').length;
    
    console.log('ROUTE HEALTH SUMMARY');
    console.log('='.repeat(70));
    console.log(`Public Routes:    ${publicPassed}/${publicTotal} passed`);
    console.log(`Protected Routes: ${protectedPassed}/${protectedTotal} passed (redirect when unauthenticated)`);
    console.log(`Overall:          ${passed}/${results.length} passed`);
    
    if (failed > 0) {
      console.log('\n❌ Smoke test FAILED\n');
      cleanup();
      process.exit(1);
    } else {
      console.log('\n✅ Smoke test PASSED - All routes healthy\n');
      cleanup();
      process.exit(0);
    }
    
  } catch (error) {
    console.error(`❌ Smoke test FAILED: ${error.message}`);
    console.error('\nServer output:');
    serverOutput.forEach(line => console.error(line));
    cleanup();
    process.exit(1);
  }
})();

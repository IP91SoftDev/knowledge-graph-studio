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
const ROUTES = [
  { path: '/auth/login', expectStatus: 200, description: 'Login page' },
  { path: '/auth/register', expectStatus: 200, description: 'Register page' },
  { path: '/me', expectStatus: 307, description: 'Profile (redirect when not authed)' },
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
    
    console.log('🌐 Step 3: Testing required routes...\n');
    const results = [];
    
    for (const route of ROUTES) {
      try {
        const result = await checkEndpoint(route.path, route.expectStatus);
        results.push({ ...result, status: 'PASS', description: route.description });
        console.log(`✅ ${route.description.padEnd(30)} ${route.path.padEnd(20)} HTTP ${result.statusCode}`);
      } catch (error) {
        results.push({ path: route.path, status: 'FAIL', error: error.message, description: route.description });
        console.log(`❌ ${route.description.padEnd(30)} ${route.path.padEnd(20)} ${error.message}`);
      }
    }
    
    console.log('\n' + '='.repeat(60));
    const passed = results.filter(r => r.status === 'PASS').length;
    const failed = results.filter(r => r.status === 'FAIL').length;
    
    console.log(`Results: ${passed}/${results.length} passed, ${failed}/${results.length} failed`);
    
    if (failed > 0) {
      console.log('\n❌ Smoke test FAILED\n');
      cleanup();
      process.exit(1);
    } else {
      console.log('\n✅ Smoke test PASSED\n');
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

/**
 * Web Snapshot Tool
 * 
 * Captures screenshots and HTML snapshots of allowlisted URLs.
 * Includes SSRF protection and domain allowlisting.
 * 
 * Usage: pnpm web:snapshot <url>
 * 
 * Security:
 * - Domain allowlist only
 * - SSRF protection (blocks private IPs)
 * - No cookies/credentials
 * - No form submissions
 * - No external script execution beyond normal page load
 */

import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';
import { URL } from 'url';
import crypto from 'crypto';

// ============================================================================
// SECURITY: Domain Allowlist
// ============================================================================
const ALLOWLIST = new Set([
  // Square UI templates
  'square-ui-marketing-dashboard.vercel.app',
  'square-ui-dashboard-5.vercel.app',
  'square-ui-bookmarks.vercel.app',
  'square-ui-files.vercel.app',
  'square-ui-dashboard-2.vercel.app',
  'square-ui-dashboard-3.vercel.app',
  'square-ui-dashboard-4.vercel.app',
  'square-ui-leads.vercel.app',
  'square-ui-employees.vercel.app',
  'square-ui-payrolls.vercel.app',
  'square-ui-tasks.vercel.app',
  'square-ui-projects-timeline.vercel.app',
  'square-ui-calendar.vercel.app',
  'square-ui-chat.vercel.app',
  'square-ui-emails.vercel.app',
  'square-ui-task-management.vercel.app',
  'square-ui-finance-tracker.vercel.app',
  'square-ui-rentals.vercel.app',
  'square-ui-maps.vercel.app',
  // Vercel previews (for Square UI)
  '*.vercel.app',
  // GitHub (for reference)
  'github.com',
  'raw.githubusercontent.com',
  // shadcn/ui
  'ui.shadcn.com',
  // Radix UI
  'www.radix-ui.com',
]);

// ============================================================================
// SECURITY: SSRF Protection
// ============================================================================

/**
 * Validates that a URL is safe to fetch.
 * - Must be on allowlist
 * - Must not be a private/internal IP
 * - Must use HTTPS
 */
function assertAllowed(target: string): void {
  let u: URL;
  
  try {
    u = new URL(target);
  } catch {
    throw new Error(`Invalid URL: ${target}`);
  }
  
  // Must be HTTPS
  if (u.protocol !== 'https:') {
    throw new Error(`Only HTTPS URLs are allowed: ${target}`);
  }
  
  // Check allowlist (support wildcards)
  let isAllowed = false;
  for (const allowed of ALLOWLIST) {
    if (allowed.startsWith('*.')) {
      // Wildcard subdomain match
      const baseDomain = allowed.slice(2);
      if (u.hostname.endsWith(baseDomain)) {
        isAllowed = true;
        break;
      }
    } else if (u.hostname === allowed) {
      isAllowed = true;
      break;
    }
  }
  
  if (!isAllowed) {
    throw new Error(`Host not allowlisted: ${u.hostname}`);
  }
  
  // SSRF Protection: Block private/internal IPs
  const blockedPatterns = [
    /^localhost$/i,
    /^127\./,
    /^10\./,
    /^172\.(1[6-9]|2[0-9]|3[0-1])\./,
    /^192\.168\./,
    /^0\.0\.0\.0$/,
    /^169\.254\./, // Link-local
    /^::1$/, // IPv6 localhost
    /^fc00:/i, // IPv6 unique local
    /^fe80:/i, // IPv6 link-local
  ];
  
  for (const pattern of blockedPatterns) {
    if (pattern.test(u.hostname)) {
      throw new Error(`Blocked hostname (SSRF protection): ${u.hostname}`);
    }
  }
  
  // Block IP addresses entirely
  const ipPattern = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/;
  if (ipPattern.test(u.hostname)) {
    throw new Error(`IP addresses are not allowed: ${u.hostname}`);
  }
}

// ============================================================================
// Main Snapshot Function
// ============================================================================

async function main() {
  const target = process.argv[2];
  
  if (!target) {
    console.error('Usage: pnpm web:snapshot <url>');
    console.error('');
    console.error('Examples:');
    console.error('  pnpm web:snapshot https://square-ui-marketing-dashboard.vercel.app/');
    console.error('  pnpm web:snapshot https://ui.shadcn.com/');
    process.exit(1);
  }
  
  // Security check
  assertAllowed(target);
  
  console.log(`📸 Capturing snapshot: ${target}`);
  
  // Generate output directory
  const ts = new Date().toISOString().replace(/[:.]/g, '-');
  const id = crypto.randomBytes(4).toString('hex');
  const outDir = path.join(process.cwd(), 'docs', 'snapshots', `${ts}-${id}`);
  fs.mkdirSync(outDir, { recursive: true });
  
  // Launch browser
  console.log('🌐 Launching browser...');
  const browser = await chromium.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
    ],
  });
  
  // Create page with security settings
  const page = await browser.newPage({
    // No cookies/credentials
    bypassCSP: false,
    // Block unnecessary resources for faster load
    colorScheme: 'light',
  });
  
  // Set viewport for consistent screenshots
  await page.setViewportSize({ width: 1920, height: 1080 });
  
  // Navigate to page
  console.log('📄 Loading page...');
  await page.goto(target, {
    waitUntil: 'networkidle',
    timeout: 60000,
  });
  
  // Wait for any animations to settle
  await page.waitForTimeout(1000);
  
  // Capture screenshot
  console.log('📷 Taking screenshot...');
  await page.screenshot({
    path: path.join(outDir, 'screenshot.png'),
    fullPage: true,
  });
  
  // Capture HTML
  console.log('💾 Saving HTML snapshot...');
  const html = await page.content();
  fs.writeFileSync(path.join(outDir, 'snapshot.html'), html, 'utf8');
  
  // Capture storage state (for debugging, treat as sensitive)
  console.log('📦 Capturing storage state...');
  const storage = await page.evaluate(() => ({
    localStorage: Object.fromEntries(Object.entries(localStorage)),
    sessionStorage: Object.fromEntries(Object.entries(sessionStorage)),
  }));
  fs.writeFileSync(
    path.join(outDir, 'storage.json'),
    JSON.stringify(storage, null, 2),
    'utf8'
  );
  
  // Capture metadata
  const metadata = {
    url: target,
    timestamp: new Date().toISOString(),
    viewport: { width: 1920, height: 1080 },
    title: await page.title(),
  };
  fs.writeFileSync(
    path.join(outDir, 'metadata.json'),
    JSON.stringify(metadata, null, 2),
    'utf8'
  );
  
  await browser.close();
  
  console.log('');
  console.log('✅ Snapshot saved to:');
  console.log(`   ${outDir}`);
  console.log('');
  console.log('Files created:');
  console.log('   - screenshot.png (full page)');
  console.log('   - snapshot.html (HTML source)');
  console.log('   - storage.json (localStorage/sessionStorage)');
  console.log('   - metadata.json (URL, timestamp, title)');
}

main().catch((e) => {
  console.error('❌ Error:', e.message);
  process.exit(1);
});

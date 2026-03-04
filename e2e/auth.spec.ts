/**
 * Auth Flow E2E Tests
 * 
 * Tests:
 * 1. Registration with email/password
 * 2. Login with email/password
 * 3. Protected route access (/me)
 * 4. Logout
 * 
 * Usage: pnpm e2e
 */

import { test, expect } from '@playwright/test';

// Generate unique email for each test run
const generateTestEmail = () => `test+${Date.now()}@example.com`;
const TEST_PASSWORD = 'TestPassword123!';

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Clear cookies before each test
    await page.context().clearCookies();
  });

  test.describe('Registration', () => {
    test('should display registration page', async ({ page }) => {
      await page.goto('/auth/register');
      
      await expect(page).toHaveTitle(/Knowledge Graph Studio/);
      await expect(page.getByText('Create Account')).toBeVisible();
      await expect(page.getByPlaceholder('Enter your email')).toBeVisible();
      await expect(page.getByPlaceholder('Create a password')).toBeVisible();
      await expect(page.getByPlaceholder('Confirm your password')).toBeVisible();
    });

    test('should register new user with email and password', async ({ page }) => {
      const email = generateTestEmail();
      
      await page.goto('/auth/register');
      
      // Fill registration form
      await page.getByPlaceholder('Enter your email').fill(email);
      await page.getByPlaceholder('Create a password').fill(TEST_PASSWORD);
      await page.getByPlaceholder('Confirm your password').fill(TEST_PASSWORD);
      
      // Submit
      await page.getByRole('button', { name: 'Register' }).click();
      
      // Should show success message or redirect
      await expect(page.getByText(/Registration successful|Check your email/i)).toBeVisible({ timeout: 10000 });
    });

    test('should show error for mismatched passwords', async ({ page }) => {
      await page.goto('/auth/register');
      
      await page.getByPlaceholder('Enter your email').fill(generateTestEmail());
      await page.getByPlaceholder('Create a password').fill(TEST_PASSWORD);
      await page.getByPlaceholder('Confirm your password').fill('DifferentPassword123!');
      
      await page.getByRole('button', { name: 'Register' }).click();
      
      await expect(page.getByText(/Passwords do not match/i)).toBeVisible();
    });

    test('should show error for short password', async ({ page }) => {
      await page.goto('/auth/register');
      
      await page.getByPlaceholder('Enter your email').fill(generateTestEmail());
      await page.getByPlaceholder('Create a password').fill('short');
      await page.getByPlaceholder('Confirm your password').fill('short');
      
      await page.getByRole('button', { name: 'Register' }).click();
      
      await expect(page.getByText(/at least 6 characters/i)).toBeVisible();
    });
  });

  test.describe('Login', () => {
    test('should display login page with password option', async ({ page }) => {
      await page.goto('/auth/login');
      
      await expect(page).toHaveTitle(/Knowledge Graph Studio/);
      await expect(page.getByText('Sign in to your account')).toBeVisible();
      await expect(page.getByRole('button', { name: 'Password' })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Magic Link' })).toBeVisible();
    });

    test('should login with email and password', async ({ page }) => {
      // Use a known test user or create one first
      const email = process.env.TEST_USER_EMAIL || generateTestEmail();
      const password = process.env.TEST_USER_PASSWORD || TEST_PASSWORD;
      
      await page.goto('/auth/login');
      
      // Ensure password login is selected
      await page.getByRole('button', { name: 'Password' }).click();
      
      // Fill login form
      await page.getByPlaceholder('Enter your email').fill(email);
      await page.getByPlaceholder('Enter your password').fill(password);
      
      // Submit
      await page.getByRole('button', { name: 'Sign In' }).click();
      
      // Should redirect to /me or home on success
      // Note: This test requires a pre-existing user
      // For CI, use environment variables to provide test credentials
      if (process.env.TEST_USER_EMAIL) {
        await expect(page).toHaveURL(/\/me|^\/$/, { timeout: 10000 });
      }
    });

    test('should show error for invalid credentials', async ({ page }) => {
      await page.goto('/auth/login');
      await page.getByRole('button', { name: 'Password' }).click();
      
      await page.getByPlaceholder('Enter your email').fill('invalid@example.com');
      await page.getByPlaceholder('Enter your password').fill('wrongpassword');
      
      await page.getByRole('button', { name: 'Sign In' }).click();
      
      // Should show error message
      await expect(page.getByText(/Error|Invalid/i)).toBeVisible({ timeout: 10000 });
    });

    test('should toggle between password and magic link login', async ({ page }) => {
      await page.goto('/auth/login');
      
      // Start with password form visible
      await expect(page.getByPlaceholder('Enter your password')).toBeVisible();
      
      // Switch to magic link
      await page.getByRole('button', { name: 'Magic Link' }).click();
      await expect(page.getByPlaceholder('Enter your password')).not.toBeVisible();
      await expect(page.getByText('Send Magic Link')).toBeVisible();
      
      // Switch back to password
      await page.getByRole('button', { name: 'Password' }).click();
      await expect(page.getByPlaceholder('Enter your password')).toBeVisible();
    });
  });

  test.describe('Protected Routes', () => {
    test('should redirect unauthenticated user from /me to login', async ({ page }) => {
      await page.goto('/me');
      
      // Should redirect to login
      await expect(page).toHaveURL(/\/auth\/login/, { timeout: 10000 });
    });

    test('should show profile page after login', async ({ page }) => {
      const email = process.env.TEST_USER_EMAIL;
      const password = process.env.TEST_USER_PASSWORD;
      
      if (!email || !password) {
        console.log('Skipping profile test: TEST_USER_EMAIL and TEST_USER_PASSWORD not set');
        test.skip();
        return;
      }
      
      // Login
      await page.goto('/auth/login');
      await page.getByRole('button', { name: 'Password' }).click();
      await page.getByPlaceholder('Enter your email').fill(email);
      await page.getByPlaceholder('Enter your password').fill(password);
      await page.getByRole('button', { name: 'Sign In' }).click();
      
      // Wait for redirect
      await expect(page).toHaveURL(/\/me/, { timeout: 10000 });
      
      // Verify profile page shows user info
      await expect(page.getByText('Your Profile')).toBeVisible();
      await expect(page.getByText(email)).toBeVisible();
    });
  });

  test.describe('Logout', () => {
    test('should logout successfully', async ({ page }) => {
      const email = process.env.TEST_USER_EMAIL;
      const password = process.env.TEST_USER_PASSWORD;
      
      if (!email || !password) {
        test.skip();
        return;
      }
      
      // Login first
      await page.goto('/auth/login');
      await page.getByRole('button', { name: 'Password' }).click();
      await page.getByPlaceholder('Enter your email').fill(email);
      await page.getByPlaceholder('Enter your password').fill(password);
      await page.getByRole('button', { name: 'Sign In' }).click();
      await expect(page).toHaveURL(/\/me/, { timeout: 10000 });
      
      // Logout
      await page.getByRole('button', { name: 'Sign Out' }).click();
      
      // Should redirect to login
      await expect(page).toHaveURL(/\/auth\/login/, { timeout: 10000 });
    });
  });
});

test.describe('Navigation', () => {
  test('should navigate from login to register', async ({ page }) => {
    await page.goto('/auth/login');
    
    await page.getByRole('link', { name: 'Register' }).click();
    
    await expect(page).toHaveURL('/auth/register');
  });

  test('should navigate from register to login', async ({ page }) => {
    await page.goto('/auth/register');
    
    await page.getByRole('link', { name: 'Sign in' }).click();
    
    await expect(page).toHaveURL('/auth/login');
  });
});

import { test, expect } from '@playwright/test'

test.describe('Dashboard Loading', () => {
  test('shows skeleton screens while loading', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Check skeleton screens are visible
    await expect(page.locator('.animate-pulse')).toBeVisible()
    
    // Wait for content to load
    await page.waitForSelector('[data-testid="stats-cards"]', { state: 'visible' })
    
    // Check skeletons are gone
    await expect(page.locator('.animate-pulse')).toHaveCount(0)
  })

  test('renders 7-step animation sequence', async ({ page }) => {
    await page.goto('/dashboard')
    
    // Header should appear first (0ms)
    await expect(page.locator('header')).toBeVisible()
    
    // Stats cards should stagger in (200ms + 50ms per card)
    await page.waitForTimeout(500)
    const cards = page.locator('[data-testid="stat-card"]')
    await expect(cards.first()).toBeVisible()
    
    // DataGrid should appear (400ms)
    await expect(page.locator('[data-testid="datagrid"]')).toBeVisible()
    
    // Action bar should slide up last (600ms)
    await expect(page.locator('[data-testid="action-bar"]')).toBeVisible()
  })

  test('handles empty state gracefully', async ({ page }) => {
    await page.goto('/dashboard?empty=true')
    
    await expect(page.getByText('No resources found')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Run AI Queue' })).toBeVisible()
  })
})

import { test, expect } from '@playwright/test'

test.describe('Bulk Actions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/dashboard')
    await page.waitForSelector('[data-testid="datagrid"]')
  })

  test('enables bulk actions when items selected', async ({ page }) => {
    const firstCheckbox = page.locator('input[type="checkbox"]').first()
    await firstCheckbox.check()
    
    const bulkButton = page.getByRole('button', { name: 'Bulk Actions' })
    await expect(bulkButton).toBeEnabled()
    await expect(bulkButton).toContainText('1 selected')
  })

  test('bulk approve works', async ({ page }) => {
    const checkboxes = page.locator('input[type="checkbox"]')
    await checkboxes.nth(0).check()
    await checkboxes.nth(1).check()
    
    await page.getByRole('button', { name: 'Bulk Actions' }).click()
    await page.getByRole('menuitem', { name: 'Approve Selected' }).click()
    
    await expect(page.getByText('2 resources approved')).toBeVisible()
  })

  test('approval dialog appears on manual review', async ({ page }) => {
    await page.getByRole('button', { name: 'Edit' }).first().click()
    
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByText('Review Categorization')).toBeVisible()
  })
})

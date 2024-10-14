import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test.describe('Index page', () => {
  test('has correct title', async ({ page }) => {
    await expect(page.getByText('🐴 J-League Tracker 🐴')).toBeVisible()
  })

  test('has correct logo', async ({ page }) => {
    await expect(page.getByRole('img', { name: 'logo' })).toBeVisible()
  })
})

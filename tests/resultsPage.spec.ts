import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/results/')
})

test.describe('Results page', () => {
  test('has correct title', async ({ page }) => {
    await expect(page.getByText('試合結果')).toBeVisible()
  })

  test('can select year', async ({ page }) => {
    await page.selectOption('select[name=year]', '2021')
    await page.waitForFunction(() => {
      const select = document.querySelector('select[name=year]') as HTMLSelectElement
      return select?.value === '2021'
    })
    expect(page.url()).toContain('year=2021')
  })

  test('can select category', async ({ page }) => {
    await page.selectOption('select[name=category]', 'J2')
    await page.waitForFunction(() => {
      const select = document.querySelector('select[name=category]') as HTMLSelectElement
      return select?.value === 'J2'
    })
    expect(page.url()).toContain('category=J2')
  })

  test('can select display', async ({ page }) => {
    await page.click('button[name=display][value=graph]')
    await page.waitForFunction(() => {
      const button = document.querySelector('button[name=display][value=graph]') as HTMLButtonElement
      return button?.classList?.contains('active')
    })
    expect(page.url()).toContain('display=graph')
  })

  test('can select section at table tab', async ({ page }) => {
    await page.click('button[name=display][value=table]')
    await page.waitForFunction(() => {
      const button = document.querySelector('button[name=display][value=table]') as HTMLButtonElement
      return button?.classList?.contains('active')
    })
    await page.fill('input[name=section]', '10')
    await page.waitForFunction(() => {
      const range = document.querySelector('input[name=section]') as HTMLInputElement
      return range?.value === '10'
    })
    await expect(page.getByText('第10節')).toBeVisible()
    expect(page.url()).toContain('section=10')
  })

  test('can select team at team tab', async ({ page }) => {
    await page.selectOption('select[name=year]', '2024')
    await page.waitForFunction(() => {
      const select = document.querySelector('select[name=year]') as HTMLSelectElement
      return select?.value === '2024'
    })
    await page.selectOption('select[name=category]', 'J2')
    await page.waitForFunction(() => {
      const select = document.querySelector('select[name=category]') as HTMLSelectElement
      return select?.value === 'J2'
    })
    await page.click('button[name=display][value=team]')
    await page.waitForFunction(() => {
      const button = document.querySelector('button[name=display][value=team]') as HTMLButtonElement
      return button?.classList?.contains('active')
    })
    await page.selectOption('select[name=team]', '熊本')
    await page.waitForFunction(() => {
      const select = document.querySelector('select[name=team]') as HTMLSelectElement
      return select?.value === '熊本'
    })
    expect(page.url()).toContain('team=kumamoto')
  })

  test('shows roasso won j3 with 54 points in 2021', async ({ page }) => {
    await page.selectOption('select[name=year]', '2021')
    await page.waitForFunction(() => {
      const select = document.querySelector('select[name=year]') as HTMLSelectElement
      return select?.value === '2021'
    })
    await page.selectOption('select[name=category]', 'J3')
    await page.waitForFunction(() => {
      const select = document.querySelector('select[name=category]') as HTMLSelectElement
      return select?.value === 'J3'
    })
    await page.click('button[name=display][value=table]')
    await page.waitForFunction(() => {
      const button = document.querySelector('button[name=display][value=table]') as HTMLButtonElement
      return button?.classList?.contains('active')
    })
    const firstTeamTr = page.locator('#league-table tbody tr:first-child')
    await expect(firstTeamTr).toContainText('ロアッソ熊本')
    const lastTdOfFirstTeamTr = firstTeamTr.locator('td:last-child')
    await expect(lastTdOfFirstTeamTr).toHaveText('54')
  })

  test('shows roasso ranked 4 in j2 in 2022', async ({ page }) => {
    await page.selectOption('select[name=year]', '2022')
    await page.waitForFunction(() => {
      const select = document.querySelector('select[name=year]') as HTMLSelectElement
      return select?.value === '2022'
    })
    await page.selectOption('select[name=category]', 'J2')
    await page.waitForFunction(() => {
      const select = document.querySelector('select[name=category]') as HTMLSelectElement
      return select?.value === 'J2'
    })
    await page.click('button[name=display][value=table]')
    await page.waitForFunction(() => {
      const button = document.querySelector('button[name=display][value=table]') as HTMLButtonElement
      return button?.classList?.contains('active')
    })
    const fourthTeamTr = page.locator('#league-table tbody tr:nth-child(4)')
    await expect(fourthTeamTr).toContainText('ロアッソ熊本')
    const firstTdOfFourthTeamTr = fourthTeamTr.locator('td:first-child')
    await expect(firstTdOfFourthTeamTr).toHaveText('4')
  })

  test('shows roasso won the final match in J2 in 2023', async ({ page }) => {
    await page.selectOption('select[name=year]', '2023')
    await page.waitForFunction(() => {
      const select = document.querySelector('select[name=year]') as HTMLSelectElement
      return select?.value === '2023'
    })
    await page.selectOption('select[name=category]', 'J2')
    await page.waitForFunction(() => {
      const select = document.querySelector('select[name=category]') as HTMLSelectElement
      return select?.value === 'J2'
    })
    await page.click('button[name=display][value=team]')
    await page.waitForFunction(() => {
      const button = document.querySelector('button[name=display][value=team]') as HTMLButtonElement
      return button?.classList?.contains('active')
    })
    await page.selectOption('select[name=team]', '熊本')
    await page.waitForFunction(() => {
      const select = document.querySelector('select[name=team]') as HTMLSelectElement
      return select?.value === '熊本'
    })
    const lastMatchTr = page.locator('#league-team-results tbody tr:last-child')
    await expect(lastMatchTr).toContainText('勝')
    await expect(lastMatchTr).toContainText('🏠')
    await expect(lastMatchTr).toContainText('3 - 1')
  })
})

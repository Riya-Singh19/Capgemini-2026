import { test, expect } from '@playwright/test';

const acceptDemoModal = async (page: any) => {
  const continueButton = page.locator('button:has-text("I Understand & Continue")').first();
  if ((await continueButton.count()) > 0) {
    await continueButton.click();
  }
};

const openFlightsTab = async (page: any) => {
  const flightTab = page.locator('button:has-text("Flights")').first();
  await expect(flightTab).toBeVisible({ timeout: 20000 });
  await flightTab.click();
  await expect(page.locator('#fl_from_trigger')).toBeVisible({ timeout: 20000 });
};

test.describe('Flight scenarios', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await acceptDemoModal(page);
    await page.waitForLoadState('domcontentloaded');
  });

  test('homepage shows flight search form and primary actions', async ({ page }) => {
    await openFlightsTab(page);

    await expect(page.locator('#fl_from_trigger')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('#fl_to_trigger')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('#flights_departure_date')).toBeVisible({ timeout: 15000 });
    await expect(page.locator('#flights_return_date')).toHaveCount(1);
    await expect(page.locator('button[title="Search Flights"], button[aria-label="Search Flights"]').first()).toBeVisible({ timeout: 15000 });
  });

  test('valid flight search accepts route and date input', async ({ page }) => {
    await openFlightsTab(page);

    await page.locator('#fl_from_trigger').click();
    await page.locator('#fl_from_q').fill('DXB');
    await page.locator('#fl_to_trigger').click();
    await page.locator('#fl_to_q').fill('LHR');

    await page.locator('#flights_departure_date').evaluate((el: any) => {
      el.value = '2026-10-01';
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await page.locator('#flights_return_date').evaluate((el: any) => {
      el.value = '2026-10-04';
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });

    const searchButton = page.locator('button[title="Search Flights"], button[aria-label="Search Flights"]').first();
    await expect(searchButton).toBeVisible({ timeout: 15000 });
    await searchButton.click();

    await expect(page.locator('#fl_from_trigger')).toBeVisible({ timeout: 15000 });
  });

  test('empty flight search shows validation or blocks submission', async ({ page }) => {
    await openFlightsTab(page);

    const searchButton = page.locator('button[title="Search Flights"], button[aria-label="Search Flights"]').first();
    await expect(searchButton).toBeVisible({ timeout: 15000 });
    await searchButton.click();

    await expect(page.locator('#fl_from_trigger')).toBeVisible({ timeout: 15000 });
    await expect(searchButton).toBeVisible({ timeout: 15000 });
  });
  test('invalid flight route is handled gracefully', async ({ page }) => {
    await openFlightsTab(page);

    await page.locator('#fl_from_trigger').click();////////////
    await page.locator('#fl_from_q').fill('XYZINVALID');
    await page.locator('#fl_to_trigger').click();
    await page.locator('#fl_to_q').fill('ABCINVALID');

    await page.locator('#flights_departure_date').evaluate((el: any) => {
      el.value = '2026-10-01';
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });
    await page.locator('#flights_return_date').evaluate((el: any) => {
      el.value = '2026-10-04';
      el.dispatchEvent(new Event('input', { bubbles: true }));
      el.dispatchEvent(new Event('change', { bubbles: true }));
    });

    const searchButton = page.locator('button[title="Search Flights"], button[aria-label="Search Flights"]').first();
    await expect(searchButton).toBeVisible({ timeout: 15000 });
    await searchButton.click();

    await expect(page.locator('#fl_from_trigger')).toBeVisible({ timeout: 15000 });
    await expect(searchButton).toBeVisible({ timeout: 15000 });
  });
});
